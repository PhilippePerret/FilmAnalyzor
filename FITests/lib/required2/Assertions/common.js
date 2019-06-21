'use strict'

Object.assign(FITExpectation.prototype,{

  /* alias to_be */ equals(expectedValue){return this.to_be(expectedValue)} // alias
, /* alias to_be */ is(expectedValue){return this.to_be(expectedValue)} // alias
, to_be(expectedValue, options) {
    let resultat = this.newResultat({
        verbe:'est', comp_verbe: 'égal à'
      , objet: expectedValue
      , options: options
    })
    resultat.validIf(Object.is(this.sujet, expectedValue))
    assert(resultat)
  }

, is_defined(options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'défini'
      , options:options
    })
    resultat.validIf(undefined !== this.actualValue)
    assert(resultat)
  }
, is_undefined(options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'indéfini'
      , options:options
    })
    resultat.validIf(undefined === this.actualValue)
    assert(resultat)
  }
})
