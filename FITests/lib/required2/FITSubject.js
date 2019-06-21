'use strict'
/**
  Class FITSubject
  Qui permet de définir des "sujets" propres à l'application
  Pour les utiliser dans `expect(sujet).<method>`

**/
global.FITSubject = class {
// ---------------------------------------------------------------------
//  ASSERTIONS (dont héritent toutes les sous-classers)
//
// Si une assertion est ajoutée, il faut l'ajouter au constructeur
// ci-dessous

raises(exception, options){
  let resultat = this.newResultat({
      verbe:'produit', comp_verbe:exception?`l’erreur`:'d’erreur'
    , objet: exception?`« ${exception} »`:''
    , options:options
  })
  try {
    this.checkValiditySujet()
    resultat.validIf(false)
  } catch (e) {
    resultat.validIf(exception === e.message)
  }
  return assert(resultat)
}

responds_to(fn, options){
  let resultat = this.newResultat({
    verbe:'répond', comp_verbe:'à', objet: `#${fn}`, options:options
  })
  resultat.validIf('function' === typeof(this[fn]))
  return assert(resultat)
}

instanceof(expectedClass, options){
  let resultat = this.newResultat({
    verbe:'est', comp_verbe:'une instance de', objet:`${expectedClass.name}`
    , options:options
  })
  resultat.validIf(this instanceof expectedClass)
  return assert(resultat)
}
// /ASSERTIONS
// ---------------------------------------------------------------------

constructor(name){
  this.name = name
  this.assertions = {
      raises:       this.raises.bind(this)
    , responds_to:  this.responds_to.bind(this)
    , instanceof:   this.instanceof.bind(this)
  }
}

toString(){ return this.name }
toValue() { return this.actualValue }
static get name(){return 'FITSubject'}

newResultat(data){
  if ( undefined === data.options ) data.options = {}
  // console.log("this.sujet dans FITSubject:", this.sujet)
  return new FITResultat(this, Object.assign(data,{sujet: this.sujet}))
}

get classe() {return 'FITSubject'}


}
