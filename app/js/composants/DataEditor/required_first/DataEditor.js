'use strict'

class DataEditor {
// ---------------------------------------------------------------------
//  CLASSE

/**
  Méthode principale permettant d'éditer un ou des éléments de l'analyse
  @param {Object} data  Toutes les données dont a besoin l'éditeur
    :mainClass    La class principal, par exemple FAPersonnage ou FABrin
    :items        Les éléments à afficher dans le menu des éléments
    :title_prop   La propriété qui définit ce qui doit servir de titre dans
                  l'élément (pour l'afficher dans le menu)
    :id_current   [optionnel] ID de l'élément à éditer.
**/
static edit(data){
  if(!this.isValidData(data)) return
  this.data = data
  // Les données sont valides, on peut éditer l'élément courant

  this.toggle()
  // On prépare la fenêtre (notamment en construisant le formulaire et en
  // mettant les éléments dans le menu des items)
  let form = new DataEditor(data)
  form.init()

  // On met en édition l'élément courant si data.id_current est défini
  if(data.id_current){

  }
}

static isValidData(data){
  try {
    data != undefined || raise(T('deditor-data-required'))
    data.mainClass    || raise(T('deditor-mainclass-required')) // p.e. FAPersonnage, ou FABrin
    data.items        || raise(T('deditor-items-required'))
    data.title_prop   || raise(T('deditor-title_prop-required'))
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
    F.notify(`DataEditor ERROR\n\n${e}`, {error:true})
    return false
  }
  return true
}

// Méthode permettant d'ouvrir/fermer la fenêtre d'édition
static toggle(){this.fwindow.toggle()}

static get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{id:'dataeditor', class:'fwindow-listing-type', x:200, y:100}))}
// ---------------------------------------------------------------------
//  INSTANCE
constructor(data){
  this.data       = data
  this.mainClass  = data.mainClass
  this.items      = data.items
  this.title_prop = data.title_prop
}
}
