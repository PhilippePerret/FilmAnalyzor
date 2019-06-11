'use strict'

Object.assign(BancTimelineElement.prototype, {
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
, repositionne(){
    let arr = ['_style', '_left', '_width', '_right']
    arr.map(p => delete this[p])
    this.jqObj.attr('style', this.style) // recalcule tout
  }

/**
  Observe l'objet de cet event
**/
, observe(){
    this.jqObj.on(STRclick, this.onClick.bind(this))
  }

, onClick(e){
    stopEvent(e)
    FAEvent.edit(this.event.id)
  }
})
