'use strict'


// Pour la compatibilité avec les autres types
class FAEevent extends FAEvent {

static get OWN_PROPS(){return []}
static get OWN_TEXT_PROPS(){ return []}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

static get dataType(){
  if(undefined === this._dataType){
    this._dataType ={
      type: 'event'
    , genre: 'M'
    , article:{
        indefini: {sing: 'un', plur: 'des'}
      , defini: {sing: 'l’', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Évènement', plur: 'Évènements'}
        , min: {sing: 'évènement', plur: 'évènements'}
        , maj: {sing: 'ÉVÈNEMENT', plur: 'ÉVÈNEMENTS'}
        }
      , short:{
          cap: {sing: 'Évènement', plur: 'Évènements'}
        , min: {sing: 'évènement', plur: 'évènements'}
        , maj: {sing: 'ÉVÈNEMENT', plur: 'ÉVÈNEMENTS'}
        }
      , tiny: {
          cap: {sing: 'Ev.', plur: 'Evs.'}
        , min: {sing: 'ev.', plur: 'evs.'}
        }
      }
    }
  }
  return this._dataType
}


constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content  || errors.push({msg: 'Le contenu de l’event est absolument requis', prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}


}
