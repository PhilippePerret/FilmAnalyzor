'use strict'

// voulu
// value
global.expect = function(){return new FITExpectation(...arguments)}

class FITExpectation {
constructor(voulu, options){
  this.voulu    = voulu
  this.value    = undefined
  this.options  = options
  this.positive = true
}
// ---------------------------------------------------------------------
//  Sujet

// Inverseur
get not() {
  this.positive = false
  return this // pour le chainage
}
// ---------------------------------------------------------------------
//  Matchers

to_be(value) {
  this.value = value
  const pass = this.positive === Object.is(this.voulu, this.value)
  assert(
      pass
    , `${this.voulu} est bien égal à ${this.value}`
    , `${this.voulu} devrait être égal à ${this.value}`
    , this.options
  )
}
async to_be_visible() {
  let pass
  if ( not(this.positive) && not(DOM.contains(this.voulu))){
    pass = false // donc c'est bon
  } else {
    pass = await DOM.exists(this.voulu)
  }
  assert(
      this.positive === pass
    , `La page contient bien ${this.voulu}`
    , `La page devrait contenir ${this.voulu}`
    , this.options
  )
}


}
