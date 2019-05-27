'use strict'
/**
 * Ce module du FAWriter est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

const FAWriter = {
  class: 'FAWriter'
, type: 'object'

, inited: false     // Pour savoir s'il a été initié
, ready: false      // pour savoir s'il est préparé
, isOpened: false   // Pour savoir si le writer est ouvert ou fermé

, currentDoc: undefined //l'instance FADocument courante (elle doit toujours exister)

// Ouvre un fichier quelconque (par son path)
, openAnyDoc(path){
    if(isFalse(this.checkCurrentDocModified())) return
    // isDefined(this.writerDocs) || ( this.writerDocs = {} )
    defaultize(this, 'writerDocs', {})
    let ndoc = new FADocument(STRany, null, path)
    this.writerDocs[`any^^^${ndoc.id}`] = ndoc
    this.makeCurrent(STRany, ndoc.id)
  }

/**
 * Ouverture du document d'id +docid+ (p.e. 'introduction' ou 'custom-12')

 ATTENTION : pour un document quelconque, utiliser la méthode
 `openAnyDoc`
 */
, openDoc(dtype, docid){
    let idx
    if(dtype && isUndefined(docid)){
      // Quand seul l'identifiant est transmis
      [docid, dtype] = [dtype, undefined]
    }
    if( isUndefined(docid) || isEmpty(docid) ){
      // <= Aucun type de document n'a été choisi (note : cela se produit
      //    par exemple lorsque l'on choisit d'ouvrir le writer par le menu)
      // => On prend le document par défaut, c'est-à-dire l'introduction
      if (this.isOpened){
        if(this.checkCurrentDocModified()) return this.hide()
        else return false
      } else {
        this.menuTypeDoc.value = 'introduction'
        dtype = 'regular'
        docid = 'introduction'
      }
    } else if(!dtype) {
      [dtype, idx] = (docid||'').split('-')
      if(dtype !== 'custom') dtype = 'regular'
    }
    this.message(`Document ${dtype} "${docid}" est en préparation…`)
    this.makeCurrent(dtype, docid)
    this.message('Document prêt à être travaillé.')
  }

  /**
   * Fait du document de type +dtype+ le document courant.
   *
   * +kdoc+   Pour les types non customisés, ça correspond à 'type'
   *          Pour les autres, de type 'customdoc', c'est l'identifiant
   */
, makeCurrent(dtype, docid) {
    let kdoc ;
    if(isUndefined(docid)){
      // C'est que c'est le kdoc qui a été envoyé
      [dtype, docid, kdoc] = [...dtype.split('^^^'), dtype]
    } else {
      kdoc = `${dtype}^^^${docid}`
    }
    if(isFalse(this.checkCurrentDocModified())) return
    defaultize(this, 'writerDocs', {})
    console.log("this.writerDocs:", this.writerDocs)
    console.log("kdoc:", kdoc)
    console.log("this.writerDocs[kdoc]:", this.writerDocs[kdoc])
    isDefined(this.writerDocs[kdoc]) || ( this.writerDocs[kdoc] = new FADocument(dtype, docid) )
    this.currentDoc = this.writerDocs[kdoc]
    if(!this.isOpened) this.open()
    this.currentDoc.display()
    if(this.visualizeDoc) this.updateVisuDoc()
    // On "referme" toujours le menu des types (après l'ouverture)
    this.menuTypeDoc.val(kdoc)
    // On renseigne le bouton droppable
    var attrs = {}
    attrs[STRdata_type] = STRdocument
    attrs[STRdata_id]   = this.currentDoc.id
    this.btnDrop.attr(attrs)
  }

// Permet de forcer le rechargement du document d'identifiant +kdoc+. La
// méthode est utilisée par le dataeditor
, resetDocument(kdoc){
    if(isUndefined(this.writerDocs)) return
    if (this.currentDoc && this.currentDoc.type == kdoc){
      this.hide()
    }
    delete this.writerDocs[kdoc]
  }

  /**
   * Actualise la visualisation du contenu Markdown dans le visualiseur
   */
, updateVisuDoc(){
    var contenu
    if (this.currentDoc.dataType.type === 'data'){
      contenu = '<div>Fichier de données. Pas de formatage particulier.</div>'
    } else {
      contenu = this.formater(this.docField.val(), {format: HTML})
    }
    this.visualizor.html(contenu)
    contenu = null
  }

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
    if(this.currentDoc && this.currentDoc.isModified()){
      if(this.a.locked){
        choix = 2 // Pour ignore les changements
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
    }
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
    var modelPath = $('#section-writer select#modeles-doc').val()
    this.currentDoc.setContents(fs.readFileSync(modelPath, 'utf8'))
    // On remet toujours le menu au début
    $('#section-writer select#modeles-doc').val('')
  }

  /**
   * Quand on change de thème
   */
, onChooseTheme(e,theme){
    theme = theme || $('#section-writer #writer-theme').val()
    this.applyTheme(theme)
    // $('#section-writer #writer-theme').val('')
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
  * Méthode appelée lorsque le contenu du document est changé
  * C'est la seule procédure qui doit pouvoir changer le `contents` du
  * document courant.
  */
, onContentsChange(){
    this.currentDoc.contents = this.docField.val()
  }

, reset(){
    this.docField.val('')
  }

  /**
   * Ouverture du FAWriter.
   *
   * Noter que ce seront les «FAEventers» qui afficheront les events
   */
, open(){
    if(this.isOpened){
      UI.sectionWriter.hide()
      this.fwindow.hide()
    } else {
      UI.sectionWriter.show()
      this.fwindow.show()
    }
  }

, onShow(){
    this.setUI() // préparer l'interface en fonction du type de document
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
      , any = this.currentDoc.dtype == 'any'
      , rpath = any ? this.currentDoc.path.replace(new RegExp(`^${APPFOLDER}`),'.'):'DOCUMENT '
    my.menuTypeDoc[any?'hide':'show']()
    my.section.find('.header #writer-doc-title select')[any?'hide':'show']()
    my.section.find('.header #writer-doc-title label').html(rpath)
    my.section.find('.header .div-modeles')[any?'hide':'show']()
    my.section.find('.header .writer-btn-drop')[any?'hide':'show']()
    my.section.find('.header #writer-btn-new-doc')[any?'hide':'show']()

    // On règle la taille pour que ça prenne tout la hauteur
    this.fwindow.jqObj.outerHeight( H - 10 )
  }

, beforeHide(){
  if(isFalse(this.checkCurrentDocModified())) return false
  return true
}
, hide(){
    this.fwindow.hide()
  }

, onHide(){
    this.stopTimers()
    this.isOpened = false
    delete this.currentDoc
    this.setAutoVisualize()
    this.visualizor.hide() // au cas où
  }

  /**
   * Sauvegarde du document courant
   */
, saveCurrentDoc(){ this.currentDoc.save() }

// Arrêter les timers s'il y en a (appelée à la fermeture)
, stopTimers(){
    this.stopTimerAutoSave()
    this.stopTimerAutoVisu()
  }
, stopTimerAutoSave(){
    if (this.autoSaveTimer){
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  }
, stopTimerAutoVisu(){
    if (this.autoVisuTimer){
      clearInterval(this.autoVisuTimer)
      this.autoVisuTimer = null
    }
  }
  /**
   * Méthode d'autosauvegarde du document courant
   */
, autoSaveCurrent(){
    this.currentDoc.getContents()
    this.currentDoc.isModified() && this.currentDoc.save()
  }

  /**
   * Pour définir l'autosauvegarde
   */
   // TODO voir pourquoi ça n'est pas simple…
   // Est-ce à cause du draggable ???
, setAutoSave(e){
    this.autoSave = DGet('cb-save-auto-doc').checked
    if(this.autoSave){
      this.autoSaveTimer = setInterval(this.autoSaveCurrent.bind(this), 2000)
    } else {
      this.stopTimerAutoSave()
    }
    $('#btn-save-doc').css('opacity',this.autoSave ? '0.3' : '1')
  }

, setAutoVisualize(e){
    this.visualizeDoc = DGet('cb-auto-visualize').checked
    if (this.visualizeDoc){
      this.autoVisuTimer = setInterval(this.updateVisuDoc.bind(this), 5000)
      this.positionneWriter()
      this.updateVisuDoc() // on commence tout de suite
    } else {
      this.stopTimerAutoVisu()
    }
    this.visualizor[this.visualizeDoc?STRshow:STRhide]()
  }

/**
  S'assure que le writer ne se trouve pas sur le visualiseur
**/
, positionneWriter(){
    // console.log("this.jqObj.position().left:", this.jqObj.position().left)
    // console.log("this.jqObj.position().left:", this.jqObj.position().left)
    if(this.jqObj.position().left < (this.visualizor.position().left + this.visualizor.outerWidth())){
      this.jqObj.animate({left:(this.visualizor.position().left + this.visualizor.outerWidth() + 40) + 'px'})
    }
  }

, setModified(mod){
    if (this.autoSave) return
    this.jqObj[mod?'addClass':'removeClass'](STRmodified)
  }

/**
   Pour afficher un message propre au writer
 */
, message(msg){ this.spanMessage.html(msg || '') }

/**
* Méthode permettant de boucler sur tous les documents User (donc les
* document propres à l'analyse courante)
**/
, forEachUserDocument(method){
    this.customDocuments.forEach(wdoc => method(wdoc))
}

}
Object.defineProperties(FAWriter,{
  a:{ get(){return current_analyse} }
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
, customDocuments:{
    get(){
      if(isUndefined(this._customDocuments)){
        this._customDocuments = []
        var last_id = 0
        var files = glob.sync(path.join(this.a.folderFiles, '**', 'custom-*.md'))
        for(var file of files){
          var doc_id = parseInt(path.basename(file,path.extname(file)).split('-')[1],10)
          this._customDocuments.push(new FADocument('custom', doc_id))
          if(doc_id > last_id) last_id = 0 + doc_id
        }
        // On renseigne le dernier identifiant utilisé
        FADocument.lastID = last_id
      }
      return this._customDocuments
    }
  }
, jqObj: {get(){return this.fwindow.jqObj}}
, section: {get(){return $('#section-writer')}}
, menuTypeDoc:{
    get(){return $('#section-writer .header select#document-type')}
  }
, body:{ get(){return $('#section-writer .body')} }
, docField:{ get(){return $('#section-writer .body textarea#document-contents')} }
, btnSave: {get(){return this.section.find('.footer button#btn-save-doc')}}
, btnDrop: {get(){return this.section.find('.header .writer-btn-drop')}}
, menuThemes: {get(){return this.section.find('#writer-theme')}}
, menuModeles:{ get(){return $('#section-writer select#modeles-doc')} }
, visualizor:{ get(){return $('#writer-doc-visualizor')} }
, header:{ get(){return $('#section-writer .header')} }
, footer:{ get(){return $('#section-writer .footer')} }

})
