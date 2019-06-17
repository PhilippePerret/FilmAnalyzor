'use strict'

/**
  Méthode principale d'expectation
  Pour définir le sujet.
**/
global.expect = function(){return new FITExpectation(...arguments)}

/**
  Méthode d'attente
**/
global.wait = function(wTime, wMsg){
  undefined === wMsg || console.log(wMsg)
  Tests.dureeWaits += wTime
  return new Promise(ok => {setTimeout(ok, wTime)})
}

global.FITExpectation = class {
constructor(sujet, options){
  this.sujet    = sujet
  this.value    = undefined
  this.options  = options || {}
  this.positive = true
}
// ---------------------------------------------------------------------
//  Sujet

// Inverseur
get not() {
  this.positive = false
  return this // pour le chainage
}
// Le sujet du test
get subject(){
  return this.options.subject || this.options.sujet || this.sujet
}

// Le message "est égal" ou "n'est pas égal", etc. en fonction de la positivité
// de l'expectation
positivise(what ,state){
  switch (what) {
    case 'est':
      return {
          success: `${this.positive? 'est bien' : 'n’est pas'} ${state}`
        , failure: `${this.positive? 'devrait être' : 'ne devrait pas être'} ${state}`
      }
    case 'existe':
      return {
          success: `${this.positive?'existe bien':'n’existe pas'} ${state}`
        , failure: `${this.positive?'devrait exister':'ne devrait pas exister'} ${state}`
      }
    default:

  }
}


} // class FITExpectation
