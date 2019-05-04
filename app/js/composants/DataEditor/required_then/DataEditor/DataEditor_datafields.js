'use strict'

Object.assign(DataEditor.prototype,{
})

Object.defineProperties(DataEditor.prototype,{
/**
  Retourne la liste des instances {DataField}, pour la construction du formulaire
**/
  dataFields:{get(){
    if(undefined === this._datafields){
      this._datafields = this.data.dataFields.map(dField => new DataField(this, dField))
    }
    return this._datafields
  }}
})
