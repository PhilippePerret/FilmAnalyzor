'use strict'

class DataEditor {
// ---------------------------------------------------------------------
//  INSTANCE
constructor(mainClass, data){
  this.mainClass  = mainClass // FAPersonnage, FABrin, etc.
  this.data       = data
  this.items      = data.items
  this.titleProp = data.titleProp
}

open(){this.fwindow.toggle()}
close(){this.fwindow.toggle()}

get fwindow(){
  return this._fwindow||defP(this,'_fwindow', new FWindow(this, {id:this.id, name:`${this.mainClass.name}-DataEditor`, class:'fwindow-listing-type dataeditor', x:200, y:100}))}
}
