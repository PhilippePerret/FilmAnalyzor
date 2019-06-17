'use strict'

/**
  À exécuter avant tous les tests
**/
module.exports = (function(){
  Console.bluebold(".... MERCI D'ACTIVER L'APPLICATION ....")
  // return new Promise((ok,ko)=> {setTimeout(ok,4000)})
  return new Promise((ok,ko)=> {setTimeout(ok,1000)})
})
