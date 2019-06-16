'use strict'
/**
  NOTES
    * À la fin de ce module est définie la méthode globale `assert`
**/

class FITAssertion {
constructor(pass, success_msg, failure_msg, options){
  this.pass = pass
  this.success_message = success_msg
  this.failure_message = failure_msg
  this.options = options || {}
}
/**
  Méthode pour ajouter ce résultat aux tests
**/
add(){
  Tests[this.pass?'addSuccess':'addFailure'](this)
  this.write()
}
/**
  Méthode générale pour écrire le résultat de l'assertion (si nécessaire)
**/
write(){
  this[this.pass ? 'writeSuccess' : 'writeFailure']()
}
writeSuccess(){
  if ( this.options.onlyFailure ) return
  Console.success(this.options.success || this.success_message)
}
writeFailure(){
  if ( this.options.onlySuccess ) return
  Console.failure(this.options.failure || this.failure_message)
}
}

global.assert = function(){
  (new FITAssertion(...arguments)).add()
}
