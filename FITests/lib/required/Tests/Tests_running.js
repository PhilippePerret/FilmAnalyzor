'use strict'

/**
  Extension de l'objet Tests
  Pour les méthodes qui jouent les tests
**/
module.exports = {
  beforeTestsFunction:  undefined
, afterTestsFunction:   undefined

, runAll(){
    if ( isEmpty(this.testsFiles) ) {
      Console.error(`Aucun fichier test n'est à jouer. Merci de les définir ou de rectifier le filtrage.`)
      return
    }
    // So we start!
    this.runNextTestFile()
  }

, async runNextTestFile(){
    let file, test, tests
    if ( isEmpty(this.testsFiles) ) return this.termine()
    try {
      file = this.testsFiles.shift() // `file` pour les messages d'erreurs
      tests = require(file)
      // +test+ peut être :
      //  - undefini => erreur de programmation des tests
      //  - une instance Test => un test unique dans le fichier
      //  - un Array de Test => une liste de tests
      if ( undefined === tests ) raise(`Le fichier ${file} n'exporte rien…`)
      else if ( ! Array.isArray(tests) ) tests = [tests]
      tests.forEach(async test => {
        test instanceof(Test) || raise(`Le fichier ${file} devrait retourner des instances Test…`)
        test.path = file
        // TODO : filtrer par le nom du test
        if ( this.config.regNames) {
          console.log("Je dois filtrer par le nom", this.config.regNames)
          if ( ! test.name.match(this.config.regNames) ) return this.runNextTestFile()
        }
        this.tests.push(test)
        this.currentTest = test
        await test.init().run()
        console.log("On passe au suivant")
      })
    } catch (e) {
      console.error(e)
    }
  }
}
