'use strict'

module.exports = {

  div:{get(){
    var attrs = {
      title: this.event.toString()
    }
    attrs[STRdata_type] = STRevent
    attrs[STRdata_id]   = this.event.id

    return DCreate(DIV,{
      id:this.domId
    , class:`bantime-element ${this.event.type}`
    , style:`width:${this.width}px;left:${this.left}px;top:${this.top}px;`
    , attrs:attrs
    })
  }}

  /**
    Les trois méthodes qui permettent d'obtenir les width, left et top du div
    à placer sur la timeline
  **/
, top:{get(){return this._top || defP(this,'_top', this.constructor.defineTopDiv(this))}}

, width:{get(){
    isDefined(this._width) || (
      this._width = BanTimeline.t2p(this.event.duree)
      // Noter que même si la largeur est trop courte, la propriété css
      // min-width empêche de faire trop court
    )
    return this._width;
  }}

, left:{get(){ return this._left || defP(this,'_left', BanTimeline.t2p(this.event.otime.vtime))}}
, right:{get(){return this._right || defP(this,'_right', this.left + this.width)}}

  // La rangée sur laquelle l'élément est placé
, row:{
    get(){return this._row}
  , set(v){this._row = v}
  }

, jqObj:{get(){return $(`#${this.domId}`)}}

, domId:{get(){return this._domid||defP(this,'_domid',`bantime-event-${this.event.id}`)}}
, a:{get(){return current_analyse}}

}
