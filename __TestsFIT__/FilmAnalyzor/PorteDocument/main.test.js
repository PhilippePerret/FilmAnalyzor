'use strict'

// const test = new Test("Porte document")

describe("Porte document", function(){

  this.before( () => {
    } )
  this.after(  () => {
    } )

  this.case("doit s'ouvrir avec le menu", async () => {
    await expect('div#porte_documents').not.is_visible()
    current_analyse.editDocumentInPorteDocuments()
    await expect('div#porte_documents').is_visible()
  })

  this.case("doit enclencher les bons raccourcis clavier", () => {

  })

})
