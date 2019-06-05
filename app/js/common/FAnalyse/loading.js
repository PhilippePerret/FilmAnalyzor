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
    log.info(`-> FAnalyse::load(folder:${aFolder})`)
    try {
      UI.startWait(T('loading-analyse'))
      // Tous les composants sont requis (chargés par AppLoader)
      isTrue(App.allComponantsLoaded) || raise(T('all-componants-required'))
      this.isDossierAnalyseValid(aFolder) || raise(T('invalid-folder', {fpath: aFolder}))
      this.resetAll()
      window.current_analyse = new FAnalyse(aFolder)
      isDefined(fn_afterLoading) && (
        window.current_analyse.methodAfterLoadingAnalyse = fn_afterLoading
      )
      current_analyse.load()
      log.info(`<- FAnalyse::load(folder:${aFolder})`)
      return true
    } catch (e) {
      log.error(e)
      UI.stopWait()
      return F.error(e)
    }
  }

/**
  Réinitialisation complète (par exemple avant le chargement d'une autre
  analyse ou sa création)
**/
, resetAll(){
    log.info("-> [FAnalyse::resetAll] Réinitialisation complète")
    // On détruit la section vidéo de l'analyse courante
    if ( window.current_analyse ) {
      // <= Il y a une analyse courante
      // => On doit tout initialiser
      FAReader.reset()
      EventForm.reset() // notamment destruction des formulaires
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
    log.info("<- [FAnalyse::resetAll] Réinitialisation complète")
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
  log.info("-> FAnalyse.load")
  let my = this

  // Les options peuvent être chargées en premier, de façon synchrone
  // Noter qu'elles seront appliquées plus tard, à la fin.
  this.options.load()

  // Les fichiers à charger. On les charge tous en même temps. Lorsque
  // le dernier est chargé, la méthode onLoaded fait passer à la suite
  this.loaders = 0 // nombre de fichiers chargés
  my.loadables_count = this.DFILES.length
  this.DFILES.forEach(dfile => my.loadFile(dfile))
  log.info("<- FAnalyse.load (asynchrone)")
}

, onLoaded(dfile){
    log.info(`-> FAnalyse.onLoaded(<${dfile.type}>)`)
    ++ this.loaders
    if(this.loaders === this.loadables_count){
      log.info('   FAnalyse.onLoaded FIN (loaders = loadables count)')
      this.ready = true
      log.info('   [FAnalyse.onLoaded] --> FAnalyse.onReady')
      this.onReady()
    }
    log.info(`<- FAnalyse.onLoaded [<${dfile.type}>]`)
  }

/**
  Méthode appelée lorsque toutes les données de l'analyse (data et event)
  ont été chargées et traitées. Si un fichier vidéo existe, on le
  charge.

  À la fin de cette méthode, tout a été préparé, tout est OK
  Note : ça n'est pas tout à fait vrai, en fait… Car il faut encore préparer
  l'interface, rechercher par exemple la scène courante.
 */
, onReady(){
    log.info('-> FAnalyse.onReady')
    let my = this
    my.init()
    my.locator.init()
    my.locator.stop_points = my.stopPoints
    Markers.reset()
    this.markers.load()
    BancTimeline.reset()
    FAProcede.reset().init()
    FABrin.reset().init()
    EventForm.init()
    FAEscene.init()
    FAImage.init()
    FAEqrd.reset().init()
    FAPersonnage.reset().init()
    my.options.setInMenus()
    my.videoController.init()
    // Les raccourcis clavier "universels"
    UI.toggleKeyUpAndDown(/* out texte field */ true)
    // On met en route le timer de sauvegarde
    my.runTimerSave()

    log.info('<- FAnalyse.onReady')
  }

, onVideoReady(){
    let my = this

    // On définit la time-map
    // Tous les events et autres éléments temporels vont être placés
    // dans une table dont les clés sont les secondes, qui permettront de
    // connaitre, à un temps donné, tous les éléments qu'on trouve.
    TimeMap.update()

    log.info('-> FAnalyse.onVideoReady')
    try {
      // On peuple la timeline avec les events
      BancTimeline.init()
    } catch (e) {
      log.error("Impossible de peupler la timeline (voir l'erreur ci-dessous)")
      log.error(e)
    }

    BancTimeline.positionneMarkFilmStartEnd()
    this.markers.build()

    // On peuple le reader avec les events et les images
    try {
      my.reader.init() // notamment : construction du reader
      my.reader.show()
      my.reader.peuple()
    } catch (e) {
      log.error("Impossible de peupler le reader (voir l'erreur ci-dessous)")
      log.error(e)
    }

    // Au cours du dispatch des données, la méthode modified a été invoquée
    // de nombreuses fois. Il faut revenir à l'état normal.
    this.modified = false
    UI.stopWait()// toujours, au cas où

    // Si un dernier temps était mémorisé, on replace le curseur à
    // cet endroit (dans la timeline)
    var lastCurTime = new OTime(my.lastCurrentTime)
    lastCurTime && my.locator.setTime(lastCurTime, true)

    // Si une méthode après le chargement est requise, on
    // l'invoque.
    // Pour le moment, la méthode est surtout utilisée pour les
    // tests (même seulement pour les tests)
    if(isFunction(my.methodAfterLoadingAnalyse)){
      my.methodAfterLoadingAnalyse()
    }

    // On appelle la méthode `window.WhenAllIsReallyReady` qui permet de
    // jouer du code pour essai à la toute fin
    WhenAllIsReallyReady()

    log.info('<- FAnalyse.onVideoReady')
  }

// Charger le fichier +path+ pour la propriété +prop+ de façon
// asynchrone.
, loadFile(dfile){
    dfile.iofile.loadIfExists({after: this.endLoadingFile.bind(this, dfile)})
}

, endLoadingFile(dfile, data){
    let my = this
      , prop = dfile.dataMethod
    if(isFunction(my[prop])){
      my[prop](data)
    } else {
      my[prop] = data
    }
    my.onLoaded.bind(my)(dfile)
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
