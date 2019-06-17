'use strict'
/**
  Extension de Tests pour préparer les tests
  L'idée est d'obtenir la liste des cases à jouer
**/
module.exports = {
  prepareAllCases(){
    let file, test, tests

    // Liste qui va conserver tous les cas à jouer
    this.allCases = []

    // Nombre de millisecondes d'attente forcée
    this.dureeWaits = 0

    // On boucle sur chaque fichier de test qui a déjà été filtré
    while ( file = this.testsFiles.shift() ) {

      try {

        // On requiert le fichier de test.
        // Il doit exporter un ou plusieurs tests, qu'on va filtrer et conserver
        tests = require(file)
        // +test+ peut être :
        //  - undefini => erreur de programmation des tests
        //  - une instance Test => un test unique dans le fichier
        //  - un Array de Test => une liste de tests
        if ( 'object' === typeof(tests) && Object.keys(tests).length == 0 ){
          throw new TestExportationError(file)
        }
        else if ( ! Array.isArray(tests) ) tests = [tests]
        ++ this.files_count
        // On va relever tous les cases valides de chaque test
        for ( test of tests ) {
          if ( test instanceof(Test) ) {
            this.prepareTest(test, file)
          } else {
            // Si le test n'en est pas un
            this.addTestError()
          }
        }

      } catch (e) {
        Console.error(e.message)
      }
    }
  }

, prepareTest(test, file){
    test.path = file
    // Filtrer par le nom du test
    if ( this.config.regNames) {
      console.log(`Je dois filtrer le TEST "${test.name}" avec ${this.config.regNames}`)
      // Si le test ne remplit pas les conditions sur le nom, on le passe
      if ( ! test.name.match(this.config.regNames) ) return
      console.log("OK")
    }
    //
    var testIsRequired = false
    // Le test est valide, mais a-t-il des cas à étudier (filtrage)
    for (var cas of test.cases) {
      if ( this.config.regCases ) {
        console.log(`Je dois filtrer le CASE "${cas.name}" avec ${this.config.regCases}`)
        if ( ! cas.name.match(this.config.regCases) ) continue
        console.log("OK")
      }
      this.allCases.push(cas)
      ++ this.cases_count
      testIsRequired = true
    }
    if ( testIsRequired ) {
      ++ this.tests_count
      test.init()
    }
  }
}
