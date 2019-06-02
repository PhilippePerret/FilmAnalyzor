'use strict'

class FAEidee extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['ideeType', [STRsetup, 'longtext2'], ['exploit','longtext3'], ['fcts','longtext4']]}
static get OWN_TEXT_PROPS(){ return [STRsetup, 'exploit', 'payoff']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}


// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.ideeType || errors.push({msg: T('idee-type-required'), prop: 'ideeType'})
  this.content  || errors.push({msg: T('idee-description-required'), prop: 'longtext1'})
  this.setup    || errors.push({msg: T('idee-setup-required'), prop: 'longtext2'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
