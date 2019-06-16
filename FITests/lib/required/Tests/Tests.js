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

// Tests.tester  = function(str){console.log(RC+'%cÀ TESTER : '+str, REDBOLD)}
// Tests.given   = function(str){console.log(RC+INDENT+'%c'+str+'…', BLUEBOLD)}
// Tests.pending = function(str){
//   this.pending_count ++ ;
//   this.log(RC+'%c'+(str||'TODO')+'…', 'color:orange;font-weight:bold;');
// }
// Tests.action  = function(msg, fn_action){
//   try {
//     this.log(INDENT+'%cACTION: '+msg, GREENBOLD)
//     return fn_action()
//   } catch (e) {
//     this.onFailure("Problème en exécutant l'action « " + msg + ' » : ' + e.message)
//     throw(e)
//   }
// }
//

// Tests.initBeforeRun = function(){
//
//   // Le code à jouer avant le début des tests
//   // Si c'est une promesse, on attend qu'il lance
//   // lui-même la suite du programme
//   var ret = null
//   if(undefined !== this.beforeTestsFunction){
//     ret = this.beforeTestsFunction()
//   }
//   if (ret && ret.constructor.name == 'Promise'){
//     ret.then(this.run.bind(this))
//   } else {
//     this.run()
//   }
// }
//
// Tests.run = function(){
//   this.log(RC+RC+RC+'%c============ DÉBUT DES TESTS ==============', STYLE1)
//   this.nextTest()
// }
// /**
//  * Méthode pour "terminer" les tests, c'est-à-dire pour afficher les
//  * résultats.
//  */
// Tests.termine = function(){
//   if(undefined !== this.afterTestsFunction){
//     this.afterTestsFunction()
//   }
//   var color = this.failure_count > 0 ? 'red' : (this.pending_count > 0 ? 'orange' : '#00BB00') ;
//   var str = `${this.success_count} success ${this.failure_count} failures ${this.pending_count} pendings`
//   $('#tags').html(`<div style="color:${color};font-weight:bold;padding:1em;">${str}</div><div style="padding:1em;font-style:italic;">Open the console to see the details.</div>`);
//   console.log(RC+RC+RC+'%c' + str, `color:${color};font-weight:bold;font-size:1.2em;`);
//   this.log(RC+RC+RC+'%c============ FIN DES TESTS ==============', STYLE1)
//   if(this.sys_errors.length){
//     console.log(RC+RC+'%cDes erreurs systèmes se sont produites :', REDBOLD+'font-size:1.1em;');
//     console.log('%c'+this.sys_errors[0], REDBOLD+'font-size:1.1em;');
//     console.error(this.sys_errors[0])
//   };
// }
//
// // ---------------------------------------------------------------------
//
// Tests.log = function(msg, style){
//   console.log(msg, style)
// }
//
// //  Méthodes fonctionnelles
// Tests.addTest = function(itest){
//   this.tests.push(itest)
// }
//
// Tests.add_sys_error = function(tcase, err) {
//   this.sys_errors.push([tcase, err]);
// }
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
//     Tests.add_sys_error(err_msg)
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
//     Tests.add_sys_error(err_msg)
//     throw(err_msg)
//   }
// }
}
