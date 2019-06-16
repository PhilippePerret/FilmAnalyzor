'use strict'
/**
  Class FITCase
  Pour les cas des tests
**/
module.exports = {
/**
  Lancement du cas du test
**/
  run(){
    var my = this ;
    // console.log(`%c---> Cas : ${my.name}`, STYLE3);
    this.writeFormatedName()
    return new Promise((ok,ko) => {
      try{
        var res = my.fn()
        if (res && res.constructor.name === 'Promise') {
          res.then(ok)
        } else {
          ok()
        };
      } catch(err){
        ok()
        Tests.add_sys_error(my, err)
      }
    })
  }

/**
  Le titre à afficher
  Il dépend du fait que les tests soient joués aléatoirement ou non.
  S'ils ne sont pas joués aléatoirement, le nom du test est affiché, donc
  inutile de le mettre.
**/
, writeFormatedName(){
    if (Tests.config.random){
      Console.subtitle(`-> ${this.test.name} :: Cas : ${this.name}`)
      Console.path(this.test.srcRelPath)
    } else {
      Console.subtitle(`---> Cas ${this.name}`)
    }
}
}
