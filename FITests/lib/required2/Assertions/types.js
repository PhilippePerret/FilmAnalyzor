'use strict'

Object.assign(FITExpectation.prototype,{

  is_typeof(value, options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'de type'
      , objet: value.name.toLowerCase()
    })
    resultat.validIf(typeof(this.sujet) === value.name.toLowerCase())
    assert(resultat)
  }
, is_instanceof(value, options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'une instance de'
      , options:options||{}
      , objet: value.name
    })
    resultat.validIf(this.sujet instanceof(value))
    assert(resultat)
  }

})
