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
  super(data)
}

}
