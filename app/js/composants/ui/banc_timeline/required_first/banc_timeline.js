'use strict'




const BancTimeline = {

toggle(){
  let my = this

  // NOTE : pour le moment, on passe en mode ban timeline
  // TODO : pouvoir repasser dans le mode normal

  // --- ÉCRITURE DE L'ANALYSE ---
  this.dispatchElementOnTape()

  // Observation de l'interface
  this.observeBancTimeline()

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


}// /const BancTimeline
Object.defineProperties(BancTimeline, {
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
    return this._width || defP(this,'_width', this.BancTimeline.width())
  }}

// ---------------------------------------------------------------------
//  OBJETS DOM

, cursor:{get(){return $('section#banctime-ban-timeline div#banctime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#banctime-ban-timeline div#banctime-tape')}}
, scaleTape:{get(){return $('section#banctime-ban-timeline div#banctime-scaletape')}}
, BancTimeline:{get(){return $('section#banctime-ban-timeline')}}
})
