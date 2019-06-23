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

/*
  @method await waitFor(method[,options])
  @description Attend que la condition retournée par `method` soit true.
  @provided
    :method {Function} Méthode retournant une condition qui doit être `true` pour l'arrêter.
    :options {Object} {message: "Le message à afficher", timeout: {Number (millisecondes)} temps limite, frequence: {Number (millisecondes)} fréquence de vérification, failure: {String} "Message en cas d'échec"}
  @usage await waitFor(()=>{DOM.exists('#mondiv')}, {frequence:10, failure:"Mon div devrait exister"})
 */
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
/*
  @method await wait(duree, message)
  @description Permet d'attendre un certain nombre de millisecondes en affichant ou non un message.
  @provided
    :duree {Number (msec)} Temps à attendre, en millisecondes
    :message {String} Message à afficher pour expliquer l'attente.
  @usage await wait(3000, "J'attends trois secondes avant de continuer.")
 */
global.wait = function(wTime, wMsg){
  undefined === wMsg || console.log(wMsg)
  Tests.dureeWaits += wTime
  return new Promise(ok => {setTimeout(ok, wTime)})
}
