'use strict'




const BancTimeline = {


  reset(){
    log.info("-> BancTimeline::reset")
    // Suppression de tous les markers
    UI.timeRuler.find('span.marker').remove()
    // Suppression de tous les éléments sur le banc proprement dit
    this.timelineTape.find('div.banctime-element').remove()

    // Initialisation des propriétés
    delete this._currenttime
    delete this._zoom
    delete this._width
    delete this._coefp2t
    delete this._coeft2p

    // Initialisation de la liste des items
    BancTimeline.items = []

    // Initialisation de la map
    BancTimeline.map = new Map()

    log.info("<- BancTimeline::reset")
  }

, init(){
    log.info("-> BancTimeline::init")
    let my = this

    // On transforme toutes les instances Event en élément
    // BancTimeline
    this.instancyEvents()

    // On définit la map du banc-timeline, qui permettra de
    // savoir où sont placés les éléments
    this.defineMap()

    // On dispatche tous les events sur la timeline
    this.dispatchElementOnTape()

    log.info("<- BancTimeline::init")
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
  Méthode qui instancie chaque event de banctimeline pour en faire un élément propre
**/
, instancyEvents(){
    log.info("-> BanTimeline::instancyEvents")
    let my = this
    this.a.forEachEvent(e => {
      var bte = new BancTimelineElement(e)
      my.items.push(bte)
    })
    log.info("<- BanTimeline::instancyEvents")
  }
/**
  Méthode qui place les éléments courants sur la "tape" de la timeline
**/
, dispatchElementOnTape(){
    // try {
    //   pourvoirlebacktrace
    // } catch (e) {
    //   console.error(e)
    // }
    log.info("-> BancTimeline::dispatchElementOnTape()")
    this.items.map( bte => bte.place() )
    log.info("<- BancTimeline::dispatchElementOnTape()")
  }


/**
  À la création d'un event, on le place sur le banc timeline
**/
, append(ev) {
    var bte = new BancTimelineElement(ev)
    BancTimeline.items.push(bte) // TODO Il faudrait le placer selon son temps
    bte.place()
  }
// ---------------------------------------------------------------------
//  MÉTHODES D'EVENTS

/**
  Méthode appelée quand on clique sur la tape d'échelle/temps
**/
, onClicktimeRuler(e){
    this.setCurrentPosition(e.offsetX)
    return stopEvent(e)
  }

, setCurrentPosition(left){
    this.currentTime = this.p2t(left)
    this.a.locator.setTime(this.currentTime)
  }
/**
  @param {OTime} t   Time où mettre le cursor
**/
, setCursorByTime(t){
    this.currentTime = t
    this.cursor.css(STRleft,`${(this.t2p(t.vtime))}px`)
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
