'use strict'

Object.assign(DataEditor,{
// ---------------------------------------------------------------------
//  CLASSE

// Retourne un nouvel ID pour le dataEditor
 newId(){
    if(undefined === this.lastId) this.lastId = 0
    return ++ this.lastId
  }

/**
  Méthode appelée par les menus
  @param {String} dtype   Le type, par exemple dpersonnages, ou dbrins, etc.
**/
, openPerType(dtype){
    let owner = (typ => {
      switch(typ){
        case 'dpersonnages':  return FAPersonnage
        case 'dbrins':        return FABrin
        case 'fondamentales': return Fonds
      }
    })(dtype)
    owner || raise(`Le possessuer de type ${dtype} est inconnu…`)
    this.open(owner)
  }
/**
  Méthode principale appelée pour ouvrir l'éditeur de données
  @param {Class}  owner   La classe (ou object) principale. Pe FAPersonnage, FABrin
  @param {Object} data    Définition des données pour le data-éditor
**/
, open(owner, data){
    if (undefined === data) data = owner.dataEditorData
    data != undefined   || raise(T('deditor-data-required'))
    data.mainClass = owner
    if(this.isValidData(data)){
      return new DataEditor(owner, data)
    } else {
      return {open: ()=>{return false}}
    }
  }


, isValidData(data){
    try {
      data.title          || raise(T('deditor-title-required'))
      data.mainClass      || raise(T('deditor-mainclass-required')) // p.e. FAPersonnage, ou FABrin
      let className = data.mainClass.name
      data.items          || raise(T('deditor-items-required'))
      data.titleProp      || raise(T('deditor-titleProp-required'))
      Array.isArray(data.items) || raise(T('deditor-items-is-array'))
      data.type           || raise(T('deditor-type-required', {classe:className}))
      data.dataFields     || raise(T('deditor-fields-undefined', {classe:className}))
      // Méthodes que doit connaitre la classe principale
      var arr_fns = ['DESave', 'DECreateItem', 'DEUpdateItem', 'DERemoveItem']
      arr_fns.map( fn => {
        'function' === typeof(data.mainClass[fn]) || raise(T('deditor-function-required', {classe:className, function: fn}))
      })

    } catch (e) {
      return F.error(`DataEditor IMPLEMENTATION ERROR\n\n${e}\n\n(s'inspirer du fichier «FAPersonnage_DataEditor.js»)`)
    }
    return true
  }
})
