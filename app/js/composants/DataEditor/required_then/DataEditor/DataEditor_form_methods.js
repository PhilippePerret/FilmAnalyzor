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
      // On met la valeur dans l'instance, pour ne pas avoir à trimbaler
      // la table formData
      dField.formValue = fval
      formData[prop] = fval
    })
    return formData
  }
// Méthode qui check la validité des valeurs du formulaire
, checkFormValues(formData){
    log.info(`-> DataEditor#checkFormValues(data=${JSON.stringify(formData)})`)
    var val
      , res
      , errors = []
    // if(this.dataPanels){
    //   // Par formulaire à panneaux
    //   this.dataPanels.map(dPanel => errors.push(...this.checkPanel(dPanel)))
    // } else {
    //   // Par formulaire normal
      this.dataFields.map(dField => errors.push(...this.checkField(dField)))
    // }
    log.info(`<- DataEditor#checkFormValues (return ${errors.length} errors)`)
    if(errors.length) return errors
    // Sinon on ne retourne rien
  }
/**
  Méthode qui check tous les champs d'un panneau +dPanel+

  @param {DataPanel} dPanel Instance du panneau
  @return {Array} La liste des erreurs (if any)
**/
, checkPanel(dPanel){
    var errors = []
    dPanel.dataFields.map(dField => errors.push(...this.checkField(dField)))
    return errors
  }
/**
  Méthode qui checke le champ +dField+
  @param {DataField} dField Instance du champ éditable

  @return {Array} La liste des erreurs
**/
, checkField(dField){
    log.info(`-> DataEditor#checkField`)
    let errors = []
    let val = dField.formValue
    try {
      dField.isRequired && !val && raise("est requise")
      dField.isUniq && (res = this.isNotUniq(dField)) && raise(`doit être unique (déjà possédée par « ${res.toString()} »)`)
      dField.isOnlyAscii && isNotAscii(val) && raise(`doit être composé seulement de a-z, A-Z, 0-9 et _`)
      dField.checkValueMethod && (res = dField.checkValueMethod(val)) && raise(res)
    } catch (e) {
      // console.error(e)
      errors.push({error: `Cette propriété ${e} : ${dField.prop}.`, prop: dField.prop})
    }
    return errors
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
