'use strict'

Object.assign(DataEditor.prototype,{
})

Object.defineProperties(DataEditor.prototype,{

/**
  Retourne la liste des panneaux, si le dataeditor fonctionne par panneau
  avec onglets
**/
dataPanels:{get(){
  if(undefined===this._datapanels) this.dataFields
  return this._datapanels
}}
/**
  Retourne la liste des instances {DataField}, pour la construction du formulaire
**/
, dataFields:{get(){
    if(undefined === this._datafields){
      this._datafields = []
      this._datapanels = []
      var current_panel = null
      this.data.dataFields.map(dField => {
        if (dField.type == 'panel'){
          current_panel = new DataPanel(this, dField)
          this._datapanels.push(current_panel)
          dField.dataFields.map( subDField => {
            subDField.panel = dField.id
            current_panel.addField(new DataField(this, subDField))
            // this._datafields.push()
          })
        } else {
          this._datafields.push(new DataField(this, dField))
        }
      })
    }
    return this._datafields
  }}
})
