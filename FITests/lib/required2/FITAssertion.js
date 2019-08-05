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
    this.options = this.resultat.options || {}
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
  Console.success(this.finalMessage)
}
writeFailure(){
  if ( this.options.onlySuccess ) return
  Console.failure(this.finalMessage)
}

/**
  Le message final, que ce soit un échec ou un succès,
**/
get finalMessage() {
  if ( this.pass ) {
    // => SUCCÈS
    return this.options.success || this.options.onlySuccess || this.success_message
  } else {
    // => ÉCHEC
    return this.finalFailureMessage
  }
}
/**
  Retourne le message final en fonction de :
    - la posivité de l'assertion (not or not)
    - le résultat de l'assertion ()

  Cette méthode est utile pour l'erreur produite en cas d'erreur
**/
get finalFailureMessage() {
  var msg = this.options.failure || this.options.onlyFailure || this.failure_message
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

  [1] Quand on utilise les expectations/assertions seulement, sans tester une
      application, il faut toujours se contenter de retourner true ou false et
      le message éventuel.
**/
global.assert = function(){
  let ass = new FITAssertion(...arguments)
  // Si on a juste besoin de la valeur de l'assertion, sans l'écrire en
  // tant qu'échec ou succès, on la retourne.
  if ( Tests.EXPECT_ONLY_MODE /* [1] */ ) {
    return {ok:ass.pass, message:ass.finalMessage}
  } else if ( ass.options.onlyReturn) return ass.pass
  // Sinon, on l'écrit et on produit une failure le cas échéant.
  ass.add()
  if ( false === ass.pass ) {
    if ( Tests.config.debug || Tests.config.trace ) {
      // Si on est en mode débug (configuration), on affiche le message
      // d'erreurs complet.
      throw new ExpectationError(ass.finalFailureMessage)
    }
    if (Tests.config.fail_fast){
      // console.log("Je dois m'arrêter tout de suite")
    }
  }
  return ass.pass
}
