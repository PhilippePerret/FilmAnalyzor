'use strict'

Object.defineProperties(DataEditor.prototype,{

  // --- DOM ---
  id:{get(){return this._id||defP(this,'_id',`dataeditor-${this.constructor.newId()}`)}}
, form:{get(){return this.jqObj.find(`form#${this.idFor('form_itme')}`)}}
, saveBtn:{get(){return this.jqObj.find(`button#${this.idFor('btn-save')}`)}}
, menuItems:{get(){return this.jqObj.find(`select#${this.idFor('menu_items')}`)}}
, jqObj:{get(){return this.fwindow.jqObj}}

// --- RACCOURCIS ---
})
