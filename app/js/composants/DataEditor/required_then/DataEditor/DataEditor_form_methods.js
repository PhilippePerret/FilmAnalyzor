'use strict'

Object.assign(DataEditor.prototype,{
// Méthode qui réinitialise le formulaire (pour un nouvel élément)
  resetFormValues(){
    this.dataFields.map(dField => dField.reset())
  }
// Méthode qui place les valeurs dans le formulaire
, setFormValues(){
    var prop, fval
    this.dataFields.map(dField => {
      fval = this.currentItem[dField.prop]
      if(dField.setValueMethod) fval = dField.setValueMethod(fval)
      dField.set(fval)}
    )
  }
// Méthode qui récupère les valeurs du formulaire
, getFormValues(){
    var prop, formData = {}, fval
    this.dataFields.map(dField => {
      prop = dField.prop
      fval = dField.fieldValue
      dField.field.hasClass('error') && dField.field.removeClass('error')
      if(dField.getValueMethod) fval = dField.getValueMethod(fval)
      formData[prop] = fval
    })
    return formData
  }
// Mtéthode qui check la validité des valeurs du formulaire
, checkFormValues(formData){
    var val
      , res
      , errors = []
    this.dataFields.map(dField => {
      val = formData[dField.prop]
      try {
        dField.isRequired && !val && raise("est requise")
        dField.isUniq && (res = this.isNotUniq(dField)) && raise(`doit être unique (déjà possédée par « ${res.toString()} »)`)
        dField.isOnlyAscii && isNotAscii(val) && raise(`doit être composé seulement de a-z, A-Z, 0-9 et _`)
        dField.checkValueMethod && (res = dField.checkValueMethod(val)) && raise(res)
      } catch (e) {
        // console.error(e)
        errors.push({error: `Cette propriété ${e} : ${dField.prop}.`, prop: dField.prop})
      }
    })
    if(errors.length) return errors
    // Sinon on ne retourne rien
  }

, onKeyDownOnTextFields(e){
    if(e.metaKey){
      if(e.keyCode === KRETURN){
        this.saveElement()
        return stopEvent(e)
      }
    }
    return true
  }
})
