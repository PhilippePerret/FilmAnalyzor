'use strict'

global.FITEventDyna = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventDyna(data)
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'dyna'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
    type: 'dyna'
  })
}


}
