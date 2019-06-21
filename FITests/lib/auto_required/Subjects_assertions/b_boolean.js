'use strict'

class b_Subject extends FITSubject {
constructor(value){
  super('Boolean b')
  this.actual = value
  this.sujet  = `${value}`
  Object.assign(this.assertions,{
    is: this.is.bind(this)
  })
}

checkValiditySujet(){
  return true
}

// ---------------------------------------------------------------------
//  ASSERTION

is(booleanValue, options){
  let resultat = this.newResultat({
    verbe:'est', objet: `${booleanValue}`
    , options:options
  })
  resultat.validIf(this.actual === booleanValue)
  return assert(resultat)
}

}


global.b = function(value){
  return new b_Subject(value)
}
