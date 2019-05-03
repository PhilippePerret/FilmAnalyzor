'use strict'

Object.defineProperties(DataEditor,{
  // --- RACCOURCIS ---
  mainClass:{get(){return this.data.mainClass}}
  // --- DOM ---
, form:{get(){return this.jqObj.find('form#dataeditor-form_item')}}
, saveBtn:{get(){return this.jqObj.find('button#dataeditor-btn-save')}}
, menuItems:{get(){return this.jqObj.find('select#dataeditor-menu_items')}}
, jqObj:{get(){return this.fwindow.jqObj}}
})
