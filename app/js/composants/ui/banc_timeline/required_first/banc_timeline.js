'use strict'




const BancTimeline = {

init(){
  let my = this

  // --- ÉCRITURE DE L'ANALYSE ---
  this.dispatchElementOnTape()

  // On rend tous les éléments sensible au clic pour les éditer
  this.timelineTape.find('.banctime-element').on(STRclick, this.onClickElement.bind(this))

}

, positionneMarkFilmStartEnd(){
    log.info('-> BancTimeline::positionneMarkFilmStartEnd()')
    log.info(`      Left start:${this.t2p(this.a.filmStartTime)}`)
    log.info(`      Left end:${this.t2p(this.a.filmEndTime)}`)
    UI.markFilmStart.css(STRleft,`${this.t2p(this.a.filmStartTime)-8}px`)
    UI.markFilmEnd.css(STRleft,`${this.t2p(this.a.filmEndTime)}px`)
    log.info('<- BancTimeline::positionneMarkFilmStartEnd()')
  }

/**
  Quand on passe la souris sur la réglette de temps, on déclenche
  un setTimeout qui doit déclencher l'observer de déplacement de la
  souris sur cette réglette (rapide).

  Note : ce setTimeout sert à ne pas déclencher les choses si on ne
  fait que passer sur la réglette
**/
, onMouseOverTimeRuler(e){
  // TODO : REMETTRE CI-DESSOUS, MAIS SANS GÊNER LE DÉPLACEMENT DES MARQUEURS
    // console.log("-> entrée dans la timeRuler")
    // this.timerOnTimeRuler = setTimeout(this.observeTimeRuler.bind(this), 750)
    // return stopEvent(e)
  }
, observeTimeRuler(){
    UI.timeRuler
      .on(STRmousemove, this.onMouseMoveTimeRuler.bind(this))
      .on(STRmouseout,  this.onMouseOutTimeRuler.bind(this))
  }
// Quand la souris quitte la réglette de temps, on doit arrêter et
// détruire le timer qui n'a peut-être pas été mis en route
, onMouseOutTimeRuler(e){
    if (isDefined(this.timerOnTimeRuler) ) {
      clearTimeout(this.timerOnTimeRuler)
      delete this.timerOnTimeRuler
    }
    return stopEvent(e)
  }

, onMouseMoveTimeRuler(e) {
    var vtime = this.p2t(e.clientX)
    var otime = OTime.vVary(vtime)
    this.a.locator.setTime(otime, {updateOnlyHorloge: true})
    return stopEvent(e)
  }

// ---------------------------------------------------------------------
//  MÉTHODES GÉNÉRALES DE PRÉPARATION

/**
  Méthode qui place les éléments courants sur la "tape" de la timeline
**/
, dispatchElementOnTape(){
    log.info("-> BancTimeline::dispatchElementOnTape()")
    BancTimeline.items = []
    this.a.forEachEvent(e => {
       var bte = new BancTimelineElement(e)
       BancTimeline.items.push(bte)
       bte.place()
     })
   log.info("<- BancTimeline::dispatchElementOnTape()")
  }

// ---------------------------------------------------------------------
//  MÉTHODES D'EVENTS

/**
  Méthode appelée quand on clique sur un event
**/
, onClickElement(e){
    stopEvent(e)
    FAEvent.edit($(e.target).data(STRid))
}

/**
  Méthode appelée quand on clique sur la tape d'échelle/temps
**/
, onClicktimeRuler(e){
    this.setCurrentPosition(e.offsetX)
    return stopEvent(e)
  }

, setCurrentPosition(left){
    console.log("left dans setCurrentPosition :", left)
    // this.cursor.css('left',`${left}px`)
    this.currentTime = this.p2t(left)
    console.log("currentTime envoyé à setTime:", this.currentTime)
    this.a.locator.setTime(this.currentTime)
  }
/**
  @param {OTime} t   Time où mettre le cursor
**/
, setCursorByTime(t){
    this.currentTime = t
    this.cursor.css('left',`${(this.t2p(t.vtime))}px`)
  }


}// /const BancTimeline
Object.defineProperties(BancTimeline, {
  // Propriétés diverses
  a:{get(){return current_analyse}}

, currentTime:{
    get(){return this._currenttime || new OTime(0)}
  , set(v){
      isDefined(this._currenttime) || (this._currenttime = new OTime(0))
      isDefined(v.vtime) && ( v = v.vtime )
      this._currenttime.updateSeconds(v)

    }
  }
// ---------------------------------------------------------------------
//
  // zoom courant (défaut = 100)
, zoom:{
    get(){return this._zoom || 1}
  , set(v){this._zoom = v}
  }
  // Scroll courant du ban de timeline
, scrollX:{
    get(){return this.timelineTape.scrollLeft()}
  }

// ---------------------------------------------------------------------
//  PROPRIÉTÉS DOM

, width:{get(){
    return this._width || defP(this,'_width', this.timelineTape.innerWidth())
  }}

// ---------------------------------------------------------------------
//  OBJETS DOM

, cursor:{get(){return $('section#banctime-banc-timeline div#banctime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#banctime-banc-timeline div#banctime-tape')}}
, timeRuler:{get(){return $('section#banctime-banc-timeline div#banctime-timeRuler')}}
, BancTimeline:{get(){return $('section#banctime-banc-timeline')}}
})
