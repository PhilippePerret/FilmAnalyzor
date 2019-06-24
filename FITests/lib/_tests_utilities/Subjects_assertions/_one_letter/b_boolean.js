'use strict'

class b_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(b(...)).is(expected, options)
  @description Produit un succès sur la valeur booléenne sujet est égal à `expected`.
  @provided
    :expected {Boolean} Valeur attendue.
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage expect(b(true)).is(false) // => produit un échec
 */
is(expectedValue, options){
  let resultat = this.newResultat({
    verbe:'est', objet: `${expectedValue}`
    , options:options
  })
  resultat.validIf(this.actualValue === expectedValue)
  return assert(resultat)
}
/*
  @method expect(b(...)).is_true(options)
  @description Produit un succès si le sujet booléen est vrai.
  @provided
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage expect(b(true)).is_true() // => produit un succès
 */
is_true(options){
  return this.is(true, options)
}

/*
  @method expect(b(...)).is_false(options)
  @description Produit un succès si le sujet booléen est faux.
  @provided
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage expect(b(true)).is_false() // => produit un échec
 */
is_false(options){
  return this.is(false, options)
}

/*
  @method expect(b(...)).is_close_to(valueCom, options)
  @description Produit un succès si le sujet a une valeur proche de `valueComp`. Une « valeur proche » signifie que la valeur est considérée comme proche. Une valeur proche correspond à une valeur différente comme on utilise `===` mais une égalité quand on utilise `==`, comme pour `"2"` et `2`. D'autre part, un flottant est proche de sa valeur absolue.
  @provided
    :valueComp  {Any} La valeur à comparer au sujet.
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage expect(b(2.3)).is_close_to(2);expect(b("2")).is_close_to(2) // => produisent un succès
 */

is_close_to(compValue, options){
  let resultat = this.newResultat({
      verbe:'est', comp_verbe:'proche de', objet: `${compValue}`
    , options:options
  })
  let pass
  if ( 'number' === typeof(this.actualValue) && 'number' === typeof(compValue) ) {
    pass = parseInt(this.actualValue,10) === parseInt(compValue,10)
  } else {
    pass = this.actualValue == compValue && this.actualValue !== compValue
  }
  resultat.validIf(pass)
  return assert(resultat)
}

// /ASSERTIONS
// ---------------------------------------------------------------------

constructor(sujval){
  super('<Boolean value>')
  this.actualValue = sujval
  this.sujet = `${sujval}`
  Object.assign(this.assertions,{
      is:           this.is.bind(this)
    , is_true:      this.is_true.bind(this)
    , is_false:     this.is_false.bind(this)
    , is_close_to:  this.is_close_to.bind(this)
  })
}

checkValiditySujet(){
  return true
}

}


global.b = function(sujval){
  return new b_Subject(sujval)
}
