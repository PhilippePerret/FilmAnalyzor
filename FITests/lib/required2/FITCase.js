'use strict'
/**
  Class FITCase
  Pour les cas des tests
**/
class FITCase {
constructor(test, name, fn){
  this.test = test  // {Test}
  this.name = name  // {String}
  this.fn   = fn    // {Function}
}

/**
  Lancement du cas du test
**/
run(){
  var my = this ;
  // console.log(`%c---> Cas : ${my.name}`, STYLE3);
  this.writeFormatedName()
  return new Promise((ok,ko) => {
    try {
      var res = my.fn()
      if (res && res.constructor.name === 'Promise') {

        // Assertion asynchrone
        res
          .then(ok)
          .catch((err) => {
            this.traiteError(err)
            ok()
          })

      } else {

        // Assertion synchrone
        try {
          ok()
        } catch (err) {
          this.traiteError(err)
        }

      };
    } catch(err){
      this.traiteError(err)
      // Dans tous les cas, on achève le test
      ok()
    }
  })
}

/**
  Traitement de l'erreur, qui peut être normale (ExpectationError) ou
  systémique (Error).

  On utilise une méthode séparée car elle peut être appelée de trois endroits
  différents :
    - le catch d'une promise (si c'en est une)
    - le catch normal du test de l'assertion (pas une promise)
    - le catch systématique (on aurait pu aussi le séparer)
**/
traiteError(error) {
  this.failed = true
  switch (error.type) {
    case 'ExpectationError':
      // Rien à faire, l'erreur est traitée avant
      // Sauf si on est en mode expectOnly
      // if ( Tests.EXPECT_ONLY_MODE ) {
      //   throw new Error(error)
      // }
      break;
    default:
      // Une erreur systémique (pas une erreur de test)
      Tests.addSystemError(this, error)
  }
}

/**
  Le titre à afficher
  Il dépend du fait que les tests soient joués aléatoirement ou non.
  S'ils ne sont pas joués aléatoirement, le nom du test est affiché, donc
  inutile de le mettre.
**/
writeFormatedName(){
  if (Tests.config.random){
    Console.path(this.test.srcRelPath)
    Console.subtitle(`-> ${this.test.name} ${this.name}`)
  } else {
    Console.subtitle(`---> ${this.name}`)
  }
}

}

module.exports = FITCase
