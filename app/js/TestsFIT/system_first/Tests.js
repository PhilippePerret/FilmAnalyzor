'use strict'

window.INDENT = '    '
window.RC     = `
`
window.STYLE1 = 'font-weight:bold;font-size:1.2em;'; // Titre principal/fin
window.STYLE2 = 'margin-top:2em;border:1px solid black;padding:2px 4px;font-size:1.21em;font-weight:bold;' // Tests
window.PATHSTYLE = 'font-size:0.85;color:grey;font-style:italic;margin-left:400px;'//path
window.STYLE3 = 'font-size:1.1em;font-weight:bold;' // Case
window.REDBOLD = 'font-weight:bold;color:red;'
window.BLUEBOLD = 'color:blue;font-weight:bold;'
window.GREENBOLD = 'color:darkgreen;font-weight:bold;'

Tests.TIMEOUT = 20000

// Pour définir les méthodes à appeler avant et après tous les tests
Tests.beforeTestsFunction = undefined
Tests.afterTestsFunction  = undefined

Tests.relativePathOf = function(fpath){
  var reg = new RegExp(`\/?\/\/${Tests.appPath}\/`)
  return fpath.replace(reg,'./').trim()
}
Tests.nextTest = function(){
  if (this.tests.length){
    this.tests.shift().run()
  } else {
    this.termine()
  }
}

Tests.assert = function(trueValue, msg_success, msg_failure, options){
  if(undefined === options){options = {}}
  if (trueValue === true){
    if(!(options.onlyFailure || false === options.success)) this.onSuccess(options.success || msg_success)
  } else {
    // En cas d'échec de l'assertion
    if(!(options.onlySuccess || false === options.failure)) this.onFailure(options.failure || msg_failure)
    throw('TEST FAILURE')
  }
}

Tests.onSuccess = function(msg){
  this.nombre_success ++ ;
  this.log(INDENT + '%c… ' + msg, 'color:#00AA00;') ;
}

Tests.onFailure = function(msg){
  this.nombre_failures ++ ;
  this.log(INDENT + '%c… ' + msg, 'color:red;') ;
}

Tests.tester  = function(str){console.log(RC+'%cÀ TESTER : '+str, REDBOLD)}
Tests.given   = function(str){console.log(RC+INDENT+'%c'+str+'…', BLUEBOLD)}
Tests.pending = function(str){
  this.nombre_pendings ++ ;
  this.log(RC+'%c'+(str||'TODO')+'…', 'color:orange;font-weight:bold;');
}
Tests.action  = function(msg, fn_action){
  try {
    this.log(INDENT+'%cACTION: '+msg, GREENBOLD)
    return fn_action()
  } catch (e) {
    this.onFailure("Problème en exécutant l'action « " + msg + ' » : ' + e.message)
    throw(e)
  }
}

// ---------------------------------------------------------------------

Tests.showTestTitle = function(str, relPath){
  this.log('%c'+str, STYLE2)
  this.log('%c'+relPath, PATHSTYLE)
}

Tests.initBeforeRun = function(){
  this.nombre_success   = 0
  this.nombre_failures  = 0
  this.nombre_pendings  = 0

  // Le code à jouer avant le début des tests
  // Si c'est une promesse, on attend qu'il lance
  // lui-même la suite du programme
  var ret = null
  if(undefined !== this.beforeTestsFunction){
    ret = this.beforeTestsFunction()
  }
  if (ret && ret.constructor.name == 'Promise'){
    ret.then(this.run.bind(this))
  } else {
    this.run()
  }
}

Tests.run = function(){
  this.log(RC+RC+RC+'%c============ DÉBUT DES TESTS ==============', STYLE1)
  this.nextTest()
}
/**
 * Méthode pour "terminer" les tests, c'est-à-dire pour afficher les
 * résultats.
 */
Tests.termine = function(){
  if(undefined !== this.afterTestsFunction){
    this.afterTestsFunction()
  }
  var color = this.nombre_failures > 0 ? 'red' : (this.nombre_pendings > 0 ? 'orange' : '#00BB00') ;
  var str = `${this.nombre_success} success ${this.nombre_failures} failures ${this.nombre_pendings} pendings`
  $('#tags').html(`<div style="color:${color};font-weight:bold;padding:1em;">${str}</div><div style="padding:1em;font-style:italic;">Open the console to see the details.</div>`);
  console.log(RC+RC+RC+'%c' + str, `color:${color};font-weight:bold;font-size:1.2em;`);
  this.log(RC+RC+RC+'%c============ FIN DES TESTS ==============', STYLE1)
  if(this.sys_errors.length){
    console.log(RC+RC+'%cDes erreurs systèmes se sont produites :', REDBOLD+'font-size:1.1em;');
    console.log('%c'+this.sys_errors[0], REDBOLD+'font-size:1.1em;');
    console.error(this.sys_errors[0])
  };
}

// ---------------------------------------------------------------------

Tests.log = function(msg, style){
  console.log(msg, style)
}

//  Méthodes fonctionnelles
Tests.addTest = function(itest){
  this.tests.push(itest)
}

Tests.add_sys_error = function(tcase, err) {
  this.sys_errors.push([tcase, err]);
}

Tests.beforeTests = function(fn) {
  var curMod
  try {
    pourObtenirPathTest // produit l'error pour récupérer le path
  } catch (e) {
    var src = e.stack.split("\n").reverse()[0].split(':')[1]
    curMod = Tests.relativePathOf(src)
  }
  if( undefined === Tests.beforeTestsFunction){
    Tests.module_defining_before_tests = curMod
    Tests.beforeTestsFunction = fn
  } else {
    var err_msg = `La méthode beforeTests() est déjà définie dans "${Tests.module_defining_before_tests}", on ne peut pas la redéfinir dans "${curMod}"`
    Tests.add_sys_error(err_msg)
    throw(err_msg)
  }

}
Tests.afterTests = function(fn) {
  var curMod
  try {
    pourObtenirPathTest // produit l'error pour récupérer le path
  } catch (e) {
    var src = e.stack.split("\n").reverse()[0].split(':')[1]
    curMod = Tests.relativePathOf(src)
  }
  if( undefined === Tests.afterTestsFunction){
    Tests.module_defining_after_tests = curMod
    Tests.afterTestsFunction = fn
  } else {
    var err_msg = `La méthode afterTests() est déjà définie dans "${Tests.module_defining_after_tests}", on ne peut pas la redéfinir dans "${curMod}"`
    Tests.add_sys_error(err_msg)
    throw(err_msg)
  }
}

// Raccourci
window.assert       = Tests.assert.bind(Tests)
window.given        = Tests.given.bind(Tests)
window.pending      = Tests.pending.bind(Tests)
window.tester       = Tests.tester.bind(Tests)
window.action       = Tests.action.bind(Tests)
window.beforeTests  = Tests.beforeTests.bind(Tests)
window.afterTests   = Tests.afterTests.bind(Tests)
