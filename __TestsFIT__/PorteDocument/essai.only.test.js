'use strict'

/**
  Tests principaux du Porte-document
**/
const test1 = new Test("Pour essayer le filtrage des tests")

test1.case("Calcul un bon nombre les bons raccourcis-clavier", async () => {

  expect(2*5).to_be(6)

})

const test2 = new Test("Pour ne pas être pris par le filtre")

module.exports = [test1, test2]
