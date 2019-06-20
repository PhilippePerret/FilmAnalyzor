'use strict'
/**
  NOTES
    * À la fin de ce module est définie la méthode globale `assert`
**/
class FITAssertion {
constructor(pass, success_msg, failure_msg, options){
  if ( pass instanceof(FITResultat) ) {
    this.resultat = pass
    this.pass = this.resultat.valid
    this.success_message = this.resultat.messages.success
    this.failure_message = this.resultat.messages.failure
    this.options = this.resultat.options
  } else {
    this.pass = pass
    this.success_message = success_msg
    this.failure_message = failure_msg
    this.options = options || {}
  }
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
  Console.failure(this.finalFailureMessage)
}
/**
  Retourne le message final en fonction de :
    - la posivité de l'assertion (not or not)
    - le résultat de l'assertion ()

  Cette méthode est utile pour l'erreur produite en cas d'erreur
**/
get finalFailureMessage() {
  var msg = this.options.failure || this.failure_message
  if ( this.options && this.options.details ){
    msg += `\n${this.options.details.join(', ')}`
  }
  return msg
}

}// /class

/**
  Méthode assert utilisée par tous les matchers et assertion pour ajouter
  un success ou une failure.
  C'est aussi cette méthode qui throw une erreur pour interrompre le case en
  cas d'échec.
**/
global.assert = function(){
  let a = new FITAssertion(...arguments)
  a.add()
  if ( false === a.pass ) {
    throw new ExpectationError(a.finalFailureMessage)
  }
}
