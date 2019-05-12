'use strict'

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

// --- RACCOURCIS ---
})
