'use strict'

class ReponseDramatiqueFondamentale extends Fondamentale {
  constructor(fonds, ydata){
    super(fonds, ydata)
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.reponse && els.push(this.divReponse)
  this.typeR && els.push(this.divTypeR)
  this.divDescription && els.push(this.divDescription)
  this.signification && els.push(this.divSignification)
  return els
}
// ---------------------------------------------------------------------
get divReponse(){return this.libvalDiv('reponse', 'Réponse')}
get divSignification(){return this.libvalDiv('signification')}
get divTypeR(){return this.libvalDiv('typeR_formated', 'Type')}

// ---------------------------------------------------------------------
// Données propres
get reponse() {return this.ydata.reponse}
get typeR_formated(){
  if(undefined === this._typeR_formated){
    this._typeR_formated = this.typeR
    if(this.typeR.match(/MAIS/)) this._typeR_formated += ' (paradoxale)'
  }
  return this._typeR_formated
}
get typeR()   {return this.ydata.typeR}
get signification(){return this.ydata.signification}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'réponse dramatique fondamentale'}
get id(){return 4}
}
