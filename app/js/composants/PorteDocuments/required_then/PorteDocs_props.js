'use strict'
/**
  Propriétés de PorteDocuments
*/


Object.defineProperties(PorteDocuments,{
  a:{ get(){return current_analyse} }

// Retourne true si la case "Visualiser" est cochée
, visualizeDoc:{get(){return this.cbVisualize.checked}}
, cbVisualize:{get(){return this._cbvisualize||defP(this,'_cbvisualize',DGet('cb-auto-visualize'))}}

, spanMessage:{get(){ return this._spanmsg || defP(this,'_spanmsg', this.section.find('#writer-message'))}}

, fwindow:{
    get(){return this._fwindow || defP(this,'_fwindow', new FWindow(this,{id: 'writer', containment: null, container:this.section, draggable:'x', swiping:true, left: 400, top:10}))}
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
/**
  Retourne la liste des documents personnalisés
**/
, customDocuments:{
    get(){return this._customDocuments || defP(this,'_customDocuments', this.makeCustomDocumentsList())}
  }
, jqObj: {get(){return this.fwindow.jqObj}}
, section: {get(){return $('#section-porte-documents')}}
, menuTypeDoc:{
    get(){return $('#section-porte-documents .header select#document-type')}
  }
, header:{ get(){return $('#section-porte-documents .header')} }
, body:{ get(){return $('#section-porte-documents .body')} }
, footer:{ get(){return $('#section-porte-documents .footer')} }
, docField:{ get(){return $('#section-porte-documents .body textarea#document-contents')} }
, btnSave: {get(){return this.section.find('.footer button#btn-save-doc')}}
, btnDrop: {get(){return this.section.find('.header .writer-btn-drop')}}
, menuThemes: {get(){return this.section.find('#writer-theme')}}
, menuModeles:{ get(){return $('#section-porte-documents select#modeles-doc')} }
, visualizor:{ get(){return $('#writer-doc-visualizor')} }

})
