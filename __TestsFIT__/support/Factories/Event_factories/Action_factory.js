'use strict'

global.FITEventAction = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventAction(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(pdata){
  data.type = 'action'
  super(pdata)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'action'
  })
}


}
