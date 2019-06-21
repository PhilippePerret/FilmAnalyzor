'use strict'
/**


  Note : il est très compliqué de produire un test sur un test asynchrone.
  Consulter le mode d'emploi.
  
**/
class x_Subject extends FITSubject {
constructor(value){
  super(name)
  this.sujet = `\`${value}\``

  if ( 'string' === typeof value ) {
    if ( value.match(/\(\)$/) ) {
      this.actual = value.replace(/\)$/,'{onlyReturn:true})')
    } else {
      this.actual = value.replace(/\)$/,', {onlyReturn:true})')
    }
  } else if ( 'function' === typeof value ) {
    this.actual = value
  }
  // console.log("this.actual evalué :", this.actual)
  Object.assign(this.assertions,{
      fails:    this.fails.bind(this)
    , succeeds: this.succeeds.bind(this)
  })
}
async evaluateActual(){
  if ( 'string' === typeof(this.actual)) {
    try {
      this.actual = eval(this.actual)
    } catch (e) {
      console.error(e)
    }
  } else if ('function' === typeof this.actual ) {
    this.actual = await this.actual.call()
  }
  return this.actual
}

// ---------------------------------------------------------------------
//    ASSERTIONS

async succeeds(options){
  let resultat = this.newResultat({
    verbe: 'produit', objet:'un succès', options:options
  })
  const pass = await this.evaluateActual()
  resultat.validIf(pass === true)
  return assert(resultat)
}
async fails(options){
  let resultat = this.newResultat({
    verbe: 'produit', objet:'un échec', options:options
  })
  const pass = await this.evaluateActual()
  resultat.validIf(pass === false)
  return assert(resultat)
}



}

global.x = function(value){
  return new x_Subject(value)
}
