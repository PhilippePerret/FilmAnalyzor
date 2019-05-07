'use strict'


class PersonnageFondamental extends Fondamentale {
constructor(fonds){
  super(fonds, ydata)
}

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  els.push(this.divPseudo)
  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'Helpers
get divPseudo(){return this.libvalDiv('pseudo')}

// ---------------------------------------------------------------------
// Données propres
get pseudo(){return this.ydata.pseudo}
// ---------------------------------------------------------------------
// Données générales
get type(){return 'personnage fondamental'}
get id(){return 1}
}
