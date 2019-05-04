'use strict'

Object.assign(DataEditor.prototype,{
  build(){
    let my = this
    var divs = []
      , divsForm = []

    // Les champs du formulaire
    this.dataFields.map(dfield => divsForm.push(dfield.formDiv))

    divs.push(DCreate('DIV',{class:'header', append:[
        DCreate('BUTTON', {type:'button', class:'btn-close'})
      , DCreate('BUTTON', {type:'button', class:'btn-add', id:my.idFor('btn-add'), inner: '+'})
      , DCreate('BUTTON', {type:'button', class:'btn-del', id:my.idFor('btn-del'), inner: '–'})
      , DCreate('H3', {id:my.idFor('main-title'), inner: `Data Editor`})
      ]}))
    divs.push(DCreate('DIV',{class:'body', append:[
        DCreate('SELECT',{id:my.idFor('menu_items'), class:'menu-items'})
      , DCreate('FORM', {id: my.idFor('form_item'), class: 'dataeditor-form_item', append: divsForm})
      ]}))
    divs.push(DCreate('DIV',{class:'footer', append:[
        DCreate('BUTTON', {id:my.idFor('btn-save'), type:'button', class:'btn-save small main-button', inner:"Enregistrer"})
      ]}))
    return divs
  }

, afterBuilding(){
    this.peupleItems()
  }

, idFor(suf){ return `${this.id}-${suf}`}

, observe(){
    this.jqObj.find(`#${this.id}-btn-add`).on('click', this.addElement.bind(this))
    this.jqObj.find(`#${this.id}-btn-del`).on('click', this.removeElement.bind(this))
    this.jqObj.find(`#${this.id}-menu_items`).on('change', this.editElement.bind(this))
    this.saveBtn.on('click', this.saveElement.bind(this))
  }
})
