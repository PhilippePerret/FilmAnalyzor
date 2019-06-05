'use strict'


class BancTimelineElement {
// Instanciation de l'élément de banctime, avec un FAEvent pour le moment
constructor(ev){
  this.event = ev
  isDefined(this.constructor.items) || (this.constructor.items = {})
  this.constructor.items[ev.id] = this
  // On associe aussi l'élément à son event (par exemple pour retrouver sa
  // rangée)
  ev.btelement = this
}
} // /class BancTimelineElement
