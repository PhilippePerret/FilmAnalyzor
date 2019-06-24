'use strict'
/**
  Object complexe o
**/

class o_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(o(…)).contains(expected, options)
 */
contains(expected, options){
  this.checkValiditySujet()
  var pass
    , resultat = this.newResultat({
        verbe:'contient', objet:`${JSON.stringify(expected)}`
        , options:options
      })
  const expectedIsGood = this.checkObject(expected)
      , expectedIsNotEmpty = Object.keys(expected).length > 0

  if ( expectedIsGood && expectedIsNotEmpty ) {
    var bads = []
    for (var k in expected){
      if ( this.actualValue[k] == expected[k] ) continue
      bads.push(`attribut "${k}", valeur attendue : ${expected[k]}, valeur : ${this.actualValue[k]}`)
    }
    pass = bads.length == 0
    if ( ! pass ) {
      resultat.detailFailure = `Différences :${RC}\t- ${bads.join("\n\t- ")}`
    }
  } else if (expectedIsGood) {
    pass = !this.positive
    resultat.detailFailure = "L'objet à comparer est vide. C'est absurde."
  } else {
    pass = !this.positive
    resultat.detailFailure = `L'objet contenu doit être de type objet (${typeof(expected)})`
  }
  resultat.validIf(pass)
  return assert(resultat)
}

// /Assertions
// ---------------------------------------------------------------------
constructor(suj, hname){
  super(hname||'Subject o')
  this.actualValue = suj
  Object.assign(this.assertions,{
    contains: this.contains.bind(this)
  })
}

checkValiditySujet(){
  if ( Object.isObject(this.actualValue) ) return true
  else throw new Error('not-an-object')
}
// Return true si +obj+ est bien un objet
checkObject(obj){
  return Object.isObject(obj)
}

}

global.o = function(suj,hname){return new o_Subject(suj,hname)}
