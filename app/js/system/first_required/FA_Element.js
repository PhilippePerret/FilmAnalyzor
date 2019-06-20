'use strict'

/**
  Classe dont doit hériter tout élément de l'application, comme les
  personnages, les brins, les events, etc.

  Offre des méthodes utiles ainsi que tout ce qu'il faut pour les associations

**/
class FAElement {
// ---------------------------------------------------------------------
//  CLASSE

static reset(){
  delete this._a
  delete this._iofile
  delete this._modified
}

static get modified(){return this._modified || false}
static set modified(v){
  this._modified = v
  if(this.listing){
    this.listing.btnOK.html(v ? 'Enregistrer' : OK)
  }
}

static load(){
  log.info(`-> FAElement::load [Class ${this.name}]`)
  this.loading = true
  this.iofile.loadIfExists({after: this.afterLoad.bind(this)})
  log.info(`<- FAElement::load [Class ${this.name}]`)
}

static afterLoad(data){
  log.info(`-> FAElement::afterLoad [Class ${this.name}]`)
  this.reset()
  this.data     = data // une Array d'objet contenant les données
  this.loading  = false
  this.loaded   = true
  log.info(`<- FAElement::afterLoad [Class ${this.name}]`)
}

static save(){
  log.info(`-> FAElement::save [Class ${this.name}]`)
  // Ne rien faire si l'analyse est verrouillée
  if(this.saving || this.a.locked) return
  this.saving = true
  this.contents = this.getData() // À DÉFINIR DANS LA CLASSE HÉRITIÈRE
  this.iofile.save({after:this.afterSave.bind(this)})
  log.info(`<- FAElement::save [Class ${this.name}]`)
}
static afterSave(){
  log.info(`-> FAElement::afterSave [Class ${this.name}]`)
  this.saving = false
  this.modified = false
  isFunction(this.methodAfterSaving) && this.methodAfterSaving()
  log.info(`<- FAElement::afterSave [Class ${this.name}]`)
}

// Le type, c'est le nom de la classe, en minuscule, sans le "fa"
static get type(){return this._type || defP(this,'_type',this.defineType())}
static defineType(){
  return this.name.toLowerCase().replace(/^fa_?/,'')
}

static edit(item_id, e){
  e && stopEvent(e) // cf. note N0001
  if(NONE === typeof(DataEditor)) return this.a.loadDataEditor(this.edit.bind(this,item_id))
  DataEditor.open(this, item_id)
}

/**
  Si la classe héritière définit `tableItemKeys` avec le nom de la table
  qui contient tous les éléments (par exemple 'brins'), cette méthode peut
  retourner le nombre d'éléments.
**/
static get count(){return Object.keys(this[this.tableItemsKey]).length}

/**
  Actualisation de la liste d'éléments.
**/
static update(){
  if(isUndefined(this.tableItemsKey)){
    log.warn("Pour utiliser la méthode générique `FAElement::update`, il faut définir MaClasse::tableItemsKey (nom de la table qui contient tous les éléments).")
  } else {
    if(this.listing){
      this.listing.items = Object.values(this[this.tableItemsKey])
      this.listing.update()
    }
  }
}

static exists(){return fs.existsSync(this.path)}
static get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
static get a(){return this._a || defP(this,'_a', current_analyse)}


// ---------------------------------------------------------------------
//  INSTANCE

constructor(data){
  for(var prop in data){this[`_${prop}`] = data[prop]}
}

/**
  Méthode qui actualise automatiquement toutes les informations affichées
  du personnage après sa modification.
**/
onUpdate(){
  this.constructor.PROPS.map(prop => {
    if (!this[prop]) return
    $(this.domCP(prop)).html(this[`f_${prop}`]||this[prop])
  })
}

/**
  Dispatch les données +newdata+ dans l'instance, par les propriété `_<prop>`
**/
dispatch(newdata){
  for(var k in newdata){
    this[`_${k}`] = newdata[k]
  }
}
/**
  Retourne les données à enregistrer épurée.
  L'élément doit définir `PROPS` listant les propriétés.
  Chaque propriété peut posséder une méthode `<prop>Epured` qui sera appelée
  pour composer la donnée.
**/
dataEpured(){
  var h = {}, m
  this.constructor.PROPS.map(prop => {
    m = `${prop}Epured`
    h[prop] = (isFunction(this[m])) ? this[m]() : this[prop]
  })
  return Hash.compact(h)
}

// La class commune à toute
domC(prop){ return `${this.domClass}-${prop}` }
domCP(prop){return `.${this.domC(prop)}`}
get domClass(){return this._domId || defP(this,'_domId',`${this.type}-${this.id}`)}

get modified(){return this._modified}
set modified(v){
  this._modified = v
  this.constructor.modified = v
  if(v) this.onUpdate()
}

editLink(opts){
  return DCreate(A,{class:'lktool lkedit', inner:'edit', attrs:{onclick:`${this.constructor.name}.edit('${this.id}', event)`}}).outerHTML
}

get domReaderId(){return this._domreaderid||defP(this,'_domreaderid',`reader-${this.domId}`)}
get domReaderObj(){return this._domreaderobj||defP(this,'_domreaderobj',this.jqReaderObj?this.jqReaderObj[0]:undefined)}
get jqReaderObj(){
  if(isUndefined(this._jqreaderobj)){
    this._jqreaderobj = $(`#${this.domReaderId}`)
    isEmpty(this._jqreaderobj) && ( delete this._jqreaderobj )
  }
  return this._jqreaderobj
}

}// /class


module.exports = FAElement
