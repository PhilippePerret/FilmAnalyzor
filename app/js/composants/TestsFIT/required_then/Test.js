'use strict'

class Test {
  constructor(testName){
    try {
      pourObtenirPathTest // produit l'error pour récupérer le path
    } catch (e) {
      var src = e.stack.split("\n").reverse()[0].split(':')[1]
      src = Tests.relativePathOf(src)
      this.srcRelPath = src
    }
    this.title = testName
    this.cases = []
    Tests.addTest(this)
  }

  /**
   * Création d'un nouveau cas
   */
  case(caseName, caseFonction){
    this.cases.push(new TCase(caseName, caseFonction));
  }

  nextCase(){
    // console.log("-> Test#nextCase")
    var my = this
    var tcase = this.cases.shift()
    if(!tcase){ return Tests.nextTest() }
    // On joue le test et on passe au suivant
    try {
      tcase.run().then(my.nextCase.bind(my));
    } catch (e) {
      console.log(`ERROR TEST: ${e}`)
      return my.nextCase.bind(my)()
      // return Tests.nextTest()
    } finally {
      my = null
    }
  }

  /**
   * Pour jouer le test
   */
  run(){
    Tests.showTestTitle(this.title, this.srcRelPath)
    if(undefined === this.codeBeforeTest){
      this.nextCase()
    } else {
      this.codeBeforeTest().then(this.nextCase.bind(this))
    }
  }

  beforeTest(v) { this.codeBeforeTest = v }
  afterTest(v)  { this.codeAfterTest = v }
}

const TCase = function(intitule, fn_test){
  this.intitule = intitule;
  this.fn       = fn_test;
};
TCase.prototype.run = function(){
  var my = this ;
  Tests.log(`%c---> Cas : ${my.intitule}`, STYLE3);
  return new Promise(function(ok,ko){
    try{
      var res = my.fn()
      if(res && res.constructor.name == 'Promise'){
        res.then(ok)
      } else {
        ok()
      };
    } catch(err){
      ok()
      Tests.add_sys_error(my, err)
    }
  })
}
