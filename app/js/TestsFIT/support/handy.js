'use strict'


// Pour charger le plus simplement possible une analyse en début de test
// @usage
//    var t = new Test("Mon test")
//    t.beforeTest(loadAnalyse(<folder>))
//
function loadAnalyse(analyseFolder, options){
  return FITAnalyse.load.bind(FITAnalyse,analyseFolder,options)
}
