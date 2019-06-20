'use strict'

global.FITEventIdee = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventIdee(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'idee'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'idee'
  })
}


}
