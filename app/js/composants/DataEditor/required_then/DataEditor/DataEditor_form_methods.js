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
      formData[dField.key] = fval
    })
    return formData
  }
/**
  Méthode qui check la validité des valeurs du formulaire

  @param {Object} formData  Les données du formulaire. Si non défini (comme
                            c'est le cas quand la méthode est appelée par le
                          bouton "Check Now!"), la méthode appelle la fonction
                          `getFormValues` pour obtenir ces valeurs.
                          ATTENTION : maintenant, les valeurs sont aussi placées
                          dans l'instance DataField elle-même.
  @param {Boolean} forcer   Si les données doivent seulement être checkée à
                            la demande (data.checkOnDemand), cette propriété
                            doit être true pour checker les données.
**/
//
, checkFormValues(formData, forcer){
    log.info(`-> DataEditor#checkFormValues(data=${JSON.stringify(formData)})`)
    if(this.data.checkOnDemand && !forcer) return
    if(undefined === formData) this.getFormValues()
    var val
      , res
      , errors = []

    this.dataFields.map(dField => errors.push(...this.checkField(dField)))
    log.info(`<- DataEditor#checkFormValues (return ${errors.length} errors)`)
    if(errors.length) return errors
    // Sinon on ne retourne rien
  }
/**
  Méthode appelée par le bouton "Check Now!" qui vérifie les données à
  la demande.
**/
, onCheckOnDemand(){
    var errors
    if(errors = this.checkFormValues(undefined, /*forcer*/true)) this.traiteErrors(errors)
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
    let errors = [], res
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

/**
  Méthode qui retourne true si le champ +field+ ne contient pas une
  valeur unique.
**/
, isNotUniq(field){
    let val   = field.fieldValue
      , prop  = field.prop
      , idx_current = this.currentItemIndex // pour ne pas le considérer

    // console.log("Index item courant :", idx_current)
    var elWithSameProp = false
    this.forEachElement(el => {
      if(el.DEditorIndex == idx_current) return
      if(el[prop] == val){
        elWithSameProp = el
        return false // pour arrêter la boucle
      }
    })
    return elWithSameProp
  }

})
