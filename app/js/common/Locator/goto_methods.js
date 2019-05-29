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
    log.info("-> Locator#goToNextScene", (!FAEscene.current ? 'pas de scène courante' : `Passer à la scène suivante de la ${FAEscene.current.numero}`))
    let method = () => {
      let nScene = this.nextScene
      if (nScene){
        this.setTime(nScene.otime)
        if(this.currentScene) log.info(`   Après setTime, numéro scène courant = ${this.currentScene.numero}`)
        log.info(`   [goToNextScene] Après setTime, numéro scène suivante = ${nScene.numero}`)
      } else if (FAEscene.current) {
        F.notify(`   [goToNextScene] La scène ${FAEscene.current.numero} n'a pas de scène suivante.`)
      } else {
        F.notify(`   [goToNextScene] Pas de scène suivante.`)
      }
    }
    this.timerNextScene = setTimeout(method, 500)
    method()
    log.info('<- Locator#goToNextScene')
  }
, goToPrevScene(){
    let method = () => {
      let pScene = this.prevScene
      if (pScene){
        this.setTime(pScene.otime)
      } else if (FAEscene.current){
        F.notify(`La scène ${FAEscene.current.numero} n'a pas de scène précédente.`)
      } else {
        F.notify('Pas de scène courante.')
      }
    }
    this.timerPrevScene = setTimeout(method, 1000)
    method()
  }

, goToNextImage(){
    // F.notify("Aller à l'image suivante")
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

, goToNextSttnode(){
    F.notify("Aller au nœud PFA suivant")
  }
, goToPrevSttnode(){
    F.notify("Aller au nœud PFA précédent")
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
    clearTimeout(this.timerPrevScene)
    delete this.timerPrevScene
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
