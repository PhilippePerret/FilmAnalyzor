'use strict'

class FITDomElementSubject extends FITSubject {
constructor(jqPath){
  super('FITDomElement')
  this.jqPath = this.sujet = jqPath
  this.jqObj  = $(this.jqPath)
  this.assertions = {
    exists: this.exists.bind(this)
  }
}

async exists(options){
  let resultat = this.newResultat({
    verbe: 'existe', objet:'dans le DOM', options:options
  })
  const pass = await DOM.exists(this.jqPath)
  assert(resultat.validIf(pass))
}

}


Object.assign(global,{
  FITDom(ref){return new FITDomElementSubject(ref)}
})
