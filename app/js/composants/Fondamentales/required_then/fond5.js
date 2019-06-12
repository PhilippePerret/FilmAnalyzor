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

  this.description && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Données propres
get concept(){return this.ydata.concept}
get Ufactor(){return this.ydata.Ufactor}
get Ofactor(){return this.ydata.Ofactor}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'concept fondamental'}
get id(){return 5}
}
