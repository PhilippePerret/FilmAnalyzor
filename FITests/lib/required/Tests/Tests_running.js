'use strict'

/**
  Extension de l'objet Tests
  Pour les méthodes qui jouent les tests
**/
module.exports = {
  beforeTestsFunction:  undefined
, afterTestsFunction:   undefined

, async runAll(){
    if ( this.cases_count === 0 ) {
      Console.error(`Aucun fichier test n'est à jouer. Merci de les définir ou de rectifier le filtrage.`)
      return
    }
    // S'il le faut, il faut mélanger de façon aléatoire les cas
    Tests.config.random && ( this.allCases = Array.shuffle(this.allCases) )

    // So we start!
    this.startAll()

    await this.execBeforeTests()

    for (var cas of this.allCases ) {
      if ( this.config.random ) {
        this.currentTest = cas.test
      } else {
        if ( this.currentTest != cas.test ) {
          this.currentTest = cas.test
          this.showCurrentTestTitle(this.title, this.srcRelPath)
        }
      }
      // await this.simuleCase(cas)
      await cas.run()

      // Si on doit s'arrêter au premier échec
      if ( this.config.fail_fast && cas.failed ){
        Console.redbold("FAIL-FAST ACTIVE")
        break
      }

    }

    await this.execAfterTests()

    this.termineAll()
  }

/**
  À exécuter avant tous les tests
**/
, async execBeforeTests(){
    if (fs.existsSync(this.beforeTestsFile) ) {
      await (require(this.beforeTestsFile)).call()
    }
    return true
  }
, async execAfterTests() {
    if (fs.existsSync(this.afterTestsFile) ) {
      await (require(this.afterTestsFile)).call()
    }
    return true
  }
/**
  En attendant que tout marche, on simule le run du case
**/
, simuleCase(cas) {
    console.log(`Simulation du cas "${cas.name}" du test "${cas.test.name}"`)
    return new Promise((ok,ko) => {setTimeout(ok, 1500)})
  }

}
