'use strict'


class a_Subject extends FITSubject {
constructor(){
  super('Array a')
  const params = arguments
  if ( params.length === 1 ) this.actual = params[0]
  else this.actual = [...params]
  this.sujet = `a(${JSON.stringify(this.actual)})`
  // console.log("[a] actual:", this.actual)
  Object.assign(this.assertions,{
      rien: null
    , is: this.is.bind(this)
    , contains: this.contains.bind(this)
  })
}

checkValiditySujet(){
  if ( Array.isArray(this.actual) ) return true
  else throw new Error('not-a-array')
}

// ---------------------------------------------------------------------
//  ASSERTIONS

is(expected, options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'est', comp_verbe:'égal à', objet:JSON.stringify(expected)
    , options:options
  })
  resultat.validIf(Array.is(this.actual, expected))
  return assert(resultat)
}

contains(expected, options){
  // On checke la validité du sujet ici
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe:'contient', objet:JSON.stringify(expected)
    , options:options
  })
  if( ! Array.isArray(expected) ) expected = [expected]
  var contentOK = true, bads = []
  for ( var el of expected ){
    if ( ! this.actual.includes(el) ) {
      bads.push(JSON.stringify(el))
      contentOK = false
    }
  }
  if ( ! contentOK ) {
    resultat.detailFailure = `Il ne contient pas ${bads.join(', ')}…`
  }
  resultat.validIf(contentOK)
  return assert(resultat)
}

}

global.a = function(){
  let params = arguments
  return new a_Subject(...params)
}
