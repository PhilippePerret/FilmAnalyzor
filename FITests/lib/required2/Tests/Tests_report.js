'use strict'

module.exports = {

  /**
    Effaçage de la console. Mis ici pour pouvoir être appelé par le
    module principal `FITests.Tests.js` afin de pouvoir être désactivé
    facilement si on veut voir des erreurs qui se produisent avant.
  **/
  clearAll(){
    Console.clear()
    return this // chainage
  }
, startAll(){
    Console.space(3)
    Console.mainTitle(`=========== DÉBUT DES TESTS =============`,{time:true})
    this.startTime = (new Date()).getTime()
  }

/**
  Méthode appelée lorsque tous les tests ont été joués
**/
, termineAll(){
    this.endTime = (new Date()).getTime()
    Console.mainTitle("========= FIN DES TESTS =========", {time: true})
    Console.space(3)
    this.afterTestsFunction && this.afterTestsFunction.call()
    console.log(
        '%c' + this.resultatMessage()
      , `color:${this.resultatColor()};font-weight:bold;font-size:1.2em;`);
    Console.space(2)
    console.log(`Nombre de files  : ${this.files_count}`)
    console.log(`Nombre de tests  : ${this.tests_count}`)
    console.log(`Nombre de cases  : ${this.cases_count}`)
    console.log(`Durée totale     : ${(this.endTime - this.startTime)/1000} secs`)
    console.log(`Durée des waits  : ${this.dureeWaits/1000} secs`)
    console.log(`Durée hors waits : ${(this.endTime - this.startTime - this.dureeWaits)/1000} secs`)
  }

, resultatMessage(){
    return `${this.success_count} success ${this.failure_count} failures ${this.pending_count} pendings`
  }
, resultatColor(){
    if ( this.failure_count ) {
      return 'red'
    } else if ( this.pending_count ) {
      return 'orange'
    } else {
      return '#00BB00'
    }
  }

/**
  Méthode qui écrit en console le titre du test courant

  Noter que la méthode n'est pas utilisée si les tests sont joués en ordre
  aléatoire.
**/
, showCurrentTestTitle(){
    Console.framedTitle(this.currentTest.name)
    Console.path(this.currentTest.srcRelPath)
  }

}
