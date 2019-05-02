'use strict'

// ---------------------------------------------------------------------
//  CLASS

/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.

  @param {String}   aFolder           Chemin d'accès au dossier de l'analyse
  @param {Function} fn_afterLoading   La méthode a appeler après le chargement
                    complet de l'analyse. Utilisé par les tests seulement pour
                    le moment.
 */
FAnalyse.load = function(aFolder, fn_afterLoading){
  try {
    log.info(`-> FAnalyse::load [Load analyse: ${aFolder}]`)
    this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
    UI.startWait(T('loading-analyse'))
    this.resetAll()
    window.current_analyse = new FAnalyse(aFolder)
    if(undefined !== fn_afterLoading){
      window.current_analyse.methodAfterLoadingAnalyse = fn_afterLoading
    }
    current_analyse.load()
    return true
  } catch (e) {
    log.error(e)
    UI.stopWait()
    return F.error(e)
  }
}

FAnalyse.resetAll = function(){
  log.info("-> [FAnalyse::resetAll] Réinitialisation complète")
  // On détruit la section vidéo de l'analyse courante
  if(window.current_analyse){
    // <= Il y a une analyse courante
    // => On doit tout initialiser
    FAReader.reset()
    EventForm.reset() // notamment destruction des formulaires
    current_analyse.videoController.remove()
    FAEscene.reset()
    FABrin.reset()
    FAPersonnage.reset()
    FADocument.reset()
    FAEventer.reset()
    FATexte.reset()

    delete current_analyse.videoController
    delete current_analyse.locator
    delete current_analyse.reader
    delete current_analyse.stater
  }
  // $('#section-videos').html()
  log.info("<- [FAnalyse::resetAll] Réinitialisation complète")
}

FAnalyse.loadSnippets = function(fn_callback){
  return System.loadComponant('Snippets', fn_callback)
}

// ---------------------------------------------------------------------
//  INSTANCE
Object.assign(FAnalyse.prototype, {
/**
  Méthode d'instance pour charger l'analyse (courante ou pas)

  Il y aura plusieurs fichiers à charger pour une application,
  avec tous les éléments, il faut donc procéder à un chargement asynchrone
  correct (en lançant tous les chargements et en attendant que l'application
  soit prête.)

*/
load(){
  log.info("-> FAnalyse#load")
  var my = this
    , fpath ;
  // Les options peuvent être chargée en premier, de façon synchrone
  // Noter qu'elles seront appliquées plus tard, à la fin.
  this.options.load()
  // Les fichiers à charger
  var loadables = Object.assign([], my.SAVED_FILES)
  // Pour comptabiliser le nombre de fichiers chargés
  this.loaders = 0
  my.loadables_count = loadables.length
  // console.log("loadables:",loadables)
  while(fpath = loadables.shift()){
    my.loadFile(fpath, my.PROP_PER_FILE[fpath])
  }
  log.info("<- FAnalyse#load (mais traitement asynchrone)")
}

, onLoaded(fpath){
  this.loaders += 1
  // console.log("-> onLoaded", fpath, this.loaders)
  if(this.loaders === this.loadables_count){
    // console.log("Analyse chargée avec succès.")
    // console.log("Event count:",this.events.length)
    this.ready = true
    this.onReady()
  }
}

/**
  Méthode appelé ci-dessus quand l'analyse est prête, c'est-à-dire que toutes ses
  données ont été chargées et traitées. Si un fichier vidéo existe, on le
  charge.

  À la fin de cette méthode, tout a été préparé, tout est OK
 */
, onReady(){
    log.info('-> <<FAanalyse>>#onReady')
    if(NONE === typeof FAProcede)   return this.loadProcede(this.onReady.bind(this))
    if(NONE === typeof FADecor)      return this.loadDecor(this.onReady.bind(this))
    if(NONE === typeof FABrin)      return this.loadBrin(this.onReady.bind(this))
    if(NONE === typeof FAReader)    return this.loadReader(this.onReady.bind(this))
    if(NONE === typeof FAWriter)    return this.loadWriter(this.onReady.bind(this))
    if(NONE === typeof FAProtocole) return this.loadProtocole(this.onReady.bind(this))
    if(NONE === typeof FAStater)    return this.loadStater(this.onReady.bind(this))
    if(NONE === typeof FAStats)     return this.loadStats(this.onReady.bind(this))
    if(NONE === typeof FAEventer)   return this.loadEventer(this.onReady.bind(this))
    this.videoController = new VideoController(this)
    this.locator = new Locator(this)
    this.reader  = new FAReader(this)
    this.init()
    this.locator.init()
    this.locator.stop_points = this.stopPoints
    this.reader.show()//pour le moment, on affiche toujours le reader au démarrage
    FAProcede.reset().init()
    FABrin.reset().init()
    EventForm.init()
    FAEscene.init()
    FAEqrd.reset().init()
    FAPersonnage.reset().init()
    this.options.setInMenus()
    this.videoController.init()
    this.runTimerSave()
    // Si une méthode après le chargement est requise, on
    // l'invoque.
    // Pour le moment, la méthode est surtout utilisée pour les
    // tests (même seulement pour les tests)
    if('function' === typeof this.methodAfterLoadingAnalyse){
      this.methodAfterLoadingAnalyse()
    }
    log.info('<- <<FAanalyse>>#onReady')
  }



// Charger le fichier +path+ pour la propriété +prop+ de façon
// asynchrone.
, loadFile(fpath, prop){
  new IOFile(fpath).loadIfExists({after: this.endLoadingFile.bind(this, fpath, prop)})
}

, endLoadingFile(fpath, prop, data){
  var my = this
  if('function' === typeof my[prop]){
    my[prop](data)
  } else {
    my[prop] = data
  }
  my.onLoaded.bind(my)(fpath)
}


/** ---------------------------------------------------------------------
* Chargement des composants
**/
,
loadBuilder(fn_callback){
  return System.loadComponant('faBuilder', fn_callback)
}
,
loadExporter(fn_callback){
  return System.loadComponant('faExporter', fn_callback)
}
,
loadReporter(fn_callback){
  return System.loadComponant('faReport', fn_callback)
}
,
loadTimeline(fn_callback){
  return System.loadComponant('faTimeline', fn_callback)
}
,
loadStater(fn_callback){
  return System.loadComponant('faStater', fn_callback)
}
,
loadStats(fn_callback){
  return System.loadComponant('faStats', fn_callback)
}
,
loadWriter(fn_callback){
  return System.loadComponant('faWriter', fn_callback)
}
,
loadProtocole(fn_callback){
  return System.loadComponant('faProtocole', fn_callback)
}
,
loadReader(fn_callback){
  return System.loadComponant('faReader', fn_callback)
}
,
loadProcede(fn_callback){
  return System.loadComponant('faProcede', fn_callback)
}
, loadBrin(fn_callback){
    return System.loadComponant('faBrin', fn_callback)
}
, loadDecor(fn_callback){
    return System.loadComponant('faDecor', fn_callback)
}
, loadEventer(fn_callback){
    return System.loadComponant('faEventer', fn_callback)
}

})
