'use strict'

global.FITEventProc = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventProc(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'proc'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'proc'
  })
}


}
