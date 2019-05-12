'use strict'

Object.assign(FAImage,{
  DESave(){
    this.save()
  }

, DEUpdateItem(dimage){
    this.images[dimage.id].dispatch(dimage)
    this.DESave()
    return this.images[dimage.id]
  }
, DERemoveItem(dimage){
    this.destroy(dimage.id)
    this.DESave()
    return true
  }
})

Object.defineProperties(FAImage,{
  dataEditor:{get(){
    return this._dataeditor||defP(this,'_dataeditor',DataEditor.init(this,this.DataEditorData))
  }}
, DataEditorData:{get(){
    return {
      type: 'image'
    , title: 'IMAGES'
    , items: Object.values(this.images)
    , titleProp: 'fname'
    , no_new_item: true // pas d'ajout possible
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {type:'image', class:'image', prop:'path'}
      , {label:'Id', type:'text', prop:'id', editable:false, validities:UNIQ|REQUIRED|ASCII}
      , {label:'Légende', type:'text', prop:'legend'}
      , {label:'Fichier', type:'text', prop:'fname', editable:false, validities:REQUIRED}
      ]
    }
  }}
})
