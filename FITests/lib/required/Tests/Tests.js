'use strict'

/**
  Extension de l'object Tests
**/
module.exports = {
  TIMEOUT: 20000

/**
  Retourne le chemin relatif au fichier +fpath+
**/
, relativePathOf(fpath){
    var reg = new RegExp(`${Tests.appPath}/${Tests.config.TEST_FOLDER}\/`)
    return fpath.replace(reg,'./').trim()
  }

/**
  Ajouter un succès ou une failure
**/
, addSuccess(assertion){
    this.currentTest.addSuccess(assertion)
    ++ this.success_count
  }
, addFailure(assertion){
    this.currentTest.addFailure(assertion)
    ++ this.failure_count
  }

, addSystemError(tcase, err) {
    console.error(err, tcase)
    // this.sys_errors.push([tcase, err]);
  }

// Tests.tester  = function(str){console.log(RC+'%cÀ TESTER : '+str, REDBOLD)}
// Tests.given   = function(str){console.log(RC+INDENT+'%c'+str+'…', BLUEBOLD)}
// Tests.pending = function(str){
//   this.pending_count ++ ;
//   this.log(RC+'%c'+(str||'TODO')+'…', 'color:orange;font-weight:bold;');
// }
, action(msg, fn_action){
  try {
    Console.action(msg)
    return fn_action()
  } catch (e) {
    this.addSystemError("Problème en exécutant l'action « " + msg + ' » : ' + e.message)
  }
}
//


//
// Tests.beforeTests = function(fn) {
//   var curMod
//   try {
//     pourObtenirPathTest // produit l'error pour récupérer le path
//   } catch (e) {
//     var src = e.stack.split("\n").reverse()[0].split(':')[1]
//     curMod = Tests.relativePathOf(src)
//   }
//   if( undefined === Tests.beforeTestsFunction){
//     Tests.module_defining_before_tests = curMod
//     Tests.beforeTestsFunction = fn
//   } else {
//     var err_msg = `La méthode beforeTests() est déjà définie dans "${Tests.module_defining_before_tests}", on ne peut pas la redéfinir dans "${curMod}"`
//     Tests.addSystemError(err_msg)
//     throw(err_msg)
//   }
//
// }
// Tests.afterTests = function(fn) {
//   var curMod
//   try {
//     pourObtenirPathTest // produit l'error pour récupérer le path
//   } catch (e) {
//     var src = e.stack.split("\n").reverse()[0].split(':')[1]
//     curMod = Tests.relativePathOf(src)
//   }
//   if( undefined === Tests.afterTestsFunction){
//     Tests.module_defining_after_tests = curMod
//     Tests.afterTestsFunction = fn
//   } else {
//     var err_msg = `La méthode afterTests() est déjà définie dans "${Tests.module_defining_after_tests}", on ne peut pas la redéfinir dans "${curMod}"`
//     Tests.addSystemError(err_msg)
//     throw(err_msg)
//   }
// }
}
