'use strict'

class FAEinfo extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux informations
static get OWN_PROPS(){return ['infoType']}

static get dataType(){
  if(undefined === this._dataType){
    this._dataType = {
      type: 'info'
    , genre: 'F'
    , article:{
        indefini: {sing: 'une', plur: 'des'}
      , defini: {sing: 'l’', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Information', plur: 'Informations'}
        , min: {sing: 'information', plur: 'informations'}
        , maj: {sing: 'INFORMATION', plur: 'INFORMATIONS'}
        }
      , short:{
          cap: {sing: 'Info', plur: 'Infos'}
        , min: {sing: 'info', plur: 'infos'}
        , maj: {sing: 'IDÉE', plur: 'IDÉES'}
        }
      , tiny: {
          cap: {sing: 'Info', plur: 'Infos'}
        , min: {sing: 'info', plur: 'infos'}
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
  this.content || errors.push({msg: "Le contenu de l'information est requis.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
