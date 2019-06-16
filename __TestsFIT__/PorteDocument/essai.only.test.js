'use strict'

/**
  Tests principaux du Porte-document
**/
const test1 = new Test("Pour essayer le filtrage des tests")

test1.case("Deux opérations avec une fausse et un wait", async () => {

  expect(2*3,{subject:'2*3'}).to_be(6)
  await wait(2000)
  expect(2*5).to_be(6)

})

const test2 = new Test("Pour ne pas être pris par le filtre")

test2.case("Autre calcul pour voir", _ => {
  expect(12*5,{subject:'12*5'}).to_be(60)
})

module.exports = [test1, test2]
