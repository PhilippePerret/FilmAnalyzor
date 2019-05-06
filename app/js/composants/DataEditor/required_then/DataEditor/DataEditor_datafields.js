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
      var iField
      this.data.dataFields.map(dField => {
        if (dField.type == 'panel'){
          current_panel = new DataPanel(this, dField)
          this._datapanels.push(current_panel)
          dField.dataFields.map( subDField => {
            subDField.panel = dField.id
            iField = new DataField(this, subDField)
            current_panel.addField(iField)
            // On met aussi le champ dans DataEditor.datafields pour simplifier
            // la relève des valeurs, le check des valeurs, etc.
            this._datafields.push(iField)
          })
        } else {
          this._datafields.push(new DataField(this, dField))
        }
      })
    }
    return this._datafields
  }}
})
