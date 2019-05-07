'use strict'



class QuestionDramatiqueFondamentale extends Fondamentale {
  constructor(fonds, ydata){
    super(fonds, ydata)
  }

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.divQuestion && els.push(this.divQuestion)
  this.divDescription && els.push(this.divDescription)
  this.objectif && els.push(this.divObjectif)

  return els
}
// ---------------------------------------------------------------------
//  Méthodes d'Helpers
get divQuestion(){return this.libvalDiv('question')}
get divObjectif(){return this.libvalDiv('objectif')}

// ---------------------------------------------------------------------
// Données propres
get question(){return this._question||defP(this,'_question', this.ydata.question)}
get objectif(){return this._objectif||defP(this,'_objectif', this.ydata.objectif)}
// ---------------------------------------------------------------------
// Données générales
get type(){return 'question dramatique fondamentale'}
get id(){return 2}
}
