'use strict'

class MyObjet {
  static good_methode(){ }
  static toString(){return "L'Object MyObjet"}
  good_instance_method(){ }
  toString(){return "L'instance MyObjet"}
}

const test = new Test("Tests des fonctions")

test.before(()=>{
  Console.indent('Je vais attendre 2 secondes au début du test')
  return wait(2000)
})
test.after(()=>{
  Console.indent('Je vais attendre 3 secondes à la fin du test')
  return new Promise((ok,ko) => {
    setTimeout(()=>{
      Console.indent('1 seconde')
      setTimeout(()=>{
        Console.indent('2 secondes')
        setTimeout(()=>{
          Console.indent('3 secondes')
          ok()
        },1000)
      },1000)
    },1000)
  })
})

test.beforeCase( () => {
  Console.indent("J'attends 1 seconde avant le case")
  return wait(1000)

})
test.afterCase( () => {
  Console.indent("J'attends 1 seconde et demi après le case")
  return wait(1500)
})

test.case("`responds_to`", () => {
  expect(MyObjet).responds_to('good_methode')
  expect(MyObjet.prototype).responds_to('good_instance_method')
})

test.case("`not responds_to`", () => {
  expect(MyObjet).not.responds_to('mauvaise_methode')
  expect(MyObjet.prototype).not.responds_to('bad_instance_method')
})

module.exports = [test]
