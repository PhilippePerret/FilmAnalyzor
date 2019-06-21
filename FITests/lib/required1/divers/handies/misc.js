'use strict'

/**
  Méthode qui attend que la fonction `waitingMethod` retourne une valeur
  positive.

  @param {Object|Undefined} options
                                timeout:    Le timeout maximal à attendre.
                                frequence:  Fréquence du check, en millisecondes

**/
const WAITFOR_TIMEOUT = 10000
const WAITFOR_FREQUENCE = 200
global.waitFor = async function(waitingMethod, options){
  options = options || {}
  if ( 'function' !== typeof(waitingMethod) ) throw ArgumentError("Le premier argument de la méthode waitFor doit impérativement être une fonction.")
  if ( options.message ) Console.action(options.message)
  const timeout = options.timeout || WAITFOR_TIMEOUT
  const freqcheck = options.frequence || WAITFOR_FREQUENCE
  var waitingTime = 0 // le temps attendu
    , res
  do {
    await wait(freqcheck)
    waitingTime += freqcheck
  } while ( false == (res = waitingMethod.call()) && waitingTime < timeout )
  if ( ! res ) {
    throw new ExpectationError(options.failure || "Attente vaine.")
  }
}

/**
  Méthode d'attente
**/
global.wait = function(wTime, wMsg){
  undefined === wMsg || console.log(wMsg)
  Tests.dureeWaits += wTime
  return new Promise(ok => {setTimeout(ok, wTime)})
}
