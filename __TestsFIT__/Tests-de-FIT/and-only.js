'use strict'

/**
  Tests principaux du Porte-document
**/
const test = new Test("Pour tenter des tests avec andonly")

test.case("Calcul un bon nombre les bons raccourcis-clavier", async () => {

  expect(2*5).to_be(7)
  expect(2+5,{subject:'2+5'}).to_be(7)

})

module.exports = test
