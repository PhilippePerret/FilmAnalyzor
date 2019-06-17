'use strict'

/**
  Tests principaux du Porte-document
**/
const test = new Test("Le Porte document")

test.case("applique les bons raccourcis-clavier", async () => {

  expect(2+4).to_be(6)
  // expect(2+4).to_be(5)

  // Au départ, le porte documents ne doit pas être visible
  // await expect('div#porte_documents').to_be_visible() // pour une erreur
  await expect('div#porte_documents').not.to_be_visible()

  // On demande l'affichage du porte-document
  current_analyse.editDocumentInPorteDocuments()

  // Le porte-document doit être ouvert et non caché
  // await expect('div#porte_documents').to_be_visible()
  await expect('div#porte_documents').to_be_visible()

  // Les bons raccourcis doivent être enclenchés
  expect(UI.).to_be()
});

module.exports = test
