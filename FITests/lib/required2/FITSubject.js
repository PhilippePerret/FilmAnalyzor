'use strict'
/**
  Class FITSubject
  Qui permet de définir des "sujets" propres à l'application
  Pour les utiliser dans `expect(sujet).<method>`

**/
global.FITSubject = class {
constructor(name){
  this.name = name
  this.assertions = {
      raises:this.raises.bind(this)
    , responds_to:this.responds_to.bind(this)
  }
}

toString(){ return this.name }
toValue() { return this.subject_value }

newResultat(data){
  if ( undefined === data.options ) data.options = {}
  return new FITResultat(this, Object.assign(data,{sujet: this.sujet}))
}

get classe() {return 'FITSubject'}

// Le sujet à utiliser pour le message
get subject_message(){return this._subject_message || name}
set subject_message(v){this._subject_message = v}

// La valeur à utiliser pour les comparaisons
get subject_value(){return this._subject_value}
set subject_value(v){this._subject_value = v}

// ---------------------------------------------------------------------
//  ASSERTIONS COMMUNES
// Si une assertion est ajoutée, il faut l'ajouter au constructeur ci-dessu


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


}
