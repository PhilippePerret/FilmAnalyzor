'use strict'
/**
 * Les instances de class FAnalyse
 * -----------------
 * Pour l'analyse d'un film
 */

let SttNode = null
  , PFA

window.current_analyse = null // définie au ready

class FAnalyse {

// ---------------------------------------------------------------------
//  CLASSE

// Retourne l'analyse courante
static get current(){return this._current||defP(this,'_current',current_analyse)}
static set current(v){this._current = v}

// Voir si les préférences demandent que la dernière analyse soit chargée
// et la charger si elle est définie.
// Sauf si les tests sont demandés au chargement (c'est une autre option)
static checkLast(){
  var dprefs = Prefs.get(['load_last_on_launching', 'last_analyse_folder', 'run_tests_at_startup'])
  // console.log("prefs:", dprefs)
  if (!dprefs['load_last_on_launching'] || dprefs['run_tests_at_startup']) return
  if (!dprefs['last_analyse_folder']) return
  var apath = path.resolve(dprefs['last_analyse_folder'])
  if(fs.existsSync(apath)){

    // === On charge la dernière analyse ===
    this.load(apath)

  } else {
    // console.log("Impossible de trouver le dossier :", apath)
    F.error(T('unfound-analyse-folder',{path:apath}))
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
  isDefined(withMessage) || (withMessage = true)
  try {
    var eventsPath = path.join(folder,'events.json')
    var dataPath   = path.join(folder,'data.json')
    fs.existsSync(eventsPath) || raise('Le fichier des events est introuvable.')
    fs.existsSync(dataPath)   || raise('Le fichier de data est introuvable.')
    return true
  } catch (e) {
    log.error(e)
    withMessage && console.log(e)
    return false
  }
}

// ---------------------------------------------------------------------

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
  if ( isUndefined(this._PFA) ) {
    SttNode = tryRequire('./js/common/PFA/SttNode.js')
    PFA     = tryRequire('./js/common/PFA/PFA.js')
    this._PFA = new Map
    this._PFA.set(1, new PFA(1))
    this._PFA.set(2, new PFA(2))
    this._PFA.set(3, new PFA(3))
    this._PFA.set(4, new PFA(4))
  }
  return this._PFA
}
get pfa1(){return this._pfa1 || defP(this,'_pfa1', this.PFA.get(1))}
get pfa2(){return this._pfa2 || defP(this,'_pfa2', this.PFA.get(2))}
get pfa3(){return this._pfa3 || defP(this,'_pfa3', this.PFA.get(3))}
get pfa4(){return this._pfa4 || defP(this,'_pfa4', this.PFA.get(4))}

get Fonds(){return this._mainfonds||defP(this,'_mainfonds',new Fondamentales(this.fondsFilePath))}

get FondsAlt(){return this._fondsalt||defP(this,'_fondsalt',new Fondamentales(this.fondsAltFilePath))}

get decors(){ return FADecor }

get markers(){return this._markers || defP(this,'_markers', new Markers(this))}

// {FAProtocole} Le protocole de l'analyse courante
get protocole(){return this._protocole||defP(this,'_protocole',new FAProtocole(this))}

// ---------------------------------------------------------------------

/**
 * Méthode appelée lorsque la vidéo elle-même est chargée. C'est le moment
 * où l'on est vraiment prêt.
 */
onVideoLoaded(){
  // console.log("-> FAnalyse#onVideoLoaded")

  // On peut indiquer aux menus qu'il y a une analyse chargée
  ipc.send('current-analyse-exist', true)

  // On peut marquer l'état d'avancement de l'analyse
  this.setupState()

  // Si une fonction a été définie pour la fin du chargement, on
  // peut l'appeler maintenant.
  isFunction(this.methodeAfterLoading) && this.methodeAfterLoading()
  // On appelle la méthode de sandbox
  if(!MODE_TEST) Sandbox.run()

  this.onVideoReady()
}

// Méthode pour régler l'état de l'analyse
setupState(){
  defaultize(this,'setupStateTries',0)
  ++ this.setupStateTries
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

  if (this.videoPath){
    const fullVideoPath = path.resolve(this.folder, this.videoPath)
    if ( fs.existsSync(fullVideoPath) ) {
      this.videoController.load(fullVideoPath)
    } else {
      F.error(T('unfound-video-path', {path: this.videoPath}))
    }
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
  UI.startWait('Export au format PDF.')
  if(NONE === typeof(FABuilder)) return this.loadBuilder(this.exportAs.bind(this,format))
  FABuilder.createNew().exportAs(format)
}

// Pour afficher le protocole de l'analyse
toggleProtocole(){this.protocole.toggle()}

/**
 * Méthode appelée quand on clique sur le menu "Affichage > Analyse complète"
 *
 * Pour le moment, on construit chaque fois l'analyse. Plus tard, peut-être
 * qu'il y aura un menu particulier pour le faire
 */
displayFullAnalyse(forcer){
  log.info(`-> FAnalyse.displayFullAnalyse(forcer:${forcer})`)
  if(isUndefined(this.callback_dispfullana)){
    this.callback_dispfullana = this.displayFullAnalyse.bind(this, forcer||false)
  }
  if(NONE === typeof(FABuilder))  return this.loadBuilder(this.callback_dispfullana)
  if(NONE === typeof(FAExporter)) return this.loadExporter(this.callback_dispfullana)
  if(NONE === typeof(FAReport))   return this.loadReporter(this.callback_dispfullana)
  if(NONE === typeof(InfosFilm))  return this.loadInfosFilm(this.callback_dispfullana)
  log.info('   Composants full analyse chargés. Je peux la créer')
  delete this.callback_dispfullana
  FABuilder.createNew().show({force_update: forcer})
  log.info('<- FAnalyse.displayFullAnalyse')
}

displayLastReport(){
  var callback = this.displayLastReport.bind(this)
  if(NONE === typeof FAReport)return this.loadReporter(callback)
  FAReport.showLast()
}

// Afficher le paradigme de Field d'index +index_pfa+
displayPFA(index_pfa){ this.PFA.get(index_pfa).toggle() }
// Afficher le calque du paradigme de Field absolu
displayCalcPFA(){
  NONE === typeof PFA_Calque && ( window.PFA_Calque = App.require('common/PFA/PFA-calque') )
  PFA_Calque.toggle()
}

togglePanneauInfosFilm(){
  if(NONE === typeof(InfosFilm)) return this.loadInfosFilm(this.togglePanneauInfosFilm.bind(this))
  InfosFilm.current.toggle()
}
togglePanneauFondamentales(){
  window.PanelFonds = window.PanelFonds || App.loadTool('building/fondamentales')
  PanelFonds.toggle()
}
togglePanneauPersonnages(opened, perso_id){
  FAPersonnage.listing || App.loadTool('building/listing_personnages')
  FAPersonnage.listing && FAPersonnage.listing.toggle(opened, perso_id)
}
togglePanneauDocuments(opened){
  FADocument.listing || App.loadTool('building/listing_documents')
  FADocument.listing && FADocument.listing.toggle(opened)
}
togglePanneauDecors(opened){
  // window.iPanelDecors = window.iPanelDecors || App.loadTool('building/decors')
  // iPanelDecors.toggle()
  FADecor.listing || App.loadTool('building/listing_decors')
  FADecor.listing && FADecor.listing.toggle(opened) // seulement si valide
}

togglePanneauImages(opened, e){
  e && stopEvent(e) // N0001
  FAImage.listing || App.loadTool('building/listing_images')
  FAImage.listing && FAImage.listing.toggle(opened) // seulement si valide
}

togglePanneauBrins(opened, e){
  e && stopEvent(e) // N0001
  if(FABrin.loaded){
    FABrin.listing || App.loadTool('building/listing_brins')
    FABrin.listing && FABrin.listing.toggle(opened) // seulement si valide
  } else {
    // Si les brins ne sont pas encore chargés, on attend
    setTimeout(this.togglePanneauBrins.bind(this, opened), 200)
  }
}
togglePanneauStatistiques(){
  defaultize(window,'PanelStatistiques',require('./js/tools/building/statistiques.js'))
  PanelStatistiques.toggle()
}

toggleAnalyseState(){ FAStater.toggleFullState() }

newVersionRequired(){
  var method = require('./js/tools/new_version.js')
  method.bind(this)()
}

/**
 * Méthode qui ouvre le porte_documents
 */
editDocumentInPorteDocuments(docId) {
  switch (docId) {
    case 13:
    case 14:
      if ( NONE === typeof(Fondamentales) ) {
        return this.loadFondamentales(this.openDocInDataEditor.bind(this, docId))
      }
      break
    case 9:
      if ( NONE == typeof(FABuildingScript) ) return System.loadComponant('faBuildingScript', this.editDocumentInPorteDocuments.bind(this, docId))
      return FABuildingScript.toggle()
  }
  PorteDocuments.inited || PorteDocuments.init()
  PorteDocuments.editDocument(docId)
}

/**
  Méthode qui ouvre le DataEditor
**/
openDocInDataEditor(docId){
  switch (docId) {
    case 13: // fondamentales
    case 14:
      if ( NONE === typeof(Fondamentales) ) {
        return this.loadFondamentales(this.openDocInDataEditor.bind(this, docId))
      }
      break
    case 20: // infos
      if ( NONE === typeof(InfosFilm) ) {
        return this.loadInfosFilm(this.openDocInDataEditor.bind(this, docId))
      }
      break
    case 30: // variables
      return F.notify("Pas d'édition avec le data-editor pour les variables pour le moment. Utiliser le document complet.")
  }
  DataEditor.openDocument(docId)
}

/**
  Pour ouvrir (depuis le menu) l'analyse dans le finder
**/
openAnalyseInFinder(){
  exec(`open "${this.folder}"`)
}

/**
 * Pour obtenir un nouvel "eventer", c'est-à-dire une liste filtrable
 * des events.
 */
createNewEventer(){
  return FAEventer.createNew() // on le retourne pour les tests
}

createShotWithCurrentPicture(){
  FAImage.shotFrame()
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
  isDefined(options) || ( options = {} )
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


// Pour éditer le document d'identifiant +doc_id+
// Note : on pourrait y aller directement, mais c'est pour compatibiliser
// les choses
editDocument(dtype, doc_id){
  return PorteDocuments.editDocument(docId)
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
  Retourne l'index de l'event d'identifiant +event_id+
**/
indexOfEvent(event_id){
  let e = FAEvent.get(event_id)
  isDefined(e.__index) || PrevNext.prepareListeEvents()
  return e.__index
}

// --- FONCTIONS I/O ----------------------------------------------

/**
  Méthode appelée par le menu « Analyse > Verrouiller » qui
  permet de verrouiller ou de déverrouiller l'analyse courante,
  c'est-à-dire de permettre ou non ses modifications.
**/
toggleLock(){
  this.saveTimer && this.stopTimerSave()
  this.locked = !!!this.locked
  this.saveData(true /* pour forcer le verrou, seulement pour enregistrer cette valeur */)
  this.setMarkModified()
  this.locked || this.runTimerSave()
}

/**
  Méthode pour régler la marque de modification
  Si l'analyse est verrouillée, un petit cadenas prend la place du rond,
  sinon c'est un rond
**/
setMarkModified(){
  this.markModified.html(this.locked ? '<img src="img/cadenas.png" style="width:15px;vertical-align:top;margin-left:6px;" />' : '•')
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
  if ( this.locked ) return F.notify(T('analyse-locked-no-save'), {error: true})
  if(this.saveTimer){
    // <= L'enregistrement automatique est activé
    // => Il faut l'interrompre
    // note : il sera remis en route à la toute fin de l'enregistrement
    this.stopTimerSave()
  }
  // On checke les events avant de les enregistrer
  this.checkEventsList()
  // En même temps qu'on sauve les fichiers, on enregistre le fichier
  // des modifiés (seuls les events modifiés à cette session sont
  // enregistrés)
  FAEvent.saveModifieds()
  // On sauve la liste des personnages si elle a été modifiée
  FAPersonnage.saveIfModify()
  // On sauve les options toutes seules, ça se fait de façon synchrone
  this.options.saveIfModified()
  this.savers = 0
  this.savables_count = this.DFILES.length
  this.DFILES.forEach(dfile => this.saveFile(dfile))
}
/**
 * Méthode est appelée à chaque sauvegarde et également à la fermeture de la
 * fenêtre et au changement d'analyse.

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
saveFile(dfile){
  dfile.iofile.code = this[dfile.dataMethod]
  dfile.iofile.save({ after: this.setSaved.bind(this, dfile), no_waiting_msg: true })
  return dfile.iofile.saved
}

setSaved(dfile){
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
  if(NONE === typeof(AnalyseChecker)){
    App.loadTool('analyse_checker').bind(this)()
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
    if ( isUndefined(traitedIds[ev.id]) ) {
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
get eventsIO(){ return this.events.map(e => e.data) }

// Prend les données dans le fichier events.json et les dispatche dans
// l'instance d'analyse (au début du travail, en général)
/**
  Reçoit les données des events enregistrés et les transforme en instance
  de leur type.
  @param {Object} v
**/
set eventsIO(eventsData){
  log.info("-> FAnalyse#[set]eventsIO")
  var my = this
    , ev
  EventForm.lastId = 0
  my.ids    = {}
  my.events = eventsData.map(eventData => {
    ev = FAEvent.instanceOf(eventData)
    my.ids[ev.id] = ev
    // Pour récupérer le dernier ID unitilisé
    if(ev.id > EventForm.lastId){EventForm.lastId = parseInt(ev.id,10)}
    return ev
  })
  // On peut définir le dernier ID dans EventForm (pour le formulaire)
  log.info('   Définition du lastId de EventForm', EventForm.lastId)
  eventsData = null
  my = null
  log.info("<- FAnalyse#[set]eventsIO")
}

  /**
   * Méthode qui définit le départ réel du film. Permettra de prendre un
   * bon départ
   */
  runTimeFunction(fct_id, vtime){
    var underf = `_set${fct_id}At`
    this.requireTimeFunctions(underf).bind(this, vtime).call()
  }
  requireTimeFunctions(whichOne){
    return require('./js/tools/timesFunctions')[whichOne]
  }

  /**
   * Règle la visibilité du bouton "Aller au début du film" en fonction de la
   * définition ou non de ce temps
   */
  setButtonGoToStart(){
    this.videoController.section.find('.btn-go-to-film-start').css('visibility',this.filmStartTime?STRvisible:STRhidden)
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
get fondsFilePath(){
  return this._fondsFilePath || defP(this,'_fondsFilePath', this.filePathOf('fondamentales.yaml'))
}
get fondsAltFilePath(){
  return this._fondsAltFilePath || defP(this,'_fondsAltFilePath', this.filePathOf('fondamentales_alt.yaml'))
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

/**
  Pour "résoudre" une path indiqué "./quel/que/chose" comme path absolue
  dans l'analyse courante (dans son dossier)
  Utilisé pour le path de la vidéo quand elle se trouve dans le dossier
  de l'analyse.
**/
resolvePath(rpath){
  if(rpath.substring(0,1) == '.'){
    return path.join(this.folder, rpath.substring(1,rpath.length))
  } else {return rpath}
}

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

// Dossier des images prises d'après la vidéo
get folderPictures(){
  if(undefined === this._folderPictures){
    if(!fs.existsSync(this.folderImages)) fs.mkdirSync(this.folderImages)
    this._folderPictures = path.join(this.folderImages,'pictures')
    if(!fs.existsSync(this._folderPictures)) fs.mkdirSync(this._folderPictures)
  }
  return this._folderPictures
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
  isDefined(this._folderReports) || defP(this,'_folderReports', path.join(this.folder,'reports'))
  // On construit le dossier s'il n'existe pas
  if(!fs.existsSync(this._folderReports)) fs.mkdirSync(this._folderReports)
  return this._folderReports
}

get folderExport(){
  if ( isUndefined(this._folderExport) ){
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
