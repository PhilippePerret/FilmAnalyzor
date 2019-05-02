'use strict'
/**
 * Les instances de class FAnalyse
 * -----------------
 * Pour l'analyse d'un film
 */

let SttNode = null

window.current_analyse = null // définie au ready

class FAnalyse {

// ---------------------------------------------------------------------
//  CLASSE

// Retourne l'analyse courante
static get current(){return this._current||defP(this,'_current',current_analyse)}
static set current(v){this._current = v}

// Voir si les préférences demandent que la dernière analyse soit chargée
// et la charger si elle est définie.
static checkLast(){
  var dprefs = Prefs.get(['load_last_on_launching', 'last_analyse_folder'])
  // console.log("prefs:", dprefs)
  if (!dprefs['load_last_on_launching']) return
  if (!dprefs['last_analyse_folder']) return
  var apath = path.resolve(dprefs['last_analyse_folder'])
  if(fs.existsSync(apath)){
    this.load(apath)
  } else {
    // console.log("Impossible de trouver le dossier :", apath)
    F.error(`Impossible de trouver le dossier de l'analyse à charger :<br>${apath}`)
    Prefs.set({'last_analyse_folder':null})
  }
}

/**
 * Méthode appelée par le menu "Nouvelle…" pour créer une nouvelle analyse
 *
 */
static onWantNewAnalyse(){
  this.checkIfCurrentSavedBeforeExec('creation_new_analyse')
}
/**
 * Méthode appelée par le menu "Ouvrir…" pour ouvrir une analyse
 * existante.
 */
static chooseAnalyse(){
  this.checkIfCurrentSavedBeforeExec('choose_analyse')
}

/**
 * Pour choisir une nouvelle analyse ou en créer une nouvelle, il faut
 * d'abord s'assurer que l'analyse courante, si elle existe, a bien été
 * sauvegardée. Si c'est le cas, alors on exécute la méthode suivante.
 */
static checkIfCurrentSavedBeforeExec(toolName){
  var toolMethod = require(`./js/tools/${toolName}.js`).bind(this)
  if (current_analyse && current_analyse.modified && !current_analyse.locked){
    var my = this
    DIALOG.showMessageBox(null, {
        type: 'question'
      , buttons: ['Sauver', 'Annuler', 'Ignorer les changements' ]
      , defaultId: 0
      , title: 'Sauvegarde de l’analyse courante'
      , message: "L'analyse courante a été modifiée. Que souhaitez-vous faire avant de charger la suivante ?"
    }, (reponse) => {
      // console.log("reponse:", reponse)
      switch (reponse) {
        case 0:
          current_analyse.methodAfterSaving = toolMethod()
          current_analyse.save()
          return
        case 1: // Annuler
          return false
        case 2: // ignorer les changements (sauf les data, normal)
          current_analyse.saveData() // toujours enregistrées
          toolMethod()
          break
      }
    })
  } else {
    toolMethod()
  }
}

static setGlobalOption(opt_id, opt_value){
  require('./js/tools/global_options.js').setGlobalOption(opt_id, opt_value)
}
static toggleGlobalOption(opt_id){
  require('./js/tools/global_options.js').toggleGlobalOption(opt_id)
}

/**
 * Méthode qui checke si le dossier +folder+ est un dossier d'analyse
 * valide. Il doit contenir les fichiers de base. Sinon, proposer à
 * l'user de créer une nouvelle analyse.
 */
static isDossierAnalyseValid(folder, withMessage){
  if(undefined === withMessage) withMessage = true
  try {
    var eventsPath = path.join(folder,'events.json')
    var dataPath   = path.join(folder,'data.json')
    fs.existsSync(eventsPath) || raise('Le fichier des events est introuvable.')
    fs.existsSync(dataPath)   || raise('Le fichier de data est introuvable.')
    return true
  } catch (e) {
    withMessage && console.log(e)
    return false
  }
}

/**
 * Instanciation de l'analyse à partir du path de son dossier
 */
constructor(pathFolder){
  this._folder  = path.resolve(pathFolder)
  this.events   = []
}

/**
  Méthode appelée depuis le menu 'Outils' pour rejoindre la dernière
  scène définie, (quand on est en mode collecte)
**/
goToLastScene(){
  this.locator.setTime(FAEscene.lastScene.time)
}

get PFA(){
  if(undefined === this._PFA){
    SttNode   = require('./js/common/PFA/SttNode.js')
    this._PFA = require('./js/common/PFA/PFA.js')
    this._PFA.init()
  }
  return this._PFA
}

get Fonds(){
  if(undefined === this._Fonds){
    this._Fonds = require('./js/common/Fondamentales/Fonds.js')
    this._Fonds.init(this)
  }
  return this._Fonds
}

get decors(){ return FADecor }

// {FAProtocole} Le protocole de l'analyse courante
get protocole(){return this._protocole||defP(this,'_protocole',new FAProtocole(this))}

// ---------------------------------------------------------------------

/**
 * Méthode appelée lorsque la vidéo elle-même est chargée. C'est le moment
 * où l'on est vraiment prêt.
 */
onVideoLoaded(){
  // console.log("-> FAnalyse#onVideoLoaded")

  // On peut marquer l'état d'avancement de l'analyse
  this.setupState()

  // Au cours du dispatch des données, la méthode modified a été invoquée
  // de nombreuses fois. Il faut revenir à l'état normal.
  this.modified = false
  UI.stopWait()// toujours, au cas où
  // On peut indiquer aux menus qu'il y a une analyse chargée
  ipc.send('current-analyse-exist', true)
  // Si une fonction a été définie pour la fin du chargement, on
  // peut l'appeler maintenant.
  if ('function' == typeof this.methodeAfterLoading){
    this.methodeAfterLoading()
  }
  // On appelle la méthode de sandbox
  if(!MODE_TEST)Sandbox.run()
}

// Méthode pour régler l'état de l'analyse
setupState(){
  if(undefined === this.setupStateTries) this.setupStateTries = 1
  else ++ this.setupStateTries
  if (this.setupStateTries > 10){
    console.error("Trop de tentatives pour charger FAStater. J'abandonne.")
    return
  }
  FAStater.inited || FAStater.init(this)
  FAStater.displaySumaryState()
}
updateState(){
  FAStater.updateSumaryState()
}

init(){
  // On met le titre dans la fenêtre
  this.setTitle()
  // On règle le cadenas si elle est verrouillée
  this.setMarkModified()
  // Si l'analyse courante définit une vidéo, on la charge et on prépare
  // l'interface. Sinon, on masque la plupart des éléments
  this.videoController.setVideoUI(!!this.videoPath)
  if (this.videoPath){
    this.videoController.load(this.videoPath)
  } else {
    F.error(T('video-path-required'))
    this.onVideoLoaded()
  }
}

setTitle(){
  window.document.title = `Analyse du film « ${this.title} (${this.version}) »`
}

// ---------------------------------------------------------------------
//  MÉTHODES D'AFFICHAGE

exportAs(format){
  if('undefined'===typeof FABuilder) return this.loadBuilder(this.exportAs.bind(this,format))
  FABuilder.createNew().exportAs(format)
}

// Pour afficher le protocole de l'analyse
displayProtocole(){this.protocole.show()}

/**
* Pour afficher la Timeline
**/
displayTimeline(){MainTimeline.toggle()}

/**
 * Méthode appelée quand on clique sur le menu "Affichage > Analyse complète"
 *
 * Pour le moment, on construit chaque fois l'analyse. Plus tard, peut-être
 * qu'il y aura un menu particulier pour le faire
 */
displayFullAnalyse(forcer){
  if(undefined === forcer) forcer = false
  var callback = this.displayFullAnalyse.bind(this, forcer)
  if(NONE === typeof FABuilder) return this.loadBuilder(callback)
  if(NONE === typeof FAExporter)return this.loadExporter(callback)
  if(NONE === typeof FAReport)return this.loadReporter(callback)
  FABuilder.createNew().show({force_update: forcer})
  callback = null
}

displayLastReport(){
  var callback = this.displayLastReport.bind(this)
  if(NONE === typeof FAReport)return this.loadReporter(callback)
  FAReport.showLast()
}


displayPFA(){
  this.PFA.toggle()
}
displayInfosFilm(){
  const FAInfosFilm = require('./js/tools/building/infos_film.js')
  new FAInfosFilm(this).display()
}
displayDecors(){
  require('./js/tools/building/decors.js').bind(this)()
}
displayFondamentales(){
  require('./js/tools/building/fondamentales.js').bind(this)()
}
displayBrins(){ FABrin.display() }
displayStatistiques(){
  // TODO
  F.error("Les Statistiques ne sont pas encore implémentées. Passer par l'affichage de l'analyse (en ajoutant `BUILD Statistiques` au script d'assemblage).")
}
displayAnalyseState(){ FAStater.displayFullState() }

newVersionRequired(){
  var method = require('./js/tools/new_version.js')
  method.bind(this)()
}

/**
 * Méthode qui ouvre le writer
 */
openDocInWriter(dtype){
  if('undefined' === typeof Snippets) return FAnalyse.loadSnippets(this.openDocInWriter.bind(this, dtype))
  // if( NONE === typeof FAWriter){
  //   return System.loadComponant('faWriter', this.openDocInWriter.bind(this, dtype))
  // }
  if(!FAWriter.inited) FAWriter.init()
  FAWriter.openDoc(dtype)
}
/**
 * Pour obtenir un nouvel "eventer", c'est-à-dire une liste filtrable
 * des events.
 */
createNewEventer(){
  return FAEventer.createNew() // on le retourne pour les tests
}

// ---------------------------------------------------------------------
// MÉTHODES OPTIONS

get options(){ return this._options || defP(this,'_options', new Options(this))}

// Méthode à lancer après le chargement des données ou après la
// sauvegarde
// Pour le moment, ne sert que pour les tests.
get methodeAfterLoading(){return this._methodeAfterLoading}
set methodeAfterLoading(v){this._methodeAfterLoading = v}
get methodAfterSaving(){return this._methodAfterSaving}
set methodAfterSaving(v){this._methodAfterSaving = v}

forEachEvent(method, options){
  if(undefined === options){options = {}}
  var i   = options.from || 0
    , len = options.to || this.events.length
    ;
  for(;i<len;++i){
    if(false === method(this.events[i])) break // pour interrompre
  }
}

/**
  Méthode ajoutant un évènement

  +nev+ (pour "Nouvel Event"). L'instance FAEvent::<sous classe> de
  l'évènement à ajouter. Noter qu'elle a déjà été vérifiée et qu'elle est
  donc parfaitement valide ici.

 */
addEvent(nev) {
  (this._addEvent||requiredChunk(this,'addEvent')).bind(this)(nev)
  FAStater.update()
}

// Pour éditer l'event d'identifiant +event_id+
editEvent(event_id){
  return EventForm.editEvent.bind(EventForm, this.ids[event_id])()
}
// Pour éditer le document d'identifiant +doc_id+
// Note : on pourrait y aller directement, mais c'est pour compatibiliser
// les choses
editDocument(doc_id){
  return FAWriter.openDoc(doc_id)
}

/**
 * Procédure de description de l'event
 */
destroyEvent(event_id, form_instance){
  (this._destroyEvent||requiredChunk(this,'destroyEvent')).bind(this)(event_id, form_instance)
  FAStater.update()
}
/**
 * Méthode appelée à la modification d'un event
 *
 * [1]  En règle générale, si une opération spéciale doit être faite sur
 *      l'event, il vaut mieux définir sa méthode d'instance `onModify` qui
 *      sera automatiquement appelée après la modification.
 */
updateEvent(ev, options){
  log.info("-> FAnalyse#updateEvent")
  var new_idx = undefined
  if (options && options.initTime != ev.time){
    var idx_init      = this.indexOfEvent(ev.id)
    var next_ev_old   = this.events[idx_init + 1]
    var idx_new_next  = this.getIndexOfEventAfter(ev.time)
    var next_ev_new   = this.events[idx_new_next]
    if( next_ev_old != next_ev_new){
      // => Il faut replacer l'event au bon endroit
      this.events.splice(idx_init, 1)
      var new_idx = this.getIndexOfEventAfter(ev.time)
      this.events.splice(new_idx, 0, ev)
    }
  }
  // [1]
  if (ev.type === 'scene'){
    FAEscene.updateAll()
    FADecor.resetAll()
  }
  // On actualise tous les autres éléments (par exemple l'attribut data-time)
  ev.updateInUI()
  // On marque l'analyse modifiée
  this.modified = true
  // Enfin, s'il est affiché, il faut updater son affichage dans le
  // reader (et le replacer si nécessaire)
  ev.updateInReader(new_idx)
  // Et enfin on actualise l'état d'avancement
  FAStater.update()
  next_ev_old = null
  next_ev_new = null

  log.info("<- FAnalyse#updateEvent")
}

getEventById(eid){
  console.warn("DEPRECATED: Il vaut mieux utiliser la méthode FAEvent.get() que FAnalyse#getEventById")
  return this.ids[eid]
}

getSceneNumeroAt(time){
  var scene = FAEscene.at(time)
  if(scene && scene.isRealScene) return scene.numero
  else return 0
}

/**
 * Retourne l'index de l'évènement qui se trouve juste après le temps +time+
 *
 * La méthode permet principalement de placer les nouveaux évènements
 */
getIndexOfEventAfter(time){
  var i = 0
    , len = this.events.length ;
  for(i;i<len;++i) { if(this.events[i].time > time) { return i } }
  return len
}
/**
 * Retourne l'index de l'event d'identifiant +event_id+
 *
 * Noter que cette méthode peut devenir extrêmement lente avec de nombreux
 * events dans l'analyse. Il faudrait opter pour un autre système, peut-être
 * depuis des `event_after` et `event_before`
 * TODO Voir d'abord où on se sert exactement de la liste this.events comme
 * liste.
 */
indexOfEvent(event_id){
  var i = 0, len = this.events.length ;
  for(;i<len;++i) { if(this.events[i].id == event_id) { return i } }
}

  // --- FONCTIONS I/O ----------------------------------------------

/**
  Méthode appelée par le menu « Analyse > Verrouiller » qui
  permet de verrouiller ou de déverrouiller l'analyse courante,
  c'est-à-dire de permettre ou non ses modifications.
**/
toggleLock(){
  if(this.saveTimer) this.stopTimerSave()
  this.locked = !!!this.locked
  this.saveData(true /* pour forcer le verrou, seulement pour enregistrer cette valeur */)
  this.setMarkModified()
  if(false === this.locked) this.runTimerSave()
}

/**
  Méthode pour régler la marque de modification
  Si l'analyse est verrouillée, un petit cadenas prend la place du rond,
  sinon c'est un rond
**/
setMarkModified(){
  this.markModified.html(this.locked ? '<img src="img/cadenas.png" style="width:15px;vertical-align:top;margin-left:6px;" />' : '•')
}

get SAVED_FILES(){
  if(undefined === this._saved_files){
    this._saved_files = [
        this.eventsFilePath
      , this.dataFilePath
    ]
  }
  return this._saved_files
}

get PROP_PER_FILE(){
  if(undefined === this._prop_per_path){
    this._prop_per_path = {}
    this._prop_per_path[this.eventsFilePath]  = 'eventsIO'
    this._prop_per_path[this.dataFilePath]    = 'data'
  }
  return this._prop_per_path
}

/**
 * Appelée par le menu pour sauver l'analyse
 */
saveIfModified(){
  if(this.locked) return F.notify(T('analyse-locked-no-save'), {error: true})
  this.stopTimerSave() // ne fera rien si rien à faire
  this.modified && this.save()
  this.runTimerSave() // ne fera rien si analyse.locked
}

/**
 * Méthode appelée pour sauver l'analyse courante
 */
save() {
  if(this.locked) return F.notify(T('analyse-locked-no-save'), {error: true})
  if(this.saveTimer){
    // <= L'enregistrement automatique est activé
    // => Il faut l'interrompre
    // note : il sera remis en route à la toute fin de l'enregistrement
    this.stopTimerSave()
  }
  // En même temps qu'on sauve les fichiers, on enregistre le fichier
  // des modifiés (seuls les events modifiés à cette session sont
  // enregistrés)
  FAEvent.saveModifieds()
  // On sauve les options toutes seules, ça se fait de façon synchrone
  this.options.saveIfModified()
  this.savers = 0
  this.savables_count = this.SAVED_FILES.length
  for(var fpath of this.SAVED_FILES){
    this.saveFile(fpath, this.PROP_PER_FILE[fpath])
  }
}
/**
 * Méthode qui n'est appelée (a priori) qu'à la fermeture de la
 * fenêtre, et au changement d'analyse.
 * @synchrone
 * Elle doit être synchrone pour quitter l'application
 * normalement.

  @param {Boolean} force_lock   Mis à true pour forcer l'enregistrement même
                                si l'analyse est verouillée. À utiliser avec
                                beaucoup de prudence.
 */
saveData(force_lock){
  if(this.locked && !force_lock) return F.notify(T('analyse-locked-no-save'), {error: true})
  fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data), 'utf8')
}

/**
  * Procédure prudente de sauvegarde
  *
  * @asynchrone
  *
  * Par mesure de prudence, on procède toujours en inscrivant le
  * fichier sur le disque, sous un autre nom, puis on change son nom
  * en mettant l'original en backup (s'il n'est pas vide)
  */
saveFile(fpath, prop){
  // Pour le moment, c'est une façon un peu lourde de récupérer
  // la propriété IOFile du fichier, mais on améliorera pas la
  // suite.
  var iofile
  switch (path.basename(fpath)) {
    case 'events.json':
      this.checkEventsList()
      iofile = this.iofileEvent
      break
    case 'data.json':
      iofile = this.iofileData
      break
    default:
      throw("Il faut donner le nom du fichier", fpath)
  }
  iofile.code = this[prop]
  iofile.save({ after: this.setSaved.bind(this, fpath), no_waiting_msg: true })
  return iofile.saved
}

setSaved(fpath){
  this.savers += 1
  if(this.savers === this.savables_count){
    this.modified = false
    this.endSave()
  }
}
/**
  Méthode appelée à la toute fin de la sauvegarde
  Elle remet en route le timer de sauvegarde et elle appelle la méthode
  qui a été définie pour suivre.
**/
endSave(){
  if(this.methodAfterSaving) this.methodAfterSaving()
  this.runTimerSave()
}

// Mettre en route la sauvegarde automatique
runTimerSave(){
  if(this.locked) return
  this.saveTimer = setTimeout(this.saveIfModified.bind(this), 4000)
}
stopTimerSave(){
  if(this.saveTimer){
    clearTimeout(this.saveTimer)
    delete this.saveTimer
  }
}

/**
  Check de la validité de toutes les données
  La méthode checke particulièrement :
    - les associations
    - les numéros de scènes
**/
checkDataValidity(){
  if('undefined' === typeof(AnalyseChecker)){
    require('./js/tools/analyse_checker').bind(this)()
  } else {
    // Quand on le charge toujours dans la page pour l'implémenter
    AnalyseChecker.checkAll(this)
  }
}
/**
  Méthode qui s'assure de ne pas enregistrer d'event en double comme c'est le
  cas avec certains problèmes (non encore décelés)
**/
checkEventsList(){
  log.info('-> FAnalyse#checkEventsList')
  var arrFinal = []
    , traitedIds = {} // pour consigner les ids déjà traités
    , errors = []
  for(var ev of this.events){
    if(undefined === traitedIds[ev.id]){
      // OK
      arrFinal.push(ev)
      traitedIds[ev.id] = true
    } else {
      // L'identifiant a déjà été traité
      // TODO Il faudrait peut-être vérifier si les données sont plus à jour
      // dans l'autre donnée. Mais pour ça, il faudrait absolument demander
      // à l'user
      errors.push(ev.data)
    }
  }
  if(errors.length){
    // <= Il y a eu des erreurs
    // => On actualise la liste et on signale les erreurs
    this.events = arrFinal
    arrFinal = null
    log.warn(`   ERREUR DE DOUBLURE D’EVENTS CORRIGÉE (${errors.length})`, errors)
  } else {
    log.info('   Pas d’erreurs de doublure d’events.')
  }
  log.info('<- FAnalyse#checkEventsList')
}

get iofileEvent() {return this._iofileEvent||defP(this,'_iofileEvent', new IOFile(this.eventsFilePath))}
get iofileData()  {return this._iofileData||defP(this,'_iofileData',    new IOFile(this.dataFilePath))}

/**
  Retourne les évènements sous forme de données simplifiées, pour la sauvegarde

  @return {Object} Les données de tous les events de l'analyse courante.

 */
get eventsIO(){
  var eSaveds = []
  for(var e of this.events){eSaveds.push(e.data)}
  return eSaveds
}

// Prend les données dans le fichier events.json et les dispatche dans
// l'instance d'analyse (au début du travail, en général)
/**
  Reçoit les données des events enregistrés et les transforme en instance
  de leur type.
  @param {Object} v
**/
set eventsIO(eventsData){
  var my = this
    , last_id = -1
    , eventData
  this.events = []
  this.ids    = {}
  for(eventData of eventsData){
    var eClass = eval(`FAE${eventData.type}`)
    var ev = new eClass(my, eventData)
    this.events.push(ev)
    this.ids[ev.id] = ev
    // Pour récupérer le dernier ID unitilisé
    if(ev.id > last_id){last_id = parseInt(ev.id,10)}
  }
  // On peut définir le dernier ID dans EventForm (pour le formulaire)
  EventForm.lastId = last_id
  eventsData = null
  my = null
}

  /**
   * Méthode qui définit le départ réel du film. Permettra de prendre un
   * bon départ
   */
  runTimeFunction(fct_id){
    var underf = `_set${fct_id}At`
    this.requireTimeFunctions(underf)()
  }
  requireTimeFunctions(whichOne){
    return require('./js/tools/timesFunctions')[whichOne].bind(this)
  }

  /**
   * Règle la visibilité du bouton "Aller au début du film" en fonction de la
   * définition ou non de ce temps
   */
  setButtonGoToStart(){
    this.videoController.section.find('.btn-go-to-film-start').css('visibility',this.filmStartTime?'visible':'hidden')
  }

  // ---------------------------------------------------------------------
  //  PATHS

  /**
   * Méthode appelée par le menu "Définir vidéo du film courant…"
   */
  static redefineVideoPath(){
    require('./js/tools/redefine_video_path.js')()
  }


get videoPath(){ return this._videoPath }
set videoPath(v){ this._videoPath = v ; this.modified = true }

get eventsFilePath(){
  return this._eventsFilePath || defP(this,'_eventsFilePath', this.pathOf('events.json'))
}
get dataFilePath(){
  return this._dataFilePath || defP(this,'_dataFilePath', this.pathOf('data.json'))
}
get pfaFilePath(){
  return this._pfaFilePath || defP(this,'_pfaFilePath', this.pathOf('pfa.json'))
}
get fondsFilePath(){
  return this._fondsFilePath || defP(this,'_fondsFilePath', this.filePathOf('fondamentales.yaml'))
}

get markModified(){return this._markModified||defP(this,'_markModified',$('span#modified-indicator'))}

get html_path(){return this._html_path||defP(this,'_html_path',this.defExportPath('html').path)}
get html_name(){return this._html_name||defP(this,'_html_name',this.defExportPath('html').name)}
get pdf_path(){return this._pdf_path||defP(this,'_pdf_path',this.defExportPath('pdf').path)}
get pdf_name(){return this._pdf_name||defP(this,'_pdf_name',this.defExportPath('pdf').name)}
get epub_path(){return this._epub_path||defP(this,'_epub_path',this.defExportPath('epub').path)}
get epub_name(){return this._epub_name||defP(this,'_epub_name',this.defExportPath('epub').name)}
get md_path(){return this._md_path||defP(this,'_md_path',this.defExportPath('md').path)}
get md_name(){return this._md_name||defP(this,'_md_name',this.defExportPath('md').name)}
get mobi_path(){return this._mobi_path||defP(this,'_mobi_path',this.defExportPath('mobi').path)}
get mobi_name(){return this._mobi_name||defP(this,'_mobi_name',this.defExportPath('mobi').name)}
get kindle_path(){return this.mobi_path}
get kindle_name(){return this.mobi_name}

defExportPath(type){
  var n = this[`_${type}_name`] = `${this.filmId}-v${this.version}.${type}`
  var p = this[`_${type}_path`] = path.join(this.folderExport, this[`_${type}_name`])
  return {path: p, name: n}
}

// Retourne le path au fichier analyse (dans 'analyse_files') du fichier
// de nom ou de chemin relatif +fname+
// Note : par défaut (d'extension), on considère que ça doit être un document
// markdown
filePathOf(fname){
  if(!fname.match(/\./)) fname += '.md'
  return path.join(this.folderFiles,fname)
}
/**
* Un fichier dans le dossier principal
**/
pathOf(relpath){ return path.join(this.folder,relpath)}


// Le path au template du fichier d'analyse (dans 'app/analyse_files')
// Note : par défaut (d'extension), on considère que ça doit être un document
// markdown
tempFilePathOf(fname){
  if(!fname.match(/\./)) fname += '.md'
  return path.join(APPFOLDER,'app','analyse_files',fname)
}

get folderImages(){return this._imgFolder||defP(this,'_imgFolder',path.join(this.folderExport,'img'))}

get folderVignettesScenes(){
  if(undefined === this._folderVignettesScenes){
    if(!fs.existsSync(this.folderImages)) fs.mkdirSync(this.folderImages)
    this._folderVignettesScenes = path.join(this.folderImages,'vignettes_scenes')
  }
  return this._folderVignettesScenes
}

get folderBackup(){
  if(undefined === this._folderBackup){
    this._folderBackup = path.join(this.folder,'.backups')
    if(!fs.existsSync(this._folderBackup)) fs.mkdirSync(this._folderBackup)
  }
  return this._folderBackup
}

get folderFiles(){
  if(undefined === this._folderFiles){
    this._folderFiles = path.join(this.folder,'analyse_files')
  }
  // On construit le fichier s'il n'existe pas
  if(!fs.existsSync(this._folderFiles)) fs.mkdirSync(this._folderFiles)
  return this._folderFiles
}

get folderReports(){
  if(undefined === this._folderReports) defP(this,'_folderReports', path.join(this.folder,'reports'))
  // On construit le dossier s'il n'existe pas
  if(!fs.existsSync(this._folderReports)) fs.mkdirSync(this._folderReports)
  return this._folderReports
}

get folderExport(){
  if(undefined === this._folderExport){
    this._folderExport = path.join(this.folder,'exports')
    if(!fs.existsSync(this._folderExport)){
      fs.mkdirSync(this._folderExport)
    }
  }
  return this._folderExport
}

get folder()  { return this._folder }
set folder(v) { this._folder = v }

}
