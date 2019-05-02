'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEproc,{

})


Object.assign(FAEproc.prototype,{
/**
  Version short de l'event

  @param {Object} options   Options de formatage
**/
asShort(options){
  var divs = []
  if(this.titre) divs.push(DCreate('SPAN',{class:'titre',inner: DFormater(this.titre)}))
  if(this.content) divs.push(DCreate('SPAN',{class:'content',inner: DFormater(this.content)}))
  return divs
}

, asFull(options){
  var divs = []
  if (undefined === options) options = {}
  divs.push(...this.asShort(options))
  if(this.setup) divs.push(DCreate('SPAN', {class:'setup', inner: DFormater(this.setup)}))
  if(this.exploit) divs.push(DCreate('SPAN', {class:'exploit', inner: DFormater(this.exploit)}))
  if(this.payoff) divs.push(DCreate('SPAN', {class:'payoff', inner: DFormater(this.payoff)}))
  return divs
}

})


Object.defineProperties(FAEproc.prototype,{
})
