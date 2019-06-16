'use strict'
/**
  Extension de classe Test
**/
module.exports = {
/**
  Pour enregistrer un nouveau cas de test
  Cette méthode est utilisée dans les feuilles de test.
**/
  case(caseName, caseFunction){
    if ( undefined === this.cases ) this.cases = []
    this.cases.push(new FITCase(this, caseName, caseFunction));
  }

/**
  Pour jouer le premier et les cas suivants du test
**/
, async runNextCase(){
    let tcase
    if ( tcase = this.cases.shift() ) {
      // <= Il reste des cas à étudier
      await tcase.run()
      this.runNextCase()
    } else {
      // <= Il ne reste plus de cas
      // => On passe à la suite (comment ?)
      return true
    }
  }
}
