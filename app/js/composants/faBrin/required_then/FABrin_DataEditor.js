'use strict'

Object.assign(FABrin,{

/**
  Méthode pour sauver les données éditées par le DataEditor
**/
  DESave(){
    this.saveData()
    FAWriter.resetDocument('dbrins')
  }
/**
  Méthode utilisée par DataEditor pour créer un item
**/
, DECreateItem(dbrin){
    this._brins[dbrin.id] = new FABrin(dbrin)
    this.DESave()
    return this._brins[dbrin.id]
  }

/**
  Méthode utilisée par DataEditor pour actualiser un item
**/
, DEUpdateItem(dbrin){
    this._brins[dbrin.id] = new FABrin(dbrin)
    this.DESave()
    return true
  }

/**
  Méthode utilisée par DataEditor pour supprimer un item
**/
, DERemoveItem(dbrin){
    delete this._brins[dbrin.id]
    this.DESave()
    return true
  }
})
Object.defineProperties(FABrin,{
  dataEditor:{
    get(){return this._dataeditor||defP(this,'_dataeditor',DataEditor.init(this, this.DataEditorData))}
  }
  // Le IOFile qui sert pour le DataEditor (pas quand le document est visualisé
  // dans le Writer)
// , iofile:{get(){return this._iofile||defP(this,'_iofile',new IOFile(this))}}

/**
  Les données utiles pour l'instanciation d'un dataeditor pour l'élément
  Sa validité sera contrôlée avant l'instanciation de this.dataEditor
  Cf. le manuel développeur pour le détail.
**/
, DataEditorData:{get(){
    return {
      type: 'brin'
    , title: 'BRINS'
    , items: Object.values(this.brins)
    , titleProp: 'title'
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {label:'Id', type:'text', prop:'id', exemple:'a-z0-9_', validities:UNIQ|REQUIRED|ASCII,
          getValueMethod:(v)=>{if(v){return v.toLowerCase()}}}
      , {label:'Titre', type:'text', prop:'title', validities: UNIQ|REQUIRED}
      , {label:'Type', type:'select', prop:'bType', values: {'': 'Choisir le type…', intrigue: "Intrigue", personnage: "Personnage", autre:"Autre"}}
      , {label:'Description', type:'textarea', prop:'description', validities:REQUIRED}
      ]
    }
  }}
})
