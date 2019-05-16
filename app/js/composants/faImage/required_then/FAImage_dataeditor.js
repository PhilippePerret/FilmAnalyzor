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
      type: STRimage
    , title: 'IMAGES'
    , items: Object.values(this.images)
    , titleProp: 'fname'
    , no_new_item: true // pas d'ajout possible
    /**
      Définition des champs d'édition d'un élément
    **/
    , dataFields: [
        {type:STRimage, class:STRimage, prop:'path'}
      , {label:'Id', type:STRtext, prop:'id', editable:false, validities:UNIQ|REQUIRED|ASCII}
      , {label:'Légende', type:STRtext, prop:'legend'}
      , {label:'Taille', type:STRtext, class:STRshort, prop:'size', after:'nombre pixels ou "20%"'}
      , {label:'Position',type:STRselect,prop:'position', values:FAImage.positionsValues}
      , {label:'Fichier', type:STRtext, prop:'fname', editable:false, validities:REQUIRED}
      ]
    }
  }}
})
