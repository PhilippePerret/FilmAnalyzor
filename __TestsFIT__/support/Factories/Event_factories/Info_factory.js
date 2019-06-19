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
  super(data)
}

}
