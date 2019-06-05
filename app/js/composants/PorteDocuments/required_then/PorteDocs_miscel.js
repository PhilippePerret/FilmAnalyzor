'use strict'
/**
  Extension du porte-documents

**/
Object.assign(PorteDocuments,{
  init(){
    Snippets.init()
    this.inited = true
  }
/**
    Sauvegarde du document courant
 */
, saveCurrentDoc(){ this.currentDocument.save() }


/**
  S'assure que le porte_documents ne se trouve pas sur le visualiseur
**/
, positionneWriter(){
  if(this.jqObj.position().left < (this.visualizor.position().left + this.visualizor.outerWidth())){
    this.jqObj.animate({left:(this.visualizor.position().left + this.visualizor.outerWidth() + 40) + 'px'})
  }
}

// Marque que le document courant est modifié
, setModified(mod){
    if (this.autoSave) return
    this.jqObj[mod?'addClass':'removeClass'](STRmodified)
  }

/**
 Pour afficher un message propre au porte_documents
*/
, message(msg){ this.spanMessage.html(msg || '') }

/**
Méthode permettant de boucler sur tous les documents User (donc les
document propres à l'analyse courante)
**/
, forEachCustomDocument(method){
    this.customDocuments.forEach(wdoc => method(wdoc))
  }

/**
  Relève la liste des documents personnalisés (pour la propriété
  `this.customDocuments`)
**/
, makeCustomDocumentsList(){
    return Array.from(this.documents.values()).filter( doc => doc.isCustomDoc )
  }

})
