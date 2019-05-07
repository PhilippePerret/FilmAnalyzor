'use strict'

class DataPanel {
// CLASS
static desactivateCurrentPanel(){
  if(this.currentPanel) this.currentPanel.desactivate()
}
static get currentPanel(){ return this._currentPanel }
static set currentPanel(v){ this._currentPanel = v }

// ---------------------------------------------------------------------
// INSTANCES
constructor(dataEditor, data){
  this.dataEditor = dataEditor
  this.data       = data
}

addField(field){
  if(undefined === this._fields) this._fields = []
  this._fields.push(field)
}

// Activer ce panneau
activate(){
  this.constructor.desactivateCurrentPanel()
  this.DOMOnglet.addClass('active')
  this.DOMPanel.addClass('active')
  this.constructor.currentPanel = this
}
// Désactiver ce panneau
desactivate(){
  this.DOMOnglet.removeClass('active')
  this.DOMPanel.removeClass('active')
}

get panel(){
    return DCreate('DIV',{id: this.domId, class:'panel', append: this.fields.map(field => field.formDiv)})
  }
onglet(width){
    return DCreate('A',{id: `${this.domId}-onglet`, class:'onglet', inner: this.title, style:`width:${width};`})
  }

get id(){return this.data.id}
get domId(){return this._domid||defP(this,'_domid',`${this.dataEditor.id}-panel-${this.id}`)}
get title(){return this.data.title}
get fields(){return this._fields || []}
get dataFields(){return this.fields}// pour cohérence avec données normales

get DOMOnglet(){return $(`#${this.domId}-onglet`)}
get DOMPanel(){return $(`#${this.domId}`)}
}
