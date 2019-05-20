'use strict'




const BanTimeline = {

toggle(){
  let my = this

  // NOTE : pour le moment, on passe en mode ban timeline
  // TODO : pouvoir repasser dans le mode normal

  // --- PRÉPARATION DE L'INTERFACE ---
  this.prepareInterface = require('./mode_ban_timeline/ban_timeline/prepare_interface').bind(this)
  this.prepareInterface()

  // --- ÉCRITURE DE L'ANALYSE ---
  this.dispatchElementOnTape()

  // Observation de l'interface
  this.observeModeBanTimeline()

}

// ---------------------------------------------------------------------
//  MÉTHODES GÉNÉRALES DE PRÉPARATION

/**
  Méthode qui place les éléments courants sur la "tape" de la timeline
**/
, dispatchElementOnTape(){
    log.info("-> BanTimeline::dispatchElementOnTape()")
    this.a.forEachEvent(e => { new BanTimelineElement(e).place() })
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
, onClickScaleTape(e){
    stopEvent(e)
    this.setCurrentPosition(e.offsetX)
  }

, setCurrentPosition(x){
    this.cursor.css('left',`${x - 4}px`)
    this.currentTime = this.p2t(x)
    this.a.locator.setTime(this.currentTime)
  }
/**
  @param {OTime} t   Time où mettre le cursor
**/
, setCursorByTime(t){
    this.currentTime = t
    this.cursor.css('left',`${(this.t2p(t.vtime)) + 4}px`)
  }


}// /const BanTimeLine
Object.defineProperties(BanTimeline, {
  // Propriétés diverses
  a:{get(){return current_analyse}}

, currentTime:{
    get(){return this._currenttime || new OTime(0)}
  , set(v){
      isDefined(this._currenttime) || (this._currenttime = new OTime(0))
      this._currenttime.vtime = v

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

//
, width:{get(){
    return this._width || defP(this,'_width', this.banTimeline.width())
  }}

// ---------------------------------------------------------------------
//  OBJETS DOM

, cursor:{get(){return $('section#bantime-ban-timeline div#bantime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#bantime-ban-timeline div#bantime-tape')}}
, scaleTape:{get(){return $('section#bantime-ban-timeline div#bantime-scaletape')}}
, banTimeline:{get(){return $('section#bantime-ban-timeline')}}
})


class BanTimelineElement {
// Instanciation de l'élément de BanTime, avec un FAEvent pour le moment
constructor(ev){
  this.event = ev
  isDefined(this.constructor.items) || (this.constructor.items = {})
  this.constructor.items[ev.id] = this
}
}

BanTimeline.UI = {}
Object.assign(BanTimeline.UI, require(`./mode_ban_timeline/ban_timeline/ui`))
Object.assign(BanTimeline, require(`./mode_ban_timeline/ban_timeline/calculs_methods`))
Object.assign(BanTimeline, require(`./mode_ban_timeline/ban_timeline/domEvents_methods`))
Object.assign(BanTimeline, require(`./mode_ban_timeline/ban_timeline/on_key_up`))
//
Object.assign(BanTimelineElement, require(`./mode_ban_timeline/ban_timeline_element/BTE_class`))
Object.defineProperties(BanTimelineElement, require(`./mode_ban_timeline/ban_timeline_element/BTE_class_props`))
//
Object.assign(BanTimelineElement.prototype, require(`./mode_ban_timeline/ban_timeline_element/BTE_inst_meths`))
Object.defineProperties(BanTimelineElement.prototype, require(`./mode_ban_timeline/ban_timeline_element/BTE_inst_props`))


module.exports = BanTimeline
