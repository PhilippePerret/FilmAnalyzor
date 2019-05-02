'use strict'

class FAEnote extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux notes
static get OWN_PROPS(){return ['noteType']}

static get dataType(){
  if(undefined === this._dataType){
    this._dataType = {
      type: 'note'
    , genre: 'F'
    , article:{
        indefini: {sing: 'une', plur: 'des'}
      , defini:   {sing: 'la', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Note', plur: 'Notes'}
        , min: {sing: 'note', plur: 'notes'}
        , maj: {sing: 'NOTE', plur: 'NOTES'}
        }
      , short:{
          cap: {sing: 'Note', plur: 'Notes'}
        , min: {sing: 'note', plur: 'notes'}
        , maj: {sing: 'NOTE', plur: 'NOTES'}
        }
      , tiny: {
          cap: {sing: 'Note', plur: 'Notes'}
        , min: {sing: 'note', plur: 'notes'}
        , maj: {sing: 'NOTE', plur: 'NOTES'}
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
  this.content || errors.push({msg: "Le contenu de la note est requis.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
