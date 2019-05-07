'use strict'

class ConceptFondamental extends Fondamentale {
constructor(fonds, ydata){
  super(fonds, ydata)
}
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){

  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres

// ---------------------------------------------------------------------
// Données générales
get type(){return 'concept fondamental'}
get id(){return 5}
}
