'use strict'
/**


  Note : il est très compliqué de produire un test sur un test asynchrone.
  Consulter le mode d'emploi.

**/
class x_Subject extends FITSubject {
constructor(sujval){
  super('<Expectation value>')

  this.options = {}

  if ( 'string' === typeof sujval ) {
    this.options.sujet = `\`${sujval}\``
    if ( sujval.match(/\(\)$/) ) {
      this.initValue = sujval.replace(/\)$/,'{onlyReturn:true})')
    } else {
      this.initValue = sujval.replace(/\)$/,', {onlyReturn:true})')
    }
  } else if ( 'function' === typeof sujval ) {
    this.initValue = sujval
  } else {
    throw new ArgumentError("L'argument du x_Subject est invalide", sujval)
  }

  // console.log("this.sujet", this.sujet)

  // console.log("this.actualValue evalué :", this.actualValue)
  Object.assign(this.assertions,{
      fails:    this.fails.bind(this)
    , succeeds: this.succeeds.bind(this)
  })
}
async evaluateActual(){
  if ( 'string' === typeof(this.initValue)) {
    try {
      this.actualValue = eval(this.initValue)
    } catch (e) {
      console.error(e)
    }
  } else if ('function' === typeof this.initValue ) {
    this.actualValue = await this.initValue.call()
  }
}

// ---------------------------------------------------------------------
//    ASSERTIONS

async succeeds(options){
  let resultat = this.newResultat({
    verbe: 'produit', objet:'un succès', options:options
  })
  await this.evaluateActual()
  resultat.validIf(this.actualValue === true)
  return assert(resultat)
}
async fails(options){
  let resultat = this.newResultat({
    verbe: 'produit', objet:'un échec', options:options
  })
  await this.evaluateActual()
  resultat.validIf(this.actualValue === false)
  return assert(resultat)
}



}

global.x = function(value){
  return new x_Subject(value)
}
