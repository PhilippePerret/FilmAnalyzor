'use strict'
/**
  Pour les tests sur les fichiers et dossiers
**/

class f_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

async exists(options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
      verbe:'existe', object:''
    , options:options
  })
  var file_found = await this.checkForExistence()
  resultat.validIf(file_found)
  return assert(resultat)
}

/**
  Retourne true si le fichier existe, après plusieurs checks
  La méthode doit être séparée de `exists`, car elle est utilisée aussi
  par d'autres méthodes, et on ne peut pas utiliser exists avec onReturn:true
  car ça poserait problème en cas de 'not' (le not serait aussi pour l'existence
  du fichier, alors qu'il faut toujours qu'il existe ici)
**/
async checkForExistence(){
  var xtime = 16 || options.xtimes
  var file_found = false
  while ( xtime -- > 0 ){
    if ( fs.existsSync(this.path) ) return true
    await wait(250)
  }
  return false
}

async contains(expected, options){
  let resultat = this.newResultat({
      verbe:'contient', objet: `"${expected}"`
    , options:options
  })
  let pass
  let existe = await this.checkForExistence()
  if ( ! existe ){
    // console.log(`Le fichier ${this.path} n'existe pas.`)
    pass = false
  } else {
    let content = fs.readFileSync(this.path, 'utf8')
      , regExpected = new RegExp(RegExp.escape(expected))
    pass = content.includes(expected)
    // console.log("content = ", content)
    // console.log("expected = ", expected)
    // console.log("pass = ", pass)
  }
  resultat.validIf(pass)
  return assert(resultat)
}

// /ASSERTIONS
// ---------------------------------------------------------------------

constructor(sujval){
  super('f-subject')
  this.initialValue = sujval
  this.options = {}
  if ( 'string' === typeof(sujval) ) this.options.sujet = `f("${sujval}")`
  Object.assign(this.assertions,{
      exists:     this.exists.bind(this)
    , contains:   this.contains.bind(this)
  })
}
static get name(){return 'f_Subject'}

get path(){return this._path || this.actualValue }
get actualValue(){
  if ( undefined === this._path) {
    const ini = this.initialValue
    if ( 'string' !== typeof ini ){
      this._path = null
    } else {
      this._path = path.resolve(ini)
    }
  }
  return this._path
}
checkValiditySujet(){
  if (
    'string' === typeof this.initialValue
      && this.initialValue.lastIndexOf('/') > 0
      && this.initialValue.indexOf(' ') < 0
      ){
    return true
  } else {
    throw new Error('not-a-path')
  }
}

}

global.f = function(sujval){return new f_Subject(sujval) }
