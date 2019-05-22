'use strict'

// ---------------------------------------------------------------------
//  CLASS
Object.assign(FAnalyse,{
/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.

  @param {String}   aFolder           Chemin d'accès au dossier de l'analyse
  @param {Function} fn_afterLoading   La méthode a appeler après le chargement
                    complet de l'analyse. Utilisé par les tests seulement pour
                    le moment.
 */
  load(aFolder, fn_afterLoading){

    return
    
    // On mémorise le dossier à charger et la méthode pour poursuivre
    isDefined(this.loadingData) || (
      this.loadingData = {folder: aFolder, after: fn_afterLoading}
    )
    // On commence par vérifier que tous les composants soient bien chargés
    if (!this.allComponantsLoaded){
      try { return this.loadAllComponants()}
      catch (e) { console.error() ; return }
    }

    // On reprend les données initiales
    aFolder         = this.loadingData.folder
    fn_afterLoading = this.loadingData.after
    delete this.loadingData

    try {
      log.info(`-> FAnalyse::load [Load analyse: ${aFolder}]`)
      this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
      UI.startWait(T('loading-analyse'))
      this.resetAll()
      window.current_analyse = new FAnalyse(aFolder)
      isDefined(fn_afterLoading) && (
        window.current_analyse.methodAfterLoadingAnalyse = fn_afterLoading
      )
      current_analyse.load()
      return true
    } catch (e) {
      log.error(e)
      UI.stopWait()
      return F.error(e)
    }
  }

  /**
    Méthode qui s'assure, avant de charger l'analyse choisie, que tous les
    composants sont bien chargés. Et les charge au besoin.
  **/
, loadAllComponants(){
    log.info("-> FAnalyse::FAnalyse::loadAllComponants")
    this.allComponantsLoaded = false
    if(NONE === typeof DataEditor)    return this.loadComponant('DataEditor')
    if(NONE === typeof EventForm)     return this.loadComponant('EventForm')
    if(NONE === typeof FAWriter)      return this.loadComponant('faWriter')
    if(NONE === typeof FAProtocole)   return this.loadComponant('faProtocole')
    if(NONE === typeof FAStater)      return this.loadComponant('faStater')
    if(NONE === typeof FAEventer)     return this.loadComponant('faEventer')
    if(NONE === typeof FABrin)        return this.loadComponant('faBrin')
    if(NONE === typeof FAPersonnage)  return this.loadComponant('faPersonnage')
    if(NONE === typeof FAProcede)     return this.loadComponant('faProcede')
    if(NONE === typeof FAReader)      return this.loadComponant('faReader')
    if(NONE === typeof FAStats)       return this.loadComponant('faStats')
    if(NONE === typeof FAImage)       return this.loadComponant('faImage')

    // Si tout est OK, on peut rappeler la méthode Fanalyse.load
    log.info("   Tous les composants sont chargés.")
    this.allComponantsLoaded = true
    this.load()
    log.info("<- FAnalyse::FAnalyse::loadAllComponants")
  }

/**
  Réinitialisation complète (par exemple avant le chargement d'une autre
  analyse ou sa création)
**/
, resetAll(){
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

/**
  Méthodes de chargement des composants (au load principal)
**/
, loadComponant(componant, fn_callback){
    fn_callback || (fn_callback = this.loadAllComponants.bind(this))
    log.info(`  Chargement du composant <${componant}>`)
    return System.loadComponant(componant, fn_callback)
  }

/**
  Chargement des snippets
**/
, loadSnippets(fn_callback){
  return System.loadComponant('Snippets', fn_callback)
}

})

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
  Note : ça n'est pas tout à fait vrai, en fait…
 */
, onReady(){
    log.info('-> <<FAanalyse>>#onReady')
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
    FAImage.init()
    FAEqrd.reset().init()
    FAPersonnage.reset().init()
    this.options.setInMenus()
    this.videoController.init()
    UI.setModeAffichage() // par exemple en mode ban timeline
    this.runTimerSave()
    // Si une méthode après le chargement est requise, on
    // l'invoque.
    // Pour le moment, la méthode est surtout utilisée pour les
    // tests (même seulement pour les tests)
    if(isFunction(this.methodAfterLoadingAnalyse)){
      this.methodAfterLoadingAnalyse()
    }
    // On appelle la méthode `window.WhenAllIsReallyReady` qui permet de
    // jouer du code pour essai à la toute fin
    WhenAllIsReallyReady()
    log.info('<- <<FAanalyse>>#onReady')
  }


// Charger le fichier +path+ pour la propriété +prop+ de façon
// asynchrone.
, loadFile(fpath, prop){
  new IOFile(fpath).loadIfExists({after: this.endLoadingFile.bind(this, fpath, prop)})
}

, endLoadingFile(fpath, prop, data){
  var my = this
  if(isFunction(my[prop])){
    my[prop](data)
  } else {
    my[prop] = data
  }
  my.onLoaded.bind(my)(fpath)
}


/** ---------------------------------------------------------------------
* Chargement des composants
**/
, loadBuilder(fn_callback){
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
, loadTimeline(fn_callback){
    return System.loadComponant('faTimeline', fn_callback)
  }
, loadFondamentales(fn_callback){
    return System.loadComponant('Fondamentales', fn_callback)
}
, loadInfosFilm(fn_callback){
  return System.loadComponant('InfosFilm', fn_callback)
}

}) // assign FAnalyse.prototype
