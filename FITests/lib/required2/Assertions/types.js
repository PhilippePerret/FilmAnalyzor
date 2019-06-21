'use strict'

Object.assign(FITExpectation.prototype,{

  is_typeof(expectedValue, options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'de type'
      , objet: expectedValue.name.toLowerCase(), options:options
    })
    resultat.validIf(typeof(this.actualValue) === expectedValue.name.toLowerCase())
    assert(resultat)
  }
, is_instanceof(expectedValue, options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'une instance de'
      , objet: expectedValue.name, options:options
    })
    resultat.validIf(this.actualValue instanceof(expectedValue))
    assert(resultat)
  }

})
