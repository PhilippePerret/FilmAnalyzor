'use strict'

/**
  Extension de l'objet Tests
  Pour les méthodes qui jouent les tests
**/
module.exports = {
    beforeTestsFunction: undefined
  , afterTestsFunction: undefined

  , runNextTestFile(){
      let file, test
      if ( isEmpty(this.testsFiles) ) return this.termine()
      try {
        file = this.testsFiles.shift() // pour l'erreur
        if ( (test = require(file)) && (test instanceof(Test)) ) {
          // test.run()
          console.log("On doit jouer le test", test)
        } else {
          throw new Error("Problème avec un fichier test qui ne retourne pas d'instance Test :", file)
        }
      } catch (e) {
        console.error(e)
      }
  }
}
