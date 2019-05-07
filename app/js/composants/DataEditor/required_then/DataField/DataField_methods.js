'use strict'

Object.assign(DataField.prototype,{

  updateSelectValues(){
    this.field.html('')
    this.optionsSelect().map(o => this.field.append(o))
    F.notify('Menu actualisé.')
  }

// Ouvre le document contenant les valeurs absolues pour ce champ
, openValues(){
    this.dataEditor.mainClass.DEOpenDoc(this.prop)
  }
})
