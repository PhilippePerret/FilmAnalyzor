'use strict'

Object.defineProperties(DataField.prototype,{
/**
  Retourne le div qui doit être inscrit dans le formulaire pour
  la propriété donnée. Voir la méthode defineFormDiv pour sa construction
**/
  formDiv:{get(){return this._formdiv||defP(this,'_formdiv',this.defineFormDiv())}}
// Retourne le label formaté
, f_label:{get(){return this._f_label||defP(this,'__f_label',this.defineLabel())}}

})

Object.assign(DataField.prototype,{

/**
  Méthode appelée par la méthode `observe` générale
  Utilise lorsqu'un champ d'édition particulier doit être surveillé
  Pour le moment, elle est utile lorsque le select a des valeurs définies par
  une méthode (qui permet donc d'actualiser les valeurs)
**/
  observeIfNecessary(){
    if(this.isSelectUpdatable){
      this.dataEditor.jqObj.find(`.update-${this.prop}-values`).on('click', this.updateSelectValues.bind(this))
      this.dataEditor.jqObj.find(`.open-${this.prop}-values`).on('click', this.openValues.bind(this))
    }
  }

, defineFormDiv(){
    var divs = [], extras
    divs.push(DCreate('LABEL', {inner:this.f_label, class:this.type}))
    divs.push(DCreate(this.tagName, this.tagAttributes))
    if(extras = this.extraFiedls()) divs.push(...extras)
    return DCreate('DIV', {class:'div-form', append:divs})
  }

/**
  Champs supplémentaires qui peuvent être ajoutés
  @return Array des champs à ajouter, ou undefined si aucun
 */
, extraFiedls(){
    if(this.isSelectUpdatable){
      return [
        DCreate('IMG', {class:`update update-${this.prop}-values`, src:'img/update-2.png'})
      , DCreate('IMG', {class:`open open-${this.prop}-values`, src:'img/btn-edit.png'})
      ]
    }
    return
  }
/**
  Définir le label
**/
, defineLabel(){
    var lab = `${this.label}`
    if(this.aide) lab += ` <span class="tiny">(${this.aide})</span>`
    if(this.isRequired) lab += ' <span class="warning">*</span>'
    return lab
  }
})
