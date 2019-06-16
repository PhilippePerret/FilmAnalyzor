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
}
