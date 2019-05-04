'use strict'

Object.assign(DataEditor,{
// Méthode qui place les valeurs dans le formulaire
  setFormValues(){
    var prop
    this.dataFields.map(dField => dField.set(this.currentItem[dField.prop]))
  }
// Méthode qui récupère les valeurs du formulaire
, getFormValues(){
    var prop, formData = {}
    this.dataFields.map(dField => {
      prop = dField.prop
      formData[prop] = $(`#dataeditor-item-${prop}`).val()
    })
    return formData
  }
// Mtéthode qui check la validité des valeurs du formulaire
, checkFormValues(){
    this.dataFields.map(dField => {

    })
  }
})
