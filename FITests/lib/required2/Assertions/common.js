'use strict'

Object.assign(FITExpectation.prototype,{

  equals(value){return this.to_be(value)} // alias
, is(value){return this.to_be(value)} // alias
, to_be(value, options) {
    let resultat = this.newResultat({
        verbe:'est', comp_verbe: 'égal à'
      , objet: value
      , options: options
    })
    resultat.validIf(Object.is(this.sujet, value))
    assert(resultat)
  }

, is_defined(options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'défini'
      , options:options||{}
    })
    resultat.validIf(undefined !== this.sujet)
    assert(resultat)
  }
, is_undefined(options){
    let resultat = this.newResultat({
        verbe:'est', comp_verbe:'indéfini'
      , options:options||{}
    })
    resultat.validIf(undefined === this.sujet)
    assert(resultat)
  }
})
