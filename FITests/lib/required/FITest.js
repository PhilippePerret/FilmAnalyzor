'use strict'
/**
  Extension de classe Test
**/
global.Test = class {

constructor(name){
  this.name   = name
  this.cases  = []
  ++ Tests.instanciedTests
}

// ---------------------------------------------------------------------
//  MÉTHODES PUBLIQUES

/**
  Pour enregistrer un nouveau cas de test
  Cette méthode est utilisée dans les feuilles de test.
**/
case(caseName, caseFunction){
  this.cases.push(new FITCase(this, caseName, caseFunction));
}

/**
  Pour définir la méthode à exécuter au tout début du test
  Note ça peut tout à fait être une méthode asynchrone
**/
before(fn){ this.methodBeforeTest = fn }
before_test(fn){ this.before(fn) }
beforeTest(fn){ this.before(fn) }
after(fn) { this.methodAfterTest  = fn }
after_test(fn) { this.after(fn) }
afterTest(fn) { this.after(fn) }

/**
  Pour définir le code à jouer avant et après chaque case
**/
before_case(fn){ this.methodBeforeCase = fn }
beforeCase(fn){ this.before_case(fn) }
after_case(fn) { this.methodAfterCase  = fn }
afterCase(fn) { this.after_case(fn) }


// ---------------------------------------------------------------------

init(){
  // Il ne sert à rien d'initialiser this.cases ici, car la méthode pour
  // ajouter des cases est appelée avant qu'on puisse initer le Test (ici)
  // puisque c'est en requiérant le fichier que la méthode Test.case est
  // appelée.
  // this.cases = []
  this.srcRelPath =  Tests.relativePathOf(this.path)
  // Pour mettre les assertions
  this.successes  = []
  this.failures   = []
  // OK
  return this // chainage
}

addSuccess(assertion){
  this.successes.push(assertion)
}

addFailure(assertion){
  this.failures.push(assertion)
}

async execBeforeTest(){
  if ( 'function' === typeof this.methodBeforeTest) await this.methodBeforeTest.call()
}

async execAfterTest(){
  if ( 'function' === typeof this.methodAfterTest) await this.methodAfterTest.call()
}

async execBeforeCase(){
  if ( 'function' === typeof this.methodBeforeCase) await this.methodBeforeCase.call()
}

async execAfterCase(){
  if ( 'function' === typeof this.methodAfterCase) await this.methodAfterCase.call()
}

}
