'use strict'

global.FITEventDialo = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventDialo(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'dialog'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'dialog'
  })
}


}
