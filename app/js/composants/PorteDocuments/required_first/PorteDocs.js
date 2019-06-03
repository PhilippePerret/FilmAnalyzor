'use strict'

const PorteDocuments = {
  class: 'PorteDocuments'
, inited: false,
, isOpened: false
, currentDoc: undefined // instance FADocument

/**
  Ouvre le document d'identifiant +doc_id+ ('document-XXX')

  @param {Number} docId   L'identifiant du document (ou undefined)
                          Si indéfini, c'est l'introduction qui est ouverte,
                          c'est-à-dire le document #1
**/
, openDocument(docId) {
    docId = docId || 1
    // Si le porte-documents est déjà ouvert, il faut vérifier que le
    // document édité ait bien été enregistré
    if ( this.isOpened && isFalse(this.checkCurrentDocModified()) ) return
    this.message(`Document #${docId} en préparation…`)
    this.makeCurrent(docId)
    this.message('Document prêt à être travaillé.')
  }
/**
  Ouvre un fichier quelconque, par exemple un fichier de données de procédés.
  Ce type de document n'appartiennent jamais à l'analyse.

**/
, openSystemDoc(path){
    if(isFalse(this.checkCurrentDocModified())) return
    defaultize(this,'documents',{})
    let fadoc = new FADocument(path)
    this.documents[path] = fadoc
    this.makeCurrent(path)
  }


  /**
    Fait du document +docId+ le document courant.

    @param {Number} docId Identifiant du document à ouvrir (ou path)
   */
, makeCurrent(docId) {
    if ( isFalse(this.checkCurrentDocModified()) ) return
    defaultize(this, 'documents', {})
    isDefined(this.documents[docId]) || ( this.documents[docId] = new FADocument(docId) )
    this.currentDoc = this.documents[docId]
    this.isOpened || this.open()
    this.currentDoc.display()
    this.visualizeDoc && this.updateVisuDoc()
    // On "referme" toujours le menu des types (après l'ouverture)
    this.menuTypeDoc.val(docId)
    // On renseigne le bouton droppable
    var attrs = {}
    attrs[STRdata_type] = STRdocument
    attrs[STRdata_id]   = this.currentDoc.id
    this.btnDrop.attr(attrs)
  }

// Permet de forcer le rechargement du document d'identifiant +kdoc+. La
// méthode est utilisée par le dataeditor
, resetDocument(docId){
    if ( isUndefined(this.documents) ) return
    this.currentDoc && this.currentDoc.id == docId && this.hide()
    delete this.documents[docId]
  }

/**
 * Actualise la visualisation du contenu Markdown dans le visualiseur
 */
, updateVisuDoc(){
    var contenu
    if (this.currentDoc.dataType.type === STRdata){
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
, checkCurrentDocModified(){
    var choix
    if ( this.currentDoc && this.currentDoc.isModified()){
      if ( this.a.locked ) {
        choix = 2 // Pour ignorer les changements
      } else {
        choix = DIALOG.showMessageBox({
            type:       'warning'
          , buttons:    ["Enregistrer", "Annuler", "Ignorer les changements"]
          , title:      "Document courant non sauvegardé"
          , defaultId:  0
          , cancelId:   1
          , message:    T('ask-for-save-document-modified', {type: this.currentDoc.type})
        })
      }
      switch (choix) {
        case 0:
          this.currentDoc.save()
          return true
        case 1: // annulation
          return false
        case 2: // on ignore les modifications
          this.currentDoc.retreiveLastContents()
          return true
      }
    } else return true // pas de document ou pas de document modifié
  }

/**
 * Menu appelé quand on choisit un type de document dans le menu
 */
, onChooseTypeDoc(e){
    this.makeCurrent(this.menuTypeDoc.val())
  }

/**
 * Méthode appelée quand on choisit un modèle de document
 */
, onChooseModeleDoc(e){
    // On charge le modèle
    var modelPath = $('#section-porte-documents select#modeles-doc').val()
    this.currentDoc.setContents(fs.readFileSync(modelPath, 'utf8'))
    // On remet toujours le menu au début
    $('#section-porte-documents select#modeles-doc').val('')
  }

  /**
   * Quand on change de thème
   */
, onChooseTheme(e,theme){
    theme = theme || $('#section-porte-documents #writer-theme').val()
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
    this.currentDoc.contents = this.docField.val()
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
    let my = this
      , any = this.currentDoc.dtype == STRany
      , rpath = any ? this.currentDoc.path.replace(new RegExp(`^${APPFOLDER}`),'.'):'DOCUMENT '
    // On masque le menu des types de document si c'est un document système
    my.menuTypeDoc[any?STRhide:STRshow]()
    my.section.find('.header #writer-doc-title label').html(rpath)
    new Array(
        '#writer-doc-title select'
      , '.div-modeles'
      , '.writer-btn-drop'
      , '#writer-btn-new-doc'
    ).map( sel => my.section.find(`.header ${sel}`)[any?STRhide:STRshow]())

    // On règle la taille pour que ça prenne toute la hauteur
    this.fwindow.jqObj.outerHeight( H - 10 )

    // On le positionne par rapport au visualiseur
    this.positionneWriter()
  }

, beforeHide(){ return !!this.checkCurrentDocModified() }
, hide(){ this.fwindow.hide() }
, onHide(){
    this.stopTimers()
    this.isOpened = false
    delete this.currentDoc
    this.setAutoVisualize()
    this.visualizor.hide()
  }


} // /PorteDocuments
