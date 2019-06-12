'use strict'

Object.assign(DataEditor.prototype,{
  /**
    Si le data-editor fonctionne par panneau à onglets, il faut recomposer
    une vraie donnée.
    Par exemple, quand l'identifiant du champ sera `...fd1-perso_id`, où
    `fd1` est l'identifiant du panneau, la table formData devra posséder
    une clé `fd1` qui sera un object définissant 'perso_id'
  **/
  redimFormData(formData){
    if ( not(this.hasPanels) ) return formData

    var h = {}, val
    this.dataPanels.map(dpanel => {
      h[dpanel.id] = {}
      dpanel.dataFields.map(dfield => {
        val = formData[`${dpanel.id}-${dfield.prop}`]
        // On ne tient pas compte des valeurs vides
        isNullish(val) || ( h[dpanel.id][dfield.prop] = val )
      })
    })
    return h
  }

, isCurrentWindow(){
    // console.log("this.fwindow.isCurrent()", this.fwindow.isCurrent())
    return this.fwindow.isCurrent()
  }
, isNotCurrentWindow(){
    return isFalse(this.isCurrentWindow())
  }
})

Object.defineProperties(DataEditor.prototype,{

  // --- DOM ---
  id:{get(){return this._id||defP(this,'_id',`dataeditor-${this.constructor.newId()}`)}}
, form:{get(){return this.jqObj.find(`form#${this.idFor('form_itme')}`)}}
, saveBtn:{get(){return this.jqObj.find(`button#${this.idFor('btn-save')}`)}}
, cbCloseAfterSave:{get(){return this._cbcloseafter ||
    defP(this,'_cbcloseafter',$(`input#${this.idFor('btn-close-after-save')}`)[0])}}
, checkBtn:{get(){return this.jqObj.find(`button#${this.idFor('btn-check')}`)}}
, menuItems:{get(){return this.jqObj.find(`select#${this.idFor('menu_items')}`)}}
, jqObj:{get(){return this.fwindow.jqObj}}

, hasPanels:{get(){return !!this.dataPanels}}
// --- RACCOURCIS ---
})
