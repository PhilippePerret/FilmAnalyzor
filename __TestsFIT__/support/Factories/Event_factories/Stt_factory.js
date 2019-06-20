'use strict'

global.FITEventStt = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventStt(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'stt'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'stt'
  })
}


}
