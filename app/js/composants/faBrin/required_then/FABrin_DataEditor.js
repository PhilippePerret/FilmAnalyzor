'use strict'

Object.assign(FABrin,{

/**
  Méthode pour sauver les données éditées par le DataEditor
**/
  DESave(){
    this.save()
    this.update()
    PorteDocuments.resetDocument(12)
  }
/**
  Méthode utilisée par DataEditor pour créer un item
**/
, DECreateItem(dbrin){
    defaultize(this, '_brins', {})
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
  Méthode utilisée par DataEditor (et lising) pour supprimer un item
**/
, DERemoveItem(dbrin){
    delete this._brins[dbrin.id]
    this.DESave()
    return true
  }

// Retourne les valeurs pour le menu 'bType'
, getBTypeValues(){
    let d = {'': "Choisir le type…"}
    Object.assign(d, YAML.safeLoad(fs.readFileSync(this.btypeFilePath,'utf8')))
    // console.log(d)
    return d
  }

// Pour ouvrir le fichier des données de btype de brin
, DEOpenDoc(type){
    switch (type) {
      case 'bType':
        PorteDocuments.editDocument(this.btypeFilePath)
        break
      default:
        console.error("Impossible de traiter le type", type)
    }
  }

})
Object.defineProperties(FABrin,{
  dataEditor:{
    get(){return this._dataeditor||defP(this,'_dataeditor',DataEditor.init(this, this.DataEditorData))}
  }

, btypeFilePath:{get(){return path.join(APPFOLDER,'app','js','data','btypes_brins.yaml')}}


/**
  Les données utiles pour l'instanciation d'un dataeditor pour l'élément
  Sa validité sera contrôlée avant l'instanciation de this.dataEditor
  Cf. le manuel développeur pour le détail.
**/
, DataEditorData:{get(){
    return {
      type: STRbrin
    , title: 'BRINS'
    , items: Object.values(this.brins)
    , titleProp: 'title'
    , associable: true
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {label:'Id', type:STRtext, prop:'id', exemple:'a-z0-9_', validities:UNIQ|REQUIRED|ASCII,
          getValueMethod:(v)=>{if(v){return v.toLowerCase()}}}
      , {label:'Titre', type:STRtext, prop:'title', validities: UNIQ|REQUIRED}
      , {label:'bType', type:STRselect, prop:'bType', values: this.getBTypeValues.bind(this)}
      , {label:'Description', type:STRtextarea, prop:'description', validities:REQUIRED}
      ]
    }
  }}
})
