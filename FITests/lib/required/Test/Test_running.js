'use strict'

module.exports = {
  init(){
    // Il ne sert à rien d'initialiser this.cases ici, car la méthode pour
    // ajouter des cases est appelée avant qu'on puisse initer le Test (ici)
    // puisque c'est en requiérant le fichier que la méthode Test.case est
    // appelée.
    // this.cases = []
    this.srcRelPath =  Tests.relativePathOf(this.path)
    // Avant de lancer les tests, si on doit les lancer dans le désordre,
    // on mélange la liste
    if ( Tests.config.random ) { this.cases = Array.shuffle(this.cases) }
    // OK
    return this // chainage
  }
/**
  Jouer le test
**/
, run(){
    Console.framedTitle(this.name)
    Console.path(this.srcRelPath)
    return this.runNextCase()
  }

}
