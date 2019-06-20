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
  this.question    && els.push(this.divQuestion)
  this.description && els.push(this.divDescription)
  this.objectif    && els.push(this.divObjectif)

  return els
}
// ---------------------------------------------------------------------
//  Méthodes d'Helpers
get divQuestion(){return this.libvalDiv('question')}
get divObjectif(){return this.libvalDiv('objectif')}
get divEnjeux(){ return this.libvalDiv('enjeux')}

// ---------------------------------------------------------------------
// Données propres
get question(){return this._question||defP(this,'_question', FAEvent.get(this.question_id))}
get question_id(){return this._qid || defP(this,'_qid', this.ydata.question_id)}
get objectif(){return this._objectif||defP(this,'_objectif', this.ydata.objectif)}
get enjeux(){return this._enjeux||defP(this,'_enjeux', this.ydata.enjeux)}
get Ufactor(){return this.ydata.Ufactor}
get Ofactor(){return this.ydata.Ofactor}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'question dramatique fondamentale'}
get id(){return 2}
}
