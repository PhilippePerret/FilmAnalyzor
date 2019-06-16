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
    Console.subtitle(`---> Cas : ${my.name}`);
    ++ Tests.cases_count
    return new Promise(function(ok,ko){
      try{
        var res = my.fn()
        if (res && res.constructor.name === 'Promise') {
          console.log("C'est une promise : ", res)
          res.then(ok)
        } else {
          console.log("Ce n'est PAS une promise")
          ok()
        };
      } catch(err){
        ok()
        Tests.add_sys_error(my, err)
      }
    })
  }
}
