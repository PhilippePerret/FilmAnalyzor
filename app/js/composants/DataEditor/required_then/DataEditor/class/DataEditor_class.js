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
  @param {String|Number} argCurrent   L'élément courant à afficher
**/
, openPerType(dtype, argCurrent){
    let [owner, current] = (typ => {
      switch(typ){
        case 'dpersonnages':      return [FAPersonnage]
        case 'dbrins':            return [FABrin]
        case 'fondamentales':     return [Fondamentales, typ]
        case 'fondamentales_alt': return [Fondamentales, typ]
        case 'infos':             return [InfosFilm, 'infos']
      }
      return [null]
    })(dtype)
    owner || raise(`Le possesseur de type ${dtype} est inconnu…`)
    this.init(owner, undefined, argCurrent||current).open()
  }
, open(classe, current){
    this.init(classe, undefined, current).open()
  }
/**
  Méthode principale appelée pour ouvrir l'éditeur de données
  @param {Class}  owner   La classe (ou object) principale. Pe FAPersonnage, FABrin
  @param {Object} data    Définition des données pour le data-éditor
  @param {String|Number} current  L'élément à mettre en argument courant.
**/
, init(owner, data, current){
    if (isUndefined(data)) data = owner.DataEditorData
    isDefined(data) || raise(T('deditor-data-required'))
    data.mainClass  = owner
    data.current    = current
    if(this.isValidData(data)){
      return new DataEditor(owner, data)
    } else {
      return {open: ()=>{return false}}
    }
  }

/**
  Méthode qui s'assure que les données transmises soient valides
  (pour l'implémentation seulement)
**/
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
        isFunction(data.mainClass[fn]) || (fn =='DECreateItem' && data.no_new_item) || raise(T('deditor-function-required', {classe:className, function: fn}))
      })

    } catch (e) {
      return F.error(`DataEditor IMPLEMENTATION ERROR\n\n${e}\n\n(s'inspirer du fichier «FAPersonnage_DataEditor.js»)`)
    }
    return true
  }
})
