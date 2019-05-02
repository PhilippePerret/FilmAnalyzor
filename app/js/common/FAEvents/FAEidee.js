'use strict'

class FAEidee extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['ideeType', ['setup', 'longtext2'], ['exploit','longtext3'], ['fcts','longtext4']]}
static get OWN_TEXT_PROPS(){ return ['setup', 'exploit', 'payoff']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}


static get dataType(){
  if(undefined === this._dataType){
    this._dataType = {
      type: 'idee'
    , genre: 'F'
    , article:{
        indefini: {sing: 'une', plur: 'des'}
      , defini: {sing: 'l’', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Idée', plur: 'Idées'}
        , min: {sing: 'idée', plur: 'idées'}
        , maj: {sing: 'IDÉE', plur: 'IDÉES'}
        }
      , short:{
          cap: {sing: 'Action', plur: 'Idées'}
        , min: {sing: 'idée', plur: 'idées'}
        , maj: {sing: 'IDÉE', plur: 'IDÉES'}
        }
      , tiny: {
          cap: {sing: 'Idée', plur: 'Idées'}
        , min: {sing: 'idée', plur: 'idées'}
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
  this.type         = 'idee'
}

get htype(){ return 'Idée' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.ideeType || errors.push({msg: T('idee-type-required'), prop: 'ideeType'})
  this.content  || errors.push({msg: T('idee-description-required'), prop: 'longtext1'})
  this.setup    || errors.push({msg: T('idee-setup-required'), prop: 'longtext2'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get div(){
  var n = super.div
  return n
}
}
