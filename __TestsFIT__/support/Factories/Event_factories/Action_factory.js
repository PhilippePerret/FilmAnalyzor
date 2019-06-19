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
constructor(data){
  super(data)
}

}
