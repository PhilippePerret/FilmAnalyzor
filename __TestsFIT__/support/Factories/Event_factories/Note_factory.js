'use strict'

global.FITEventNote = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventNote(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'note'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'note'
  })
}


}
