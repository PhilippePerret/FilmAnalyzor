'use strict'


class BancTimelineElement {

// Instanciation de l'élément de banctime, avec un FAEvent pour le moment
constructor(ev){
  this.event = ev
  isDefined(this.constructor.items) || (this.constructor.items = {})
  this.constructor.items[ev.id] = this
  // On associe aussi l'élément à son event (par exemple pour retrouver sa
  // rangée ou pour l'actualiser)
  ev.btelement = this
}

/**
  Méthode qui place l'élément sur la tape de la timeline
**/
place(){
  BancTimeline.timelineTape.append(this.div)
  this.observe()
}

/**
  Méthode, appelée par exemple après un coup de zoom, qui repositionne l'élément
  en taille et sur l'axe des x.
**/
repositionne(){
  let a = ['_style', '_left', '_width', '_right']
  a.map(p => delete this[p])
  this.jqObj.attr('style', this.style) // recalcule tout
}

/**
  Observe l'objet de cet event
**/
observe(){
  this.jqObj.on(STRclick, this.onClick.bind(this))
}

/**
  Méthode appelée lorsque l'on clique sur l'event dans la Timeline
**/
onClick(e){
  stopEvent(e)
  FAEvent.edit(this.event.id)
}


// ---------------------------------------------------------------------
// PROPERTIES

get div(){
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
}

get style(){
  return this._style || defP(this,'_style', `width:${this.width}px;left:${this.left}px;top:${this.top}px;`)
}

get top()   {return this._top || defP(this,'_top', this.defineTopDiv(this))}
get width() {return this._width || defP(this,'_width', BancTimeline.t2p(this.event.duree))}
get left()  {return this._left || defP(this,'_left', BancTimeline.t2p(this.event.otime.vtime))}
get right() {return this._right || defP(this,'_right', this.left + this.width)}

// La rangée sur laquelle l'élément est placé (calculé en fonction de son type
// et de sa position, pour éviter les chevauchements)
get row()   {return this._row}
set row(v)  {this._row = v}

get jqObj() {return $(`#${this.domId}`)}
get domId() {return this._domid||defP(this,'_domid',`banctime-event-${this.event.id}`)}
get c()     {return this.constructor}
get a()     {return current_analyse}


// ---------------------------------------------------------------------
//  MÉTHODES FONCTIONNELLES ET DE CALCUL

defineTopDiv(){
  return this.c.FIRST_TOP_ELEMENT + this.row * this.c.HEIGHT_ELEMENT
}

} // /class BancTimelineElement

Object.assign(BancTimelineElement,{
  MAX_ROWS:   7
, FIRST_TOP_ELEMENT:  20
, HEIGHT_ELEMENT:     20
})
