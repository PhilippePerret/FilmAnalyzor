'use strict'

module.exports = {
  init(){
    // Il ne sert à rien d'initialiser this.cases ici, car la méthode pour
    // ajouter des cases est appelée avant qu'on puisse initer le Test (ici)
    // puisque c'est en requiérant le fichier que la méthode Test.case est
    // appelée.
    // this.cases = []
    this.srcRelPath =  Tests.relativePathOf(this.path)
    // Pour mettre les assertions
    this.successes  = []
    this.failures   = []
    // OK
    return this // chainage
  }

}
