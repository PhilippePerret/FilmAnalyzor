'use strict'


class a_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(a(...)).is(expected, options)
  @description Produit un succès si le Array sujet est égal à +expected+
  @provided
    :expected {Array} La liste qu'on doit obtenir.
    :options {Object} Les [options classiques des assertions](#options_assertions).
  @usage expect(a(1,2)).is([1,2]) // => succès
 */
is(expectedValue, options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'est', comp_verbe:'égal à', objet:JSON.stringify(expectedValue)
    , options:options
  })
  resultat.validIf(Array.is(this.actualValue, expectedValue))
  return assert(resultat)
}

/*
  @method expect(a(...)).contains(expected, options)
  @description Produit un succès si le Array sujet contient la valeur +expected+.
  @provided
    :expected {Any} La valeur que le Array doit contenir.
    :options {Object} Les [options classiques des assertions](#options_assertions).
  @usage expect(a(2,'trois')).contains('trois') // => produit un succès
 */
contains(expectedValue, options){
  // On checke la validité du sujet ici
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe:'contient', objet:JSON.stringify(expectedValue)
    , options:options
  })
  if( ! Array.isArray(expectedValue) ) expectedValue = [expectedValue]
  var contentOK = true, bads = []
  for ( var el of expectedValue ){
    if ( ! this.actualValue.includes(el) ) {
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

// /ASSERTIONS
// ---------------------------------------------------------------------
constructor(){
  super('Array a')
  const params = arguments
  if ( params.length === 1 ) this.actualValue = params[0]
  else this.actualValue = [...params]
  this.sujet = `a(${JSON.stringify(this.actualValue)})`
  // console.log("[a] actualValue:", this.actualValue)
  Object.assign(this.assertions,{
      rien: null
    , is: this.is.bind(this)
    , contains: this.contains.bind(this)
  })
}

checkValiditySujet(){
  if ( Array.isArray(this.actualValue) ) return true
  else throw new Error('not-a-array')
}

}

global.a = function(){
  let params = arguments
  return new a_Subject(...params)
}
