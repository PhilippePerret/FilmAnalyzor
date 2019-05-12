'use strict'

const {
  ASSOCIATES_COMMON_METHODS
, ASSOCIATES_COMMON_PROPERTIES
, DATA_ASSOCIATES_DRAGGABLE
, DATA_ASSOCIATES_DROPPABLE
, TEXTFIELD_ASSOCIATES_METHS
, TEXTFIELD_ASSOCIATES_PROPS
} = require('./js/system/first_required/FA_associates.js')

/**
  Classe dont doit hériter tout élément de l'application, comme les
  personnages, les brins, les events, etc.

  Offre des méthodes utiles ainsi que tout ce qu'il faut pour les associations

**/
class FAElement {
// ---------------------------------------------------------------------
//  CLASSE
static get modified(){return this._modified || false}
static set modified(v){this._modified = v}

static save(){
  log.info("-> FAElement::save")
  // Ne rien faire si l'analyse est verrouillée
  if(this.saving || this.a.locked) return
  this.saving = true
  this.contents = this.getData() // À DÉFINIR DANS LA CLASSE HÉRITIÈRE
  this.iofile.save({after:this.afterSave.bind(this)})
  log.info("<- FAElement::save")
}
static afterSave(){
  log.info("-> FAElement::afterSave")
  this.saving = false
  if('function' === this.methodAfterSaving){
    this.methodAfterSaving()
  }
  log.info("<- FAElement::afterSave")
}

// Le type, c'est le nom de la classe, en minuscule, sans le "fa"
static get type(){return this._type || defP(this,'_type',this.defineType())}
static defineType(){
  return this.name.toLowerCase().replace(/^fa_?/,'')
}

static edit(item_id, e){
  if(e) stopEvent(e) // cf. note N0001
  if(NONE === typeof(DataEditor)) return this.a.loadDataEditor(this.edit.bind(this,item_id))
  DataEditor.open(this, item_id)
}


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
    h[prop] = ('function' === typeof(this[m])) ? this[m]() : this[prop]
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

get domReaderId(){return this._domreaderid||defP(this,'_domreaderid',`reader-${this.domId}`)}
get domReaderObj(){return this._domreaderobj||defP(this,'_domreaderobj',this.jqReaderObj?this.jqReaderObj[0]:undefined)}
get jqReaderObj(){
  if(undefined === this._jqreaderobj){
    this._jqreaderobj = $(`#${this.domReaderId}`)
    if(this._jqreaderobj.length == 0) delete this._jqreaderobj
  }
  return this._jqreaderobj
}

}// /class

Object.assign(FAElement.prototype, ASSOCIATES_COMMON_METHODS)
Object.defineProperties(FAElement.prototype, ASSOCIATES_COMMON_PROPERTIES)
Object.assign(FAElement.prototype, TEXTFIELD_ASSOCIATES_METHS)
Object.defineProperties(FAElement.prototype, TEXTFIELD_ASSOCIATES_PROPS)
