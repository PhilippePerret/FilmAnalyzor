'use strict'
/**
 * Class FADocument
 * ---------------
 * Classe pour gérer les documents
 *
 *
 */

class FADocument {
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
  PorteDocuments.makeCurrent(newDoc.id)
  newDoc.setContents('# Titre du nouveau document'+RC+RC)
  PorteDocuments.message(T('new-custom-document-created'))
}

/**
  For consistency with others elements
**/
static edit(doc_id){
  if ( isUndefined(doc_id) ) this.new()
  else this.get(doc_id).display()
}

/**
  Utile pour le listing (pour sauver les associations)
  Note : ce n'est pas la méthode utilisé par le fawriter
**/
static save(doc_id){

}
/**
  Utile pour le listing (pour détruire un document)
**/
static destroy(doc_id){
  confirm({
      message: `Confirmez-vous la destruction définitive du document ${doc_id} ?`
    , buttons:['Renoncer', 'Détruire le document']
    , defaultButtonIndex:0
    , methodOnOK: this.execDestroy.bind(this, doc_id)
  })
}
static execDestroy(doc_id){

}

static newId(){
  this.lastID = this.lastID || 0
  return ++ this.lastID
}

/**
 Méthode retournant l'instance WriterDoc du document d'identifiant
 +doc_id+ qui peut-être soit l'identifiant (string) d'un document
 normalisé (introduction, annexe, etc.) soit l'identifiant (number)
 d'un document personnalisé.
**/
static get(doc_id){
  defaultize(this,'documents', {})
  if( isUndefined(this.documents[doc_id])){
    let [dtype, realid] = doc_id.split('-')
    if(dtype === STRcustom) realid = parseInt(realid,10)
    else [dtype, realid] = [STRregular, doc_id]
    this.documents[doc_id] = new FADocument(dtype, realid)
  }
  return this.documents[doc_id]
}

/**
  Méthode qui cherche toutes les associations avec les documents
  Pour ce faire, elle regarde dans les events et cherche
    - les associations directes (propriétés `documents`)
    - les balises {{document:<id document>}} dans les textes

  Note : pour le moment, cette méthode n'est utilisée nulle part
**/
static findAssociations(){
  var dDocuments = {}, found
  current_analyse.forEachEvent(function(ev){
    // Dans la propriété `documents`
    if(ev.documents.length){
      ev.documents.map(doc_id => {
        isDefined(dDocuments[doc_id]) || ( dDocuments[doc_id] = [] )
        dDocuments[doc_id].push(ev)
      })
      return // inutile de poursuivre
    }
    // Dans les textes
    let reg = /\{\{document\:([a-zA-Z0-9_]+)\}\}/g
    ev.forEachTextProperty(function(prop, value){
      // console.log(`Je cherche dans ${prop} de event #${ev.id} : ${value}`)
      if(!value) return
      if(value.match(/\{\{document\:/)){
        do {
          found = reg.exec(value)
          if ( isNotNull(found) ) {
            // console.log(`Trouvé dans event #${ev.id} :`, found, reg.lastIndex)
            if(isUndefined(dDocuments[found[1]])){
              dDocuments[found[1]] = []
            }
            dDocuments[found[1]].push(ev)
            return // inutile de poursuivre
          }
        } while(found)
      }
    })
  })
  return dDocuments
}

/**
  Méthode pour boucler sur tous les documents actuels
**/
static forEachDocument(fn){
  for(var doc of this.allDocuments){
    if ( isFalse(fn(doc)) ) break // pour pouvoir interrompre
  }
}

/**

  Retourne la liste de tous les documents courant,
  sous forme d'instance FADocument.

  Note : on se sert de `this.documents` qui a pu être
  défini avant (cf. la méthode `get`) et en même temps
  on la complète en passant tous les documents en revue.

**/
static get allDocuments(){
  if ( isUndefined(this._alldocuments) ) {
    var all = glob.sync(`${current_analyse.folderFiles}/*.*`)
    for(var pdoc of all){
      this.get(path.basename(pdoc,path.extname(pdoc)))
    }
    this._alldocuments = Object.values(this.documents)
    all = null
  }
  return this._alldocuments
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

  @param {String} dtype   Doc-type du document, entre :
                            'regular': un des fichiers normaux de l'analyse
                            'custom' : un fichier personnalisé pour l'analyse
                            'any' : un fichier quelconque

  @param {Number} id      Identifiant du fichier, qui correspond à son affixe.
                          Soit 'dpersonnages', soit 'custom-12'

  @param {String} docPath Le path absolu du document, lorsque c'est un document
                          de dtype 'anydoc'. Un fichier quelconque
**/
constructor(dtype, id, docPath){
  // console.log("dtype, id, docPath", dtype, id, docPath)
  isDefined(dtype) || raise("Impossible d'instancier un document sans type ou ID.")
  [STRregular,STRcustom,STRany].indexOf(dtype) > -1 || raise(`Le doc-type (dtype) "${dtype}" est inconnu.`)
  this.dtype = dtype
  if(dtype === STRany){
    isDefined(docPath) || ( docPath = id )
    docPath || raise("Il faut absolument fournir le path en troisième argument.")
    fs.existsSync(docPath) || raise(`Le path "${docPath}" est introuvable. Je ne peux pas éditer ce document.`)
    this._path  = docPath
    this.id     = docPath.replace(/[^a-z]/g,'')
  } else {
    this.id     = id
  }
}

// ---------------------------------------------------------------------
//  Méthodes publiques

toString(){return this._tostring||defP(this,'_tostring',this.defineToString())}

defineToString(){
  var t = ['Document']
  if(this._title) t.push(`« ${DFormater(this.title)} »`)
  else t.push(`#${this.id}`)
  return t.join(' ')
}

// Affiche le document
display(){
  // console.log("-> display ", this)
  PorteDocuments.reset() // pour vider le champ, notamment
  this.preparePerType() // préparer le writer en fonction du type
  if (this.exists() && !this.loaded){
    this.load(this.suiteDisplay.bind(this))
  } else {
    this.suiteDisplay()
  }
}
suiteDisplay(){
  this.displayContents()
  PorteDocuments.applyTheme.bind(PorteDocuments)(this.theme)
  this.toggleMenuModeles()
  PorteDocuments.docField.focus()
}

displayContents(){
  PorteDocuments.docField.val(this.contents)
}

// Pour afficher la taille du document dans l'interface (gadget)
displaySize(){
  $('#section-porte-documents #text-size').html(this.contents.length)
}

// ---------------------------------------------------------------------
//  Méthodes de données

get a() { return current_analyse }

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return false}
get isADocument(){return true}
get isCustomDoc(){return this.dtype === STRcustom}
get isData(){return this.dataType && this.dataType.type === STRdata}
get isAbsoluteData(){return this.dataType && this.dataType.abs === true}

set modified(v){
  PorteDocuments.setModified(v)
  this._modified = v
}
isModified(){return this._modified === true}

get contents(){return this._contents}
set contents(v){
  if (v === this._contents) return
  this._lastContents = `${this._contents}`
  this._contents = v
  this.displaySize()
  this.modified = true
  this.toggleMenuModeles()
}

retreiveLastContents(){
  this._contents  = this._lastContents
  this.modified   = false
}

// Pour charger le texte du document
load(fn_callback){
  if(isFunction(fn_callback)) this.methodOnLoading = fn_callback
  this.iofile.loadIfExists({after: this.endLoading.bind(this), format: 'raw'})
}
endLoading(code){
  this.setContents(code)
  this.loaded   = true
  this.displaySize()
  this.modified = false
  if (this.methodOnLoading){
    this.methodOnLoading()
    delete this.methodOnLoading
  }
}

// Pour sauver le document
save(){
  if(this.a.locked && !this.isAbsoluteData) return F.notify(T('analyse-locked-no-save'))
  if(this.saving) return
  this.saving = true
  this.isNewCustom = this.isCustomDoc && !this.exists()
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
  switch (this.dtype) {
    case 'snippets':      return Snippets.updateData(YAML.safeLoad(this.contents))
    case 'dpersonnages':  return FAPersonnage.reset().init()
    case 'dbrins':        return FABrin.reset().init()
    case 'custom':        return this.addToMenuIfNew()
  }
}

// Si c'est un nouveau document customisé, il faut l'ajouter
// au menu des documents
addToMenuIfNew(){
  if (this.isNewCustom){
    delete this.title // Pour forcer sa relecture
    PorteDocuments.menuTypeDoc.append(DCreate(OPTION, {value:this.id, inner:this.title}))
    PorteDocuments.menuTypeDoc.val(this.id)
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
preparePerType(){
  var my = this
  if(this.isAbsoluteData || !this.dataType) return
  // Templates à proposer
  var tempFolderPath = path.join('.','app','analyse_files', this.id)
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
  } else {
    this.maskSpanModeles()
  }
}

// Le menu des modèles ne doit être affiché que si le contenu du document
// est vide.
toggleMenuModeles(){
  if(this.isAbsoluteData) return
  var maskIt = this.contents && this.contents.length > 0
  $('#section-porte-documents .header .modeles')[maskIt?STRhide:STRshow]()
}
maskSpanModeles(){
  $('#section-porte-documents .header .modeles').hide()
}
afficheModeles(modeles){
  if(this.isAbsoluteData) return
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

// ---------------------------------------------------------------------
// Méthodes d'association
// cf. les méthodes de FAElement

// ---------------------------------------------------------------------
//  Propriétés

get theme(){return this._theme||defP(this,'_theme',this.themePerType)}
get themePerType(){
  isDefined(this.dataType) || raise(`Impossible de trouver les données du type "${this.dtype}"`)
  switch (this.dataType.type) {
    case STRdata: return 'data-theme'
    case 'real': return 'real-theme'
    default:
      return 'real-theme'
  }
}

/**
  Retourne le titre du document.

  Pour un document type (non customdoc), il peut être défini soit par la
  première ligne du fichier (si elle commence par un '# '), soit par le hname
  par défaut.
  Pour un customdoc, c'est la première ligne qui doit commencer par un #, soit
  par le début du texte (les 30 premiers caractères)

**/
get title(){ return this._title || defP(this,'_title', this.getTitle())}

getTitle(){
  log.info('-> FADocument.getTitle', this.toString())
  var tit
  if(this.exists()){
    var buf = Buffer.alloc(200)
    var fd  = fs.openSync(this.path, 'r');
    fs.readSync(fd, buf, 0, 200, 0)
    buf = buf.toString().split(RC)
    let firstLine = buf.shift()
    if (firstLine.substring(0,2).trim() == '#'){
      tit = firstLine.substring(2, firstLine.length).trim()
      this._firstContent = buf.join(RC)
    } else {
      this._firstContent = buf.unshift(firstLine).join(RC)
    }
  } else {
    log.info(`   Le fichier "${this.path}" n'existe pas. Je ne peux pas trouver le titre.`)
    this._firstContent = ''
  }
  return tit || (this.dtype === 'custom' ? `Doc #custom-${this.id}` : this.dataType.hname)
}

/**
  Retourne les à-peu-près 200 premiers caractères du texte, avec les
  retours chariots et autres liens.
**/
get firstContent(){
  isDefined(this._firstContent) || this.getTitle() // force le calcul
  return this._firstContent
}

/**
* L'instance IOFile du fichier, pour un enregistrement sécure.
**/
get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}

/**
  Les données absolues, en fonction du type
  Ces données sont définies quand le type du document est défini dans
  min.js
**/
get dataType(){
  return this._datatype||defP(this,'_datatype',this.getDataType())
}
getDataType(){
  switch (this.dtype) {
    case STRregular: return DATA_DOCUMENTS[this.id]
    case STRcustom:
    case STRany:     return DATA_DOCUMENTS[this.dtype]
    default:
      throw(`Le dtype "${this.dtype}" est inconnu…`)
  }
}

// L'extension (par défaut, 'md', sinon, définie dans DATA_DOCUMENTS)
get extension(){
  return this._extension || defP(this,'_extension', this.dataType.format || 'md')
}

// Le path du document
get path(){ return this._path||defP(this,'_path', this.definePathPerType())}

definePathPerType(){
  if(this.isAbsoluteData){
    return path.join(APPFOLDER,'app','js','data',`${this.dtype}.yaml`)
  } else if (this.isCustomDoc) {
    return path.join(this.a.folderFiles,`custom-${this.id}.${this.extension}`)
  } else {
    return path.join(this.a.folderFiles,`${this.id}.${this.extension}`)
  }
}

/**
  Pour le listing
  Retourne true si le document a des associations
**/
hasAssociates(){
  return false // pour le moment
}

}
