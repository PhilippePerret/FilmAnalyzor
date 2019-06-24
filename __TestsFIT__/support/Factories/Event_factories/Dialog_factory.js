'use strict'

global.FITEventDialog = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventDialog(data)
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
