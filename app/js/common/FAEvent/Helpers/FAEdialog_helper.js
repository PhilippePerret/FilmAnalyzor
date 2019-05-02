'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEdialog,{

})


Object.assign(FAEdialog.prototype,{

// Par exemple pour le reader
asFull(options){
  var divs = []
  divs.push(DCreate('SPAN', {class:'quotes', inner: DFormater(this.quote)}))
  divs.push(...this.asShort(options))
  return divs
}

})


Object.defineProperties(FAEdialog.prototype,{
})
