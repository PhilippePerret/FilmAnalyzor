'use strict'

class b_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

is(expectedValue, options){
  let resultat = this.newResultat({
    verbe:'est', objet: `${expectedValue}`
    , options:options
  })
  resultat.validIf(this.actualValue === expectedValue)
  return assert(resultat)
}

is_true(options){
  return this.is(true, options)
}
is_false(options){
  return this.is(false, options)
}
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
