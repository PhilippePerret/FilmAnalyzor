'use strict'

/**
  Extension de l'object Tests
**/
module.exports = {
  TIMEOUT: 20000

/**
  Retourne le chemin relatif au fichier +fpath+

  Note : n'est pas défini quand FITests n'est utilisé que pour ses expectations,
  comme dans l'atelier Icare
**/
, relativePathOf(fpath){
    if (undefined === fpath) return '--sans/path--'
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

, tester(str){Console.redbold(`À TESTER : ${str}`)}
, given(str){Console.bluebold(`\n\t\t${str}…`)}
, pending(str){
    this.pending_count ++ ;
    Console.orangebold(`\t\t${str||'TODO'}`);
}
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
