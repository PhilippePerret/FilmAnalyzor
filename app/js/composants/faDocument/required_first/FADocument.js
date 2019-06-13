'use strict'
/**
 * Class FADocument
 * ---------------
 * Classe pour gérer les documents
 *
 *
 */

class FADocument extends FAElement {
// ---------------------------------------------------------------------
//  CLASSE

static reset(){
  delete this.documents
  delete this.lastID
  delete this.count
}

/**
  Création d'un nouveau document (demande)
  ------------------------------
* Cette méthode est appelée lorsque l'on clique sur le bouton "+" pour
* créer un nouveau document.
**/
static new(){
  var newDoc = new FADocument(this.newId())
  PorteDocuments.defineDocument(newDoc.id)
  PorteDocuments.editDocument(newDoc.id)
  newDoc.setContents('# Titre du nouveau document'+RC+RC)
  PorteDocuments.message(T('new-custom-document-created'))
}

/**
  Appelé par le bouton "edit" dans le listing des documents
**/
static edit(docId){
  if ( isUndefined(docId) ) this.new()
  else PorteDocuments.editDocument(docId)
}

/**
  Utile pour le listing (pour sauver les associations)
  Note : ce n'est pas la méthode utilisé par le fawriter
**/
static save(docId){/* pour les listings */ }

/**
  Utile pour le listing (pour détruire un document)
**/
static destroy(docId){
  let doc = this.get(docId)
  confirm({
      message: `Confirmez-vous la destruction définitive du document « ${doc.title} » ?`
    , buttons:['Renoncer', 'Détruire le document']
    , defaultButtonIndex:0
    , methodOnOK: this.execDestroy.bind(this, docId)
  })
}
static execDestroy(docId){
  F.notify("Je dois procéder à la destruction du document.")
}

/**
  Return a new ID for a custom document.
  For custom documents, IDs start at 50.
**/
static newId(){
  this.lastCustomID = this.lastCustomID || 50
  return ++ this.lastCustomID
}

/**
  Méthode retournant l'instance FADocument du document d'identifiant
  +docId+.

  @param {Number|String} docId   Identifiant du document.
                          de 1 à 49, un document "standard"
                          de 50 à +, un document personnalisé, propre à
                          l'analyse
                          string = nom du fichier système à éditer
**/
static get(docId){
  isDefined( PorteDocuments.documents.get(docId) ) || (
    PorteDocuments.documents.set(docId, new FADocument(docId))
  )
  return PorteDocuments.documents.get(docId)
}


/**
  Méthode qui compte le nombre de documents qui se trouvent dans le dossier
  `analyse_files` et le renvoie (utilisé pour les tests manuels)
**/
static get count(){
  return glob.sync(`${current_analyse.folderFiles}/*.*`).length
}

// ---------------------------------------------------------------------
//  INSTANCE

/**
  Instanciation du document.
  +dtype+ peut être soit le type, par exemple 'introduction', 'personnages',
          soit un nombre pour un document propre à l'analyse courante.
  +id+    Id du document propre à l'analyse, si +dtype+ vaut 'customdoc'.

  @param {Number|String}  id  Identifiant du fichier, ou le path pour un
                              document système.
                              L'identifiant peut parfois être envoyé en string
                              pour un nombre, mais il est alors transformé en
                              entier.
**/
constructor(id){
  if ( isString(id) && id.match(/^[0-9]+$/) ) id = parseInt(id,10)
  // console.log("id pour instanciation document :", id, typeof(id))
  isDefined(id) || raise(T('id-or-path-required-for-doc'))
  super({})
  this.dtype = isString(id) ? STRsystem : (id < 50 ? STRregular : STRcustom) ;
  // console.log("this.dtype = ", this.dtype)

  if ( this.dtype === STRsystem ) {
    fs.existsSync(id) || raise(T('docpath-unfound', {path:id}))
    this._path  = id
    this.id = path.basename(id, path.extname(id))
  } else {
    this.id = id
  }

  this.type = STRdocument // pour FAElement
  this.loaded = false
}

// ---------------------------------------------------------------------
//  Méthodes publiques

toString(){return this._tostring||defP(this,'_tostring',this.defineToString())}

defineToString(){
  var t = [STRDocument]
  if(this._title) t.push(`« ${DFormater(this.title)} »`)
  else t.push(`#${this.id}`)
  return t.join(' ')
}

/**
  Premier temps de l'édition du document

**/
edit(){
  // console.log("-> FADocument.edit ", this)
  PorteDocuments.reset() // pour vider le champ, notamment
  this.preparePerDocument() // préparer le porte-documents en fonction du type
  if ( this.exists() && isFalse(this.loaded) ){
    this.load(this.suiteEdit.bind(this))
  } else {
    this.suiteEdit()
  }
}
// Deuxième temps de l'affichage du document
suiteEdit(){
  // console.log("-> FADocument.suiteEdit", this)
  this.toggleMenuModeles()
  PorteDocuments.applyTheme.bind(PorteDocuments)(this.theme)
  this.displayContents()
  // console.log("<- FADocument.suiteEdit")
}

displayContents(){
  PorteDocuments.docField
    .val(this.contents)
    .focus()
}

// Pour afficher la taille du document dans l'interface (gadget)
displaySize(){
  $('#section-porte-documents #text-size').html(this.contents.length)
}

// Méthodes pratiques pour reconnaitre rapidement l'element
get isAEvent(){return false}
get isADocument(){return true}
get isRegularDoc(){return this.dtype === STRregular}
get isCustomDoc(){return this.dtype === STRcustom}
get isSystemDoc(){return this.dtype === STRsystem}
get isData(){return this.data && this.data.type === STRdata}
get isReal(){return this.data && this.data.type === STRreal}
get isAbsoluteData(){return this.data && this.data.abs === true}

set modified(v){
  PorteDocuments.setModified(v)
  this._modified = v
}
// Retourne true si le document est modifié. Mais maintenant, ça compare
// vraiment la valeur courante avec la valeur dans le champ
isModified(){
  return this.contents != PorteDocuments.docField.val()
  // return this._modified === true
}

// Remettre l'ancien contenu
retreiveLastContents(){
  this._contents  = this._lastContents
  this.modified   = false
}

// Pour charger le texte du document
load(fn_callback){
  if( isFunction(fn_callback) ) this.methodOnLoading = fn_callback
  this.iofile.loadIfExists({after: this.endLoading.bind(this), format: 'raw'})
}
endLoading(code){
  this.setContents(code)
  this.loaded   = true
  this.displaySize()
  this.modified = false
  if ( isFunction(this.methodOnLoading) ) {
    this.methodOnLoading.call()
    delete this.methodOnLoading
  }
}

// Pour sauver le document
save(){
  console.log(`Je sauve le document ${this}`)
  if(this.a.locked && isFalse(this.isAbsoluteData) && isFalse(this.isSystemDoc)){
   return F.notify(T('analyse-locked-no-save'))
  }
  if ( this.saving ) return
  this.saving = true
  this.isNewCustom = this.isCustomDoc && isFalse(this.exists())
  if (false === this.iofile.save({after: this.endSaving.bind(this)})){
    // On passe par ici lorsque la sauvegarde a rencontré une erreur
    UI.stopWait()
    this.saving = false
  }
}
endSaving(){
  UI.stopWait()
  this.afterSavingPerType()
  FAStater.update.bind(FAStater)()
  this.modified = false
  this.saving   = false
}

/**
* En fonction des types, des opérations peuvent être nécessaire.
* Par exemple, quand on change les snippets, on doit prendre en compte
* la nouvelle valeur.
**/
afterSavingPerType(){
  switch (this.dim) {
    case 'snippets':      return Snippets.updateData(YAML.safeLoad(this.contents))
    case 'dpersonnages':  return FAPersonnage.reset().init()
    case 'dbrins':        return FABrin.reset().init()
    default:
      this.isCustomDoc && this.addToMenuIfNew()
  }
}

// Si c'est un nouveau document customisé, il faut l'ajouter
// au menu des documents
addToMenuIfNew(){
  if (this.isNewCustom){
    delete this.title // Pour forcer sa relecture
    PorteDocuments.menuDocuments.append(DCreate(OPTION, {value:this.id, inner:this.title}))
    PorteDocuments.menuDocuments.val(this.id)
  }
}
/**
 * Pour définir le contenu du document, par exemple au choix d'un modèle
 */
setContents(code){
  this.contents = code
  this.loaded   = true
  this.displayContents()
  this.displaySize()
}

/**
  Pour récupérer le contenu du textearea

  TODO Réfléchir à ça :
  Normalement, si un observeur onchange est placé sur le textarea, il
  est inutile d'actualiser le contenu quand on change de document (voir où
    on le fait ici).

  @return true si le contenu a changé, false otherwise.
 */
getContents(){
  if(this.contents != PorteDocuments.docField.val()){
    this.contents = PorteDocuments.docField.val()
    return true
  } else {
    return false
  }
}

/**
 * Préparation de l'interface en fonction du type
 * Notamment, ça fait la liste des documents modèles qui peuvent être
 * utilisés
 */
preparePerDocument(){
  var my = this
  if ( this.isSystemDoc || this.isCustomDoc ) return this.maskSpanModeles()

  // Templates à proposer
  var tempFolderPath = path.join('.','app','analyse_files', `${this.dim}.${this.extension}`)
  var tempFilePath = `${tempFolderPath}.${this.extension}`
  if(fs.existsSync(tempFilePath)){
    // <= Un seul fichier
    // => On ne met dans le menu qu'un seul fichier
    my.afficheModeles([tempFilePath])
    my = null
  } else if (fs.existsSync(tempFolderPath)){
    glob(`${tempFolderPath}/**/*.${this.extension}`, (err, modeles) => {
      my.afficheModeles(modeles)
      my = null
    })
  } else this.maskSpanModeles()
}

// Le menu des modèles ne doit être affiché que si le contenu du document
// est vide.
toggleMenuModeles(){
  var maskIt = this.isSystemDoc || this.isCustomDoc || (this.contents && this.contents.length > 0)
  $('#section-porte-documents .header .modeles')[maskIt?STRhide:STRshow]()
}
maskSpanModeles(){
  $('#section-porte-documents .header .modeles').hide()
}
afficheModeles(modeles){
  if ( isUndefined(modeles) || isEmpty(modeles) ) return
  var mModeles = $('#section-porte-documents select#modeles-doc')
  var opts = []
  opts.push('<option value="">Choisir…</option>')
  for(var p of modeles){
    var n = path.basename(p, path.extname(p))
    opts.push(`<option value="${p}">${n.replace(/_/g,' ').titleize()}</option>`)
  }
  mModeles.html(opts)
}

/**
 * Retourne TRUE si le document propre à l'analyse, du type, existe.
 *
 * Note : ce document se trouve dans le dossier `analyse_files` de
 * l'analyse.
 */
exists(){ return fs.existsSync(this.path) }

}
