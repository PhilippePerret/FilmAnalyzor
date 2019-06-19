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
  super(data)
}

}
