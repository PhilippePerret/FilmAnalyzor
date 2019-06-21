'use strict'

class b_Subject extends FITSubject {
constructor(sujval){
  super('<Boolean value>')
  this.actualValue = sujval
  this.sujet = `${sujval}`
  Object.assign(this.assertions,{
    is: this.is.bind(this)
  })
}

checkValiditySujet(){
  return true
}

// ---------------------------------------------------------------------
//  ASSERTION

is(expectedValue, options){
  let resultat = this.newResultat({
    verbe:'est', objet: `${expectedValue}`
    , options:options
  })
  resultat.validIf(this.actualValue === expectedValue)
  return assert(resultat)
}

}


global.b = function(sujval){
  return new b_Subject(sujval)
}
