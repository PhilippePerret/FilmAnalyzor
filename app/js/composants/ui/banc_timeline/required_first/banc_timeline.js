'use strict'




const BancTimeline = {

init(){
  let my = this

  // --- ÉCRITURE DE L'ANALYSE ---
  this.dispatchElementOnTape()

  // La bande métrée est sensible au clic pour permettre de se
  // déplacer dans le film
  UI.timeRuler.on(STRclick, this.onClicktimeRuler.bind(this))

  // On place les marques amovibles de début et de fin de film
  UI.timeRuler.append(
    DCreate(SPAN,{class:'mark-film mark-film-start', style:`left:${my.t2p(my.a.filmStartTime)}px;`})
  , DCreate(SPAN,{class:'mark-film mark-film-end', style:`left:${my.t2p(my.a.filmEndTime)}px;`})
  )
  UI.timeRuler.find('.mark-film').draggable({
      axis:'x'
    , drag: (e) => {
        // console.log("Je draggue", e.target)
        my.a.locator.setTime(OTime.vVary(my.p2t($(e.target).position().left)), {updateOnlyVideo: true})
      }
    , stop: (e) => {
        let lastOTime = OTime.vVary(my.p2t($(e.target).position().left))
        my.a.locator.setTime(lastOTime)
        // On règle le temps de fin ou de début
        var isFilmStart = $(e.target).hasClass('mark-film-start')
        this.a.runTimeFunction(`Film${isFilmStart?'Start':'End'}Time`, lastOTime.vtime)
      }
  })
  // On rend tous les éléments sensible au clic pour les éditer
  this.timelineTape.find('.banctime-element').on(STRclick, this.onClickElement.bind(this))


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
, onClicktimeRuler(e){
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

, cursor:{get(){return $('section#banctime-banc-timeline div#banctime-cursor')}}
  // Bande sur laquelle on dépose les éléments.
, timelineTape:{get(){return $('section#banctime-banc-timeline div#banctime-tape')}}
, timeRuler:{get(){return $('section#banctime-banc-timeline div#banctime-timeRuler')}}
, BancTimeline:{get(){return $('section#banctime-banc-timeline')}}
})
