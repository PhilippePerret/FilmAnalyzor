'use strict'

Object.assign(DataEditor,{
  build(){
    var divs = []
    divs.push(DCreate('DIV',{class:'header', append:[
        DCreate('BUTTON', {type:'button', class:'btn-close'})
      , DCreate('BUTTON', {type:'button', id:'btn-add', inner: '+'})
      , DCreate('BUTTON', {type:'button', id:'btn-del', inner: '–'})
      , DCreate('H3', {id:'dataeditor-main-title', inner: `Data Editor`})
      ]}))
    divs.push(DCreate('DIV',{class:'body', append:[
        DCreate('SELECT',{id:'dataeditor-menu_items'})
      , DCreate('FORM', {id: 'dataeditor-form_item'})
      ]}))
    divs.push(DCreate('DIV',{class:'footer', append:[
        DCreate('BUTTON', {id:'dataeditor-btn-save', type:'button', class:'main-btn', inner:"Enregistrer"})
      ]}))
    return divs
  }
, observe(){
    this.jqObj.find('#btn-add').on('click', this.addElement.bind(this))
    this.jqObj.find('#btn-del').on('click', this.removeElement.bind(this))
    this.jqObj.find('#menu_items').on('change', this.editElement.bind(this))
    this.saveBtn.on('click', this.saveElement.bind(this))
  }
})
