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
    // On doit ouvrir le porte documents si ça n'est pas fait
    if ( $('div#porte_documents').length === 0) {
      current_analyse.editDocumentInPorteDocuments()
    }
    expect(UI.currentShortcutsName,{sujet:'Les raccourcis UI courants'}).to_be('TEXT FIELD')
    action("On blure du champ textarea", ()=>{(PorteDocuments.docField)[0].blur()})

    // On blur du champ de texte, on doit se trouver avec les raccourcis du porte-documents
    expect(UI.currentShortcutsName,{sujet:'Les raccourcis UI courants'}).to_be('PORTE-DOCS')
    expect(UI.markShortcuts.html(),{sujet:'La marque de statusbar'}).to_be('PORTE-DOCS')
  })

})
