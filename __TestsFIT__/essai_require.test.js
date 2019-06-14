'use strict'
/**
  Ce test est fait pour tenter de fonction en requiérant le script
  de test (maintenant que je suis un peu plus à l'aise avec ça) plutôt qu'en
  le chargeant dans une balise script dans l'application (ce qui complique un
  peu l'étanchéité)

**/

const test = new Test("Un nouveau test.")

test.case("L'addition retourne le bon résultat", () => {
  assert_equal(6, 2+4)
})

module.exports = test
