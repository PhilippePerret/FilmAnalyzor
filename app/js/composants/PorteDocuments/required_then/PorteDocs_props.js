'use strict'
/**
  Propriétés de PorteDocuments
*/


Object.defineProperties(PorteDocuments,{
  a:{ get(){return current_analyse} }

// Retourne true si la case "Visualiser" est cochée
, visualizeDoc:{get(){return this.cbVisualize.checked}}
, cbVisualize:{get(){return this._cbvisualize||defP(this,'_cbvisualize',DGet('cb-auto-visualize'))}}

, spanMessage:{get(){ return this._spanmsg || defP(this,'_spanmsg', this.section.find('#porte_documents-message'))}}

, fwindow:{
    get(){return this._fwindow || defP(this,'_fwindow', new FWindow(this,{id:'porte_documents', name:'PORTEDOCUMENT', containment:null, container:this.section, draggable:'x', swiping:true, left: 400, top:10}))}
  }
  // Pour utiliser `[print] this.formater("le texte")`
, formater:{
    get(){return this._formater||defP(this,'_formater', this.fatexte.formate.bind(this.fatexte))}
  }
, fatexte:{
    get(){return this._fatexte||defP(this,'_fatexte', new FATexte(''))}
  }
  /**
   * Le selecteur, pour gérer la sélection
   */
, selector:{
   get(){return this._selector || defP(this,'_selector', new Selector(this.docField))}
 }
// Retourne la table de tous les documents courants (id du document en clé)
, documents:{get(){return this._documents || defP(this,'_documents',this.getDocuments())}}
// Retourne la liste des documents personnalisés
, customDocuments:{
    get(){return this._customDocuments || defP(this,'_customDocuments', this.makeCustomDocumentsList())}
  }
, listableDocuments:{get(){return this._listableDocuments || defP(this,'_listableDocuments',this.makelistableDocumentsList())}}
, jqObj: {get(){return this.fwindow.jqObj}}
, section: {get(){return $('#section-porte-documents')}}
, menuDocuments:{
    get(){return $('#section-porte-documents .header select#document-type')}
  }
, header:{ get(){return $('#section-porte-documents .header')} }
, body:{ get(){return $('#section-porte-documents .body')} }
, footer:{ get(){return $('#section-porte-documents .footer')} }
, docField:{ get(){return $('#section-porte-documents .body textarea#document-contents')} }
, btnSave: {get(){return this.section.find('.footer button#btn-save-doc')}}
, btnDrop: {get(){return this.section.find('.header .porte_documents-btn-drop')}}
, menuThemes: {get(){return this.section.find('#porte_documents-theme')}}
, menuModeles:{ get(){return $('#section-porte-documents select#modeles-doc')} }
, visualizor:{ get(){return $('#porte_documents-doc-visualizor')} }

})

Object.assign(PorteDocuments,{
  /**
    Fait la table de tous les documents courants et la retourne
    (pour this.documents)
  **/
  getDocuments(){
    var maxId = 49
      // , tbl   = {}
      , tbl   = new Map()
    globSync(`${this.a.folderFiles}/*.*`).forEach( dpath => {
      var docId = this.docIdFromPath(dpath)
      tbl.set(docId, new FADocument(docId))
      if ( docId > maxId ) maxId = docId
    })
    // On renseigne le dernier identifiant utilisé (ou 49 pour 1er à 50)
    FADocument.lastCustomID = maxId
    return tbl
  }

/**
  Retourne l'identifiant du document de path +dpath+
  Ce peut être un document standard (dans ce cas l'affixe est la clé dans
  la table DATA_DOCUMENT) ou ça peut être un document customisé (dans ce
  cas l'affixe est composé avec "custom-<ID>")
**/
, docIdFromPath(dpath){
    let affixe = path.basename(dpath, path.extname(dpath))
    if ( isDefined(DATA_DOCUMENTS[affixe]) ) { // Un document standard
      return DATA_DOCUMENTS[affixe].id
    } else { // Un document customisé ("custom-XXX.md")
      return parseInt(affixe.split('-')[1],10)
    }
  }

/**
  Retourne la liste des documents qui sont "listables", c'est-à-dire qui
  peuvent être affichés dans la liste des documents (pour association).
  On retire de la liste des documents ceux qui sont des documents de données.
**/
, makelistableDocumentsList(){
    return Array.from(this.documents.values()).filter( doc => doc.isReal )
  }
})
