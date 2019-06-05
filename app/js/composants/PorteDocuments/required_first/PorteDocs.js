'use strict'

const PorteDocuments = {
  class: 'PorteDocuments'
, inited: false
, isOpened: false
, currentDocument: undefined // instance FADocument

/**
  Ouvre le document d'identifiant +doc_id+ ('document-XXX') en édition

  @param {Number} docId   L'identifiant du document (ou undefined)
                          Si indéfini, c'est l'introduction qui est ouverte,
                          c'est-à-dire le document #1
**/
, editDocument(docId) {
    docId = docId || 1
    // console.log("-> editDocument()", docId)
    // Si le porte-documents est déjà ouvert, il faut vérifier que le
    // document édité ait bien été enregistré
    if ( this.keepCurrentDocument() ) return
    isDefined(this.documents.get(docId)) || this.defineDocument(docId)
    this.currentDocument = this.documents.get(docId)
    this.isOpened || this.open()
    this.currentDocument.edit()
    this.visualizeDoc && this.updateVisuDoc()
    this.menuDocuments.val(docId)
    this.setDroppableButtonForCurrent()
  }

/**
  Quand il faut définir un document qui n'existe pas encore
**/
, defineDocument(docId){
    this.documents.set(docId, new FADocument(docId))
  }

  /**
    Fait du document +docId+ le document courant.

    @param {Number} docId Identifiant du document à ouvrir (ou path)
   */
, setDroppableButtonForCurrent() {
    this.btnDrop.attr('data-id',this.currentDocument.id)
    console.log("this.btnDrop:", this.btnDrop)
  }

/**
  Méthode pour boucler sur tous les documents actuels
**/
, forEachDocument(fn){
    for(var doc of this.documents){
      if ( isFalse(fn(doc)) ) break // pour pouvoir interrompre
    }
  }

// Permet de forcer le rechargement du document d'identifiant +docId+. La
// méthode est utilisée par le dataeditor quand le document a été modifié.
, resetDocument(docId){
    this.currentDocument && this.currentDocument.id == docId && this.hide()
    this.documents.get(docId).reset()
  }

/**
 * Actualise la visualisation du contenu Markdown dans le visualiseur
 */
, updateVisuDoc(){
    var contenu
    if (this.currentDocument.data.type === STRdata){
      contenu = '<div>Fichier de données. Pas de formatage particulier.</div>'
    } else {
      contenu = this.formater(this.docField.val(), {format: HTML, no_br: true})
    }
    this.visualizor.html(contenu)
    contenu = null
  }

//
/**
* La méthode vérifie que le document courant, s'il a été modifié, ait bien
* été enregistré.
*
* Dans le cas contraire, il demande à l'utilisateur ce qu'il veut faire :
*   - enregistrer les changements avant de poursuivre (return true)
*   - ignore les changements et poursuivre (return true)
*   - annuler, donc ne pas poursuire (return false)
**/
, keepCurrentDocument(){
    if ( isUndefined(this.currentDocument) ) return false
    if ( this.a.locked ) return false
    if ( isFalse(this.currentDocument.isModified()) ) return false
    var choix = DIALOG.showMessageBox({
        type:       'warning'
      , buttons:    ["Enregistrer", "Annuler", "Ignorer les changements"]
      , title:      "Document courant non sauvegardé"
      , defaultId:  0
      , cancelId:   1
      , message:    T('ask-for-save-document-modified', {type: this.currentDocument.type})
    })
    switch (choix) {
      case 0:
        this.currentDocument.save()
        return false
      case 1: // annulation
        return true
      case 2: // on ignore les modifications
        this.currentDocument.retreiveLastContents()
        return false
    }
  }

/**
   Menu appelé quand on choisit un type de document dans le menu

   @param {Event} e L'évènement de menu
 */
, onChooseDocument(e){
    this.editDocument(parseInt(this.menuDocuments.val(),10))
  }

/**
 * Méthode appelée quand on choisit un modèle de document
 */
, onChooseModeleDoc(e){
    // On charge le modèle
    var modelPath = $('#section-porte-documents select#modeles-doc').val()
    this.currentDocument.setContents(fs.readFileSync(modelPath, 'utf8'))
    // On remet toujours le menu au début
    $('#section-porte-documents select#modeles-doc').val('')
  }

  /**
   * Quand on change de thème
   */
, onChooseTheme(e,theme){
    theme = theme || $('#section-porte-documents #porte_documents-theme').val()
    this.applyTheme(theme)
  }
  /**
   * Méthode qui applique le thème +theme+ à l'interface
   */
, applyTheme(theme){
    // console.log("-> applyTheme", theme)
    this.body.removeClass(this.currentTheme).addClass(theme)
    this.docField.removeClass(this.currentTheme).addClass(theme)
    this.menuThemes.val(theme)
    this.currentTheme = theme
  }

/**
  Méthode appelée lorsque le contenu du document est changé
  C'est la seule procédure qui doit pouvoir changer le `contents` du
  document courant.
*/
, onContentsChange(){
    this.currentDocument.contents = this.docField.val()
  }

/**
  Réinitialise le porte-documents, donc vide le champ de texte
**/
, reset(){
    this.docField.val('')
  }

/**
  Ouverture du Porte-documents.
 */
, open(){
    UI.sectionWriter[this.isOpened?STRhide:STRshow]()
    this.fwindow[this.isOpened?STRhide:STRshow]()
    this.visualizor[this.visualizeDoc?STRshow:STRhide]()
  }

, onShow(){
    this.setUI() // thème, menu de modèles
    this.docField.focus()
    this.isOpened = true
}

/**
  Préparation de l'interface en fonction du type de document
  Méthode inaugurée pour afficher seulement le path d'un document quelconque
  mis en édition.
**/
, setUI(){
    let my  = this
      , sys = this.currentDocument.dtype == STRsystem
      , rpath = sys ? this.currentDocument.path.replace(new RegExp(`^${APPFOLDER}`),'.'):'DOCUMENT '
    // On masque le menu des types de document si c'est un document système
    my.menuDocuments[sys?STRhide:STRshow]()
    my.section.find('.header #porte_documents-doc-title label').html(rpath)
    new Array(
        '#porte_documents-doc-title select'
      , '.div-modeles'
      , '.porte_documents-btn-drop'
      , '#porte_documents-btn-new-doc'
    ).map( sel => my.section.find(`.header ${sel}`)[sys?STRhide:STRshow]())

    // On règle la taille pour que ça prenne toute la hauteur
    this.fwindow.jqObj.outerHeight( H - 10 )

    // On le positionne par rapport au visualiseur
    this.positionneWriter()
  }

, beforeHide(){ return !this.keepCurrentDocument() }
, hide(){ this.fwindow.hide() }
, onHide(){
    this.stopTimers()
    this.isOpened = false
    delete this.currentDocument
    this.setAutoVisualize()
    this.visualizor.hide()
  }


} // /PorteDocuments
