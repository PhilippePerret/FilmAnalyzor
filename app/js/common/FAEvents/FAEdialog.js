'use strict'

class FAEdialog extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres au dialogue
static get OWN_PROPS(){return ['dialogType', ['quote', 'longtext2']]}

static get dataType(){
  if(undefined === this._dataType){
    this._dataType = {
      type: 'dialog'
    , genre: 'M'
    , article:{
        indefini: {sing: 'un', plur: 'des'}
      , defini: {sing: 'le', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Dialogue', plur: 'Dialogues'}
        , min: {sing: 'dialogue', plur: 'dialogues'}
        , maj: {sing: 'DIALOGUE', plur: 'DIALOGUES'}
        }
      , short:{
          cap: {sing: 'Dial.', plur: 'Dials'}
        , min: {sing: 'dial.', plur: 'dials'}
        , maj: {sing: 'DIAL.', plur: 'DIALS'}
        }
      , tiny: {
          cap: {sing: 'Dial.', plur: 'Dials.'}
        , min: {sing: 'dial.', plur: 'dials.'}
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
  this.quote      || errors.push({msg: "Il faut donner le dialogue dont il est question", prop: 'longtext2'})
  this.content    || errors.push({msg: "La description du dialogue est indispensable.", prop: 'longtext1'})
  this.dialogType || errors.push({msg: "Le type de dialogue est à définir.", prop: 'dialogType'})
  // TODO: Le type (dialogType) est-il vraiment indispensable ?

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
