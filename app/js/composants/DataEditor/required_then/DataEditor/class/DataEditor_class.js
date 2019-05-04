'use strict'

Object.assign(DataEditor,{
// ---------------------------------------------------------------------
//  CLASSE

// Retourne un nouvel ID pour le dataEditor
 newId(){
    if(undefined === this.lastId) this.lastId = 0
    return ++ this.lastId
  }


, isValidData(data){
    try {
      data != undefined || raise(T('deditor-data-required'))
      data.mainClass    || raise(T('deditor-mainclass-required')) // p.e. FAPersonnage, ou FABrin
      data.items        || raise(T('deditor-items-required'))
      data.titleProp   || raise(T('deditor-titleProp-required'))
      Array.isArray(data.items) || raise(T('deditor-items-is-array'))
      // La classe principale doit définir les données des champs
      data.mainClass.dataEditor || raise(T('deditor-must-have-prop-dataEditor', {classe: data.mainClass.name}))
      'function' == typeof(data.mainClass.get) || raise(T('deditor-get-method-required', {classe: data.mainClass.name}))
      let deditor = data.mainClass.dataEditor
      deditor.type        || raise(T('deditor-type-required', {classe:data.mainClass.name})) // redondant avec mainClass ?
      deditor.dataFields  || raise(T('deditor-fields-undefined', {classe:data.mainClass.name}))
      deditor.onSave      || raise(T('deditor-onsave-required', {classe:data.mainClass.name}))
      deditor.onRemove    || raise(T('deditor-onremove-required', {classe:data.mainClass.name}))
    } catch (e) {
      return F.error(`DataEditor ERROR\n\n${e}`)
    }
    return true
  }
})
