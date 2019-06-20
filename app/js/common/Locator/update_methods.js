'use strict'
/**
  Extension de la classe Locator pour les méthodes d'actualisation
**/
Object.assign(Locator.prototype,{
/**

  Méthode pour activer le suivi de tous les éléments qui doivent suivre
  la lecture, comme les curseurs ou le reader.
  Elle lance deux boucles temporelles :
    - un appel à l'actualisation de la fonction d'actualisation
      principale (construite dynamiquement) tous les 40ème de secondes
    - un appel toutes les secondes pour actualiser le reader.

 */
  activateFollowers(){
    var my = this
    // On construit la méthode d'actualisation en fonction des options et du
    // mode d'affichage.
    my.buildActualizeMainFunction()

    // === INTERVAL TIMER QUI DEMANDE L'ACTUALISATION DE L'AFFICHAGE ===
    my.updateTimer = setInterval(my.actualizeMainFunction.bind(my), 1000/40)

    // Watcher sur le reader. Toutes les secondes, il regardera les éléments
    // qui doivent être affichés dans le reader.
    my.a.reader.startWatchingItems()

    my = null
  }

, desactivateFollowers(){
    let my = this
    if(my.updateTimer){
      clearInterval(my.updateTimer)
      delete my.updateTimer
    }
    // On finit de suivre le reader
    my.a.reader.stopWatchingItems()
  }

  /**
    Méthode qui se charge de tout actualiser,
    c'est-à-dire l'horloge, le reader (events proches) et le
    indicateur de structure.

    Note : avant, c'était la méthode appelée tous les 40 millièmes de seconde
    pour actualiser l'affichage. Maintenant, elle ne sert que lorsqu'on est à
    l'arrêt.
  **/
, actualizeALL(){
    log.info('-> Locator.actualizeALL')
    var curt = this.currentTime
    this.actualizeHorloge(curt)
    this.actualizeMarkersStt(curt)
    this.actualizeMarkScene(curt)
    this.a.reader.revealAndHideElementsAt(curt)
    curt = null
    log.info('<- Locator.actualizeALL')
  }

  /**
    Méthode qui construit la fonction d'actualisation en fonction des options
    choisies. Cela permet de construire une fois pour toute une méthode sans
    avoir à lui appliquer des tests pour savoir ce qu'il faut actualiser.
  **/
, buildActualizeMainFunction(){
    var codeLines = [] // on mettra les lignes de code dedans
    // On actualise toujours les horloges
    codeLines.push("var curt = this.currentTime;")
    codeLines.push("this.actualizeHorloge(curt)")
    codeLines.push("this.actualizeMarkScene(curt)")

    if (this.a.options.get('video.running.updates.stt')){
      codeLines.push("this.actualizeMarkersStt(curt)")
    }
    // Arrêter de jouer si un temps de fin est défini et qu'il est
    // atteint
    codeLines.push("this.isEndTimeWanted(curt) && this.stopAtEndTimeWanted()")

    this.actualizeMainFunction = new Function(codeLines.join(RC))
    this.actualizeMainFunction = this.actualizeMainFunction.bind(this)

  }

, actualiseBancTimeline(curt){
    // On n'actualise pas le curseur, car on l'actualise dans `actualizeHorloge`
    // pour que le curseur soit toujours synchronisé avec le temps joué.
    // BancTimeline.setCursorByTime(curt)
    // TODO Qu'est-ce qu'on doit actualiser d'autres ?
  }

, actualizeHorloge(curt){
    UI.mainHorloge.html(curt.horloge)
    UI.videoHorloge.html(curt.vhorloge)
    BancTimeline.setCursorByTime(curt)
  }



  /*
    De la même manière qu'on actualise l'horloge et le reader, on
    actualise la marque des parties et des zones à côté de
    l'horloge principale

    TODO Utiliser la TimeMap pour gérer l'actualisation des markers.
    Et cette méthode deviendra normalement obsolète si on a une méthode
    générale qui gère toutes les actualisations.
   */
, actualizeMarkersStt(curt){
    // TODO Implémenter une fois que les PFA seront mis en place
  }

  /**
    Actualisation de la marque de la scène courante, c'est-à-dire son
    numéro et son numéro.

    Note : cette méthode ne sert plus que lorsqu'on est à l'arrêt.

    @param {OTime} curt  Le temps courant

   */
, actualizeMarkScene(curt){
    delete FAEscene._current
    UI.markCurrentScene.html(FAEscene.current?FAEscene.current.asPitch().innerHTML:'---')
  }

})
