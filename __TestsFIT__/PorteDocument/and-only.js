'use strict'

/**
  Tests principaux du Porte-document
**/
const test = new Test("Pour essayer le filtrage des tests avec andonly")

test.case("Calcul un bon nombre les bons raccourcis-clavier", async () => {

  expect(2*5).to_be(6)

})

module.exports = test
