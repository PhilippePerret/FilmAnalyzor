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
  
  defineFormDiv(){
    return DCreate('DIV', {class:'div-form', append:[
        DCreate('LABEL', {inner:this.f_label, class:this.type})
      , DCreate(this.tagName, this.tagAttributes)
      ]})
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
