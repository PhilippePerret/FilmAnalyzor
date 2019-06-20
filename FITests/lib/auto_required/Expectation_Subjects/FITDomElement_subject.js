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
  console.log("Je teste si cet élément existe :", this.jqPath)
  let resultat = this.newResultat({
    verbe: 'existe', objet:'dans le DOM', options:options
  })
  const pass = await DOM.exists(this.jqPath)
  resultat.validIf(pass)
  assert(resultat)
}

}


Object.assign(global,{
  FITDom(ref){return new FITDomElementSubject(ref)}
})
