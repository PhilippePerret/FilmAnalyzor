'use strict'

/**
  Méthodes goto ajoutées à l'instance Locator,
  permettant de gérer toutes les méthodes goto
  cf. N0003
**/
module.exports = {

// ---------------------------------------------------------------------
//  TOUTES LES MÉTHODES CORRESPONDANT À GOTODATA
//  cf. N0003

/**
  Méthode qui permet d'obtenir un nouveau OTime à partir du temps +newTime+
  sans avoir à initialiser chaque fois l'instance (car la méthode peut être
  appeler en cascade lorsqu'une touche est pressée.)
**/
  varOTime(newTime){
    defaultize(this,'_varotime', new OTime(0))
    this._varotime.updateSeconds(newTime)
    return this._varotime
  }

, goToNextScene(){
    log.info('-> Locator#goToNextScene')
    let nScene = this.nextScene
    if (nScene) this.setTime(nScene.otime)
    else {
      F.notify('Pas de scène suivante.')
      // Mais s'il y a une scène courante, on se rend à sa fin
      let cScene = this.currentScene
      if ( cScene ) {
        this.setTime(OTime.vVary(cScene.endAt))
      }
    }
    log.info('<- Locator#goToNextScene')
  }
, goToPrevScene(){
    log.info('-> Locator#goToPrevScene')
    let pScene = this.prevScene
    if (pScene) this.setTime(pScene.otime)
    else F.notify('Pas de scène précédente.')
    log.info('<- Locator#goToPrevScene')
  }

, goToNextImage(){
    this.setTime(this.varOTime(this.currentTime.seconds + 1/24))
  }
, goToPrevImage(){
    // F.notify("Aller à l'image précédente")
    this.setTime(this.varOTime(this.currentTime.seconds - 1/24))
  }
, goToNextSecond(){
    this.setTime(this.varOTime(this.currentTime.seconds + 1))
  }
, goToPrevSecond(){
    this.setTime(this.varOTime(this.currentTime.seconds - 1))
  }

, goToNextTenseconds(){
    this.setTime(this.varOTime(this.currentTime.seconds + 10))
  }
, goToPrevTenseconds(){
    this.setTime(this.varOTime(this.currentTime.seconds - 10))
  }

, goToNextMinute(){
    this.setTime(this.varOTime(this.currentTime.seconds + 60))
  }
, goToPrevMinute(){
    this.setTime(this.varOTime(this.currentTime.seconds - 60))
  }

/**
  Pour aller à l'event suivant (en dehors des scènes et des nœud structurels)
**/
, goToNextEvent()   {
    var e = TimeMap.eventAfter(this.currentTime)
    e && this.setTime(e.otime)
  }
, goToPrevEvent()   {
    var e = TimeMap.eventBefore(this.currentTime)
    e && this.setTime(e.otime)
  }

/**
  Pour aller au nœud structurel suivant ou précédent
**/
, goToNextSttnode() {
    // Le noeud relatif
    var node = TimeMap.sttNodeAfter(this.currentTime)
    // Le noeud absolu
    var absNode = this.a.pfa1.absNodeAfter(this.currentTime)

    let closestNat = ((aN, n) => {
      if ( aN && n )  return aN.startAtAbs < n.event.otime.rtime ?'abs':'rel'
      else if ( aN )  return 'abs'
      else if ( n )   return 'rel'
    })(absNode, node)
    this.goAndMarkCursor(closestNat, closestNat === 'abs' ? absNode : node)

  }
, goToPrevSttnode() {
    var node    = TimeMap.sttNodeBefore(this.currentTime)
    var absNode = this.a.pfa1.absNodeBefore(this.currentTime)

    let closestNat = ((aN, n) => {
      if ( aN && n )  return aN.startAtAbs > n.event.otime.rtime ?'abs':'rel'
      else if ( aN )  return 'abs'
      else if ( n )   return 'rel'
    })(absNode, node)

    this.goAndMarkCursor(closestNat, closestNat === 'abs' ? absNode : node)
  }

, goAndMarkCursor(nat/* 'abs' ou 'rel' */, node) {
    if ( isUndefined(nat) ) return
    node.goToAndMarkCursor(nat === STRrel)
  }

, goToNextMarker(){
    this.a.markers.selectMarkerAfter(this.currentTime)
  }
, goToPrevMarker(){
    this.a.markers.selectMarkerBefore(this.currentTime)
  }

, goToNextStoppoint(){
    F.notify("Aller au stop-point suivant")
  }
, goToPrevStoppoint(){
    F.notify("Aller au stop-point précédent")
  }

, goToStartFilm() {
    this.setTime(this.varOTime(this.a.filmStartTime))
  }
, goToEndFilm() {
    this.setTime(this.varOTime(this.a.filmEndTime))
  }


// ---------------------------------------------------------------------

  /**
   * Méthode permettant de rejoindre le début du film (ou le 0)
   */
, goToFilmStart(){
    if(isDefined(this.a.filmStartTime)) this.setTime(this.startTime)
    else F.error("Le début du film n'est pas défini. Cliquer sur le bouton adéquat pour le définir.")
  }

, goToFilmStartOrZero(){
    this.setTime(this.a.filmStartTime ? this.startTime : OTime.ZERO)
  }

  // Méthode permettant de rejoindre la fin du film (avant le générique, s'il
  // est défini.)
, goToFilmEndOrEnd(){
    if(isDefined(this.a.filmEndTime)) this.setTime(this.endTime)
    else UI.video.currentTime = UI.video.duration
  }

, stopGoToPrevScene(){
    if ( isDefined(this.timerPrevScene) ) {
      clearTimeout(this.timerPrevScene)
      delete this.timerPrevScene
    }
  }

, stopGoToNextScene(){
    clearTimeout(this.timerNextScene)
    delete this.timerNextScene
  }
  // ---------------------------------------------------------------------
  //  Gestion des points d'arrêt

, goToNextStopPoint(){
    ifDefined(his._i_stop_point) || ( this._i_stop_point = -1 )
    ++ this._i_stop_point
    if(this._i_stop_point > this.stop_points.length - 1) this._i_stop_point = 0
    if(isUndefined(this.stop_points[this._i_stop_point])){
      F.notify(T('no-stop-point'))
    } else {
      this.setTime(this.stop_points[this._i_stop_point])
    }
  }

}// /Object.assign
