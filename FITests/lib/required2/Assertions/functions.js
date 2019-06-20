'use strict'

Object.assign(FITExpectation.prototype,{

  responds_to(value, options) {
    let resultat = this.newResultat({
        verbe:'répond', comp_verbe:'à', objet:`#${value}`
      , options:options||{}
    })
    resultat.validIf('function' === typeof(this.actual[value]))
    assert(resultat)
  }


})
