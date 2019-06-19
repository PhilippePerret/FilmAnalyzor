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
  super(data)
}

}
