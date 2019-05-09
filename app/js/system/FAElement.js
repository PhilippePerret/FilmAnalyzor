'use strict'

const {
  ASSOCIATES_COMMON_PROPERTIES
, ASSOCIATES_COMMON_METHODS
, DATA_ASSOCIATES_DRAGGABLE
, DATA_DROPPABLE
} = require('./js/system/associates.js')

/**
  Classe dont doit hériter tout élément de l'application, comme les
  personnages, les brins, les events, etc.

  Offre des méthodes utiles ainsi que tout ce qu'il faut pour les associations

**/
class FAElement {

  /**
    Méthode qui actualise automatiquement toutes les informations affichées
    du personnage après sa modification.
  **/
  onUpdate(){
    this.constructor.PROPS.map(prop => {
      if (!this[prop]) return
      $(this.domCP(prop)).html(this[`f_${prop}`]||this[prop])
    })
  }


// La class commune à toute
domC(prop){
  if(undefined === this._prefClass){this._prefClass = `${this.type}-${this.id}-`}
  return `${this._prefClass}${prop}`
}
domCP(prop){return `.${this.domC(prop)}`}

get modified(){return this._modified}
set modified(v){
  this._modified = v
  this.constructor.modified = v
  if(v) this.onUpdate()
}

}

Object.assign(FAElement.prototype, ASSOCIATES_COMMON_METHODS)
Object.defineProperties(FAElement.prototype, ASSOCIATES_COMMON_PROPERTIES)
