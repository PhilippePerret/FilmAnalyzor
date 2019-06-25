'use strict'

class FITAnalyseStateSubject extends FITSubject {
  constructor(){
    super("Analyse State")
    this.calcValues()
  }

// On calcule les valeurs actuelles pour faire l'état de l'analyse courante
calcValues(){
  this.videoPath    = this.a.videoPath
  this.eventsCount  = this.a.events.length
  this.scenesCount  = FAEscene.count
  this.currentTime  = this.a.locator.currentTime.vtime
  this.locked       = this.a.locked
}
get a(){return current_analyse}
}

Object.defineProperties(global, {
  AnalyseState:{get(){return new FITAnalyseStateSubject()}}
})
