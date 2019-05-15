'use strict'


class FADrop {
/**
  Les trois méthodes droppable
**/

/**
  @param {DropEvent}  e Évènement drop (contenant la cible survolée)
  @param {jQuery}     ui  Objet jQuery contenant notamment le helper
**/
// Quand on glisse un objet sur un élément droppable

static over(e, ui){
  // console.log("-> over", this.refTargetOf(e))
  if( this.isBusy() ){
    $(e.target).removeClass('survoled')
    return false
  }
  this.current = e.target
  return true
}
// Quand on quitte un élément droppable
static out(e, ui){
  // console.log("-> out", this.refTargetOf(e))
  if(this.isBusy()){
    if(e.target == this.current){
      delete this.current
    }
  } else {
    // On passe par ici lorsque l'on quitte l'élément courant, mais en
    // ayant dessous un autre élément qui pourrait recevoir le drop. C'est lui
    // qui passe par ici.
  }

}

// Retourne TRUE si l'élément DOM +target+ n'est pas l'élément courant
static isNotCurrentDropped(target){
  // if(target == this.current){
  //   console.log(`${this.refFor(target)} est l'élément droppé courant`)
  // } else {
  //   console.log(`${this.refFor(target)} n'est pas l'élément droppé courant`)
  // }
  return target != this.current
}


static refFor(ui){
  if('object'===typeof(ui.helper)) ui = ui.helper
  ui = $(ui)
  var domui = ui[0]
  var refs = []
  refs.push(domui.tagName)
  var id = domui.id
  if(id) refs.push(`@id=${id}`)
  else   refs.push(`@class=${domui.className}`)
  return `<<<${refs.join(' ')}>>>`
}

// Retourne une référence littéraire à la cible de l'évènement +e+
static refTargetOf(e){
  return this.refFor($(e.target))
}

static isBusy(){return !!this.current}

}// FADcrop


module.exports = FADrop
