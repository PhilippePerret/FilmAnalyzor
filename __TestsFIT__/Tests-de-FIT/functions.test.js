'use strict'

class MyObjet {
  static good_methode(){ }
  static toString(){return "L'Object MyObjet"}
  good_instance_method(){ }
  toString(){return "L'instance MyObjet"}
}

const test = new Test("Tests des fonctions")

test.case("`responds_to`", () => {
  expect(MyObjet).responds_to('good_methode')
  expect(MyObjet).not.responds_to('mauvaise_methode')
  expect(MyObjet.prototype).responds_to('good_instance_method')
  expect(MyObjet.prototype).not.responds_to('bad_instance_method')
})

module.exports = [test]
