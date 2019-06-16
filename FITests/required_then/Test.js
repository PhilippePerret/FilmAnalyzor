'use strict'

class Test {
  //
  // nextCase(){
  //   // console.log("-> Test#nextCase")
  //   var my = this
  //   var tcase = this.cases.shift()
  //   if(!tcase){ return Tests.nextTest() }
  //   // On joue le test et on passe au suivant
  //   try {
  //     tcase.run().then(my.nextCase.bind(my));
  //   } catch (e) {
  //     console.log(`ERROR TEST: ${e}`)
  //     return my.nextCase.bind(my)()
  //     // return Tests.nextTest()
  //   } finally {
  //     my = null
  //   }
  // }

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
