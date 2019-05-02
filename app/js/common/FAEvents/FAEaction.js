'use strict'

class FAEaction extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres
static get OWN_PROPS(){ return ['actionType'] }

static get dataType(){
  if(undefined === this._dataType){
    this._dataType = {
      type: 'action'
    , genre: 'F'
    , article:{
        indefini: {sing: 'une', plur: 'des'}
      , defini: {sing: 'l’', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Action', plur: 'Actions'}
        , min: {sing: 'action', plur: 'actions'}
        , maj: {sing: 'ACTION', plur: 'ACTIONS'}
        }
      , short:{
          cap: {sing: 'Action', plur: 'Actions'}
        , min: {sing: 'action', plur: 'actions'}
        , maj: {sing: 'ACTION', plur: 'ACTIONS'}
        }
      , tiny: {
          cap: {sing: 'Act.', plur: 'Acts.'}
        , min: {sing: 'act.', plur: 'acts.'}
        }
      }
    }
  }
  return this._dataType
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "La description de l'action est indispensable.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
