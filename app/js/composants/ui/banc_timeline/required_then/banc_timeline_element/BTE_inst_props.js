'use strict'

Object.defineProperties(BancTimelineElement.prototype, {

  div:{get(){
    var attrs = {
      title: this.event.toString()
    }
    attrs[STRdata_type] = STRevent
    attrs[STRdata_id]   = this.event.id

    return DCreate(DIV,{
      id:this.domId
    , class:`banctime-element ${this.event.type}`
    , style:this.style
    , attrs:attrs
    })
  }}

, style:{get(){return this._style || defP(this,'_style', `width:${this.width}px;left:${this.left}px;top:${this.top}px;`)}}
  /**
    Les trois méthodes qui permettent d'obtenir les width, left et top du div
    à placer sur la timeline
  **/
, top:{get(){return this._top || defP(this,'_top', this.constructor.defineTopDiv(this))}}

, width:{get(){
    isDefined(this._width) || (
      this._width = BancTimeline.t2p(this.event.duree)
      // Noter que même si la largeur est trop courte, la propriété css
      // min-width empêche de faire trop court
    )
    return this._width;
  }}

, left:{get(){ return this._left || defP(this,'_left', BancTimeline.t2p(this.event.otime.vtime))}}
, right:{get(){return this._right || defP(this,'_right', this.left + this.width)}}

  // La rangée sur laquelle l'élément est placé (calculé en fonction de son type
  // et de sa position, pour éviter les chevauchements)
, row:{
    get(){return this._row}
  , set(v){this._row = v}
  }

, jqObj:{get(){return $(`#${this.domId}`)}}

, domId:{get(){return this._domid||defP(this,'_domid',`banctime-event-${this.event.id}`)}}
, a:{get(){return current_analyse}}

})