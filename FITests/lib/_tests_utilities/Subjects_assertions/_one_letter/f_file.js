'use strict'
/**
  Pour les tests sur les fichiers et dossiers
**/

class f_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(f(...)).exists(options)
  @description Produit un succès si le sujet file [f(...)](#f_subject) existe (donc si le fichier ou le dossier existe).
  @provided
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage await expect(f('mon/fichier.md')).exists()
 */
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

/*
  @method expect(f(...)).contains(expected, options)
  @description Produit un succès si le sujet file [f(...)](#f_subject) contient +expected+. Si le sujet est un fichier, il doit contenir dans son code/texte le code/texte fourni. Si le sujet est un dossier, il doit contenir le nom du fichier ou le path relatif fourni.
  @provided
    :expected {String} (pour les fichiers) Le code/texte recherché.
    :expected {String} (pour les dossier) Le nom/chemin relatif du fichier attendu.
  @usage await expect(f('mon/dossier')).contains('monFichier')
 */
async contains(expected, options){
  let resultat = this.newResultat({
      verbe:'contient', objet: `"${expected}"`
    , options:options
  })
  if (undefined === expected) {
    throw new ExpectationError("l'élément attendu doit être défini, dans contains (premier argument).")
  } else if ( 'string' !== typeof(expected) ) {
    resultat.detailFailure = "l'élément attendu doit être de type String, dans contains (premier argument)."
    resultat.validIf(!this.positive)
    return assert(resultat)
  }
  let pass
    , existe = await this.checkForExistence()
  if ( ! existe ){
    // console.log(`Le fichier ${this.path} n'existe pas.`)
    pass = false
  } else {

    if ( this.isFile ){
      let content = fs.readFileSync(this.path, 'utf8')
        , regExpected = new RegExp(RegExp.escape(expected))
      // TODO
      // Il faudrait pouvoir décider si on fait une recherche régulière ou non
      pass = content.includes(expected)
    } else if ( this.isFolder ) {
      // console.log("this.path", this.path)
      // console.log("expected au départ:", expected)
      // console.log("path.join(this.path, expected):", path.join(this.path, expected))
      var reg = new RegExp(`^${this.path}\/`)
      expected = expected.replace(reg,'')
      // console.log("expected ensuite:", expected)
      pass = fs.existsSync(path.join(this.path, expected))
    }
  }
  resultat.validIf(pass)
  return assert(resultat)
}


// /ASSERTIONS
// ---------------------------------------------------------------------

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

get isFile(){ return fs.statSync(this.path).isFile() }
get isFolder(){return fs.statSync(this.path).isDirectory() }
get path(){return this._path || this.actualValue }
get actualValue(){
  if ( undefined === this._path) {
    const ini = this.initialValue
    if ( 'string' === typeof ini ){
      this._path = path.resolve(ini)
    } else {
      this._path = null
    }
    // console.log("this._path = ", this._path)
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

/*
  @method f(path)
  @description Produit un sujet d'expectation (sous classe de `FITSubject`) qui permet d'être utilisé comme argument de `expect` et de profiter de toutes les assertions concernant les fichiers et dossiers.
  @id f_subject
  @provided
    :path {String} Chemin d'accès au fichier ou dossier, absolu ou relatif.
  @usage expect(f('mon/fichier.md')).exists() => produit un succès si le fichier existe.
 */
global.f = function(sujval){return new f_Subject(sujval) }
