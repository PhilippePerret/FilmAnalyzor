'use strict'

global.FITEventInfo = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventInfo(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'info'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'info'
  })
}


}
