'use strict'

global.FITEventProcede = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventProcede(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'procede'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'procede'
  })
}


}
