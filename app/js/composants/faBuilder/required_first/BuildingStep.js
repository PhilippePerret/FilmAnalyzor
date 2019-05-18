'use strict'

// const child_process = require('child_process')

/**
  Class BuildingStep
  ------------------
  C'est la classe qui traite les étapes (les lignes) du script d'assemblage
  défini dans `analyse_files/building_script.md`

**/
class BuildingStep {
// ---------------------------------------------------------------------
//  CLASS
static newUUID(){
  isDefined(this._lastid) || ( this._lastid = 0 )
  return `STP${`${++this._lastid}`.padStart(3,'0')}`
}
/**
  Instanciation d'une nouvelle étape

  @param  {FABuilder} builder  Instance du builder qui construit la sortie
  @param  {String}    line      La ligne de donnée complète dans building_script

**/
constructor(builder, line){
  var [t,i,c,l] = line.split(':')
  // Vérifier que la ligne soit bien formatée
  // TODO

  this.builder  = builder
  this.UUID     = this.constructor.newUUID()
  this.type     = t
  this.id       = i
  this.checked  = c == '1'
  this.title    = l

  this.realType = null
  // Ici, il faut affiner le type en fonction des données absolues
  // du script d'assemblage. Par exemple, le type 'step' d'id 'synopsis'
  // correspond en fait à un document régulier, synopsis.md, qu'il faut
  // traiter comme tel
  if(this.type === STRstep){

  } else {
    this.realType = this.type
  }
}

toString(){return this._tostring||defP(this,'_tostring',`${this.UUID} - ${this.realType} - ${this.id}`)}

init(){
  this.errors = []
  this.startTime = (new Date()).getTime()
}

/**
  Méthode principale de traitement de l'étape
**/
treate(){
  let my = this
  this.init()
  // On initie un nouveau traitement dans le reporter
  my.report(`* Traitement de l'étape "${this}"`,'subtitle')
  // On ajoute un enregistrement aux étapes traitées
  my.builder.addStep(this)

  try {
    // Traitement en fonction du type
    switch (this.realType) {
      case 'step':    this.treateAsStep()       ; break
      case 'doc':     this.treateAsCustomDoc()  ; break
      case 'reg-doc': this.treateAsRegularDoc() ; break
      case 'brin':    this.treateAsBrin()       ; break
      case 'image':   this.treateAsImage()      ; break
      default:
        throw new Error(`Je ne sais pas encore traiter une étape de type "${this.type}"`)
    }
  } catch (e) {
    // Un problème s'est produit au cours du traitement
    this.errors.push(e)
  }

  // On enregistre le code dans son fichier (en vérifiant qu'il ait bien
  // été enregistré)
  my.builder.exportBunchOfFinalCode()

  // On reporte le résultat du traitement dans le reporter
  this.makeReport()
}

/**
  Traitement d'une "vraie" étape définie
**/
treateAsStep(){
  let my = this
   ,  method = require(`./js/composants/faBuilder/builders/${this.id}.js`).bind(my.builder)
  my.builder.add2finalCode(method.call())
}

/**
  Traitement d'une image
**/
treateAsImage(){
  let my = this
}

/**
  Traitement d'un brin
**/
treateAsBrin(){
  let my = this
}

/**
  Traitement d'un document customisé
**/
treateAsCustomDoc(){
  let my = this
}

/**
  Traitement d'un document qui doit appartenir au dossier analyse_files,
  de type normal.
**/
treateAsRegularDoc(){
  let my = this

}

makeReport(){
  let my = this
  if(my.isErroned()){
    my.report(my.errors, 'error',3)
  }
  my.report(`FIN du traitement de l'étape ${this.UUID}`,null,3)
}

isErroned(){
  return isNotEmpty(this.errors)
}

// Commodités
report(msg,typ,indent){
  this.builder.report.add(msg,typ,indent)
}
log(msg, typ){this.builder.log(msg,typ)}

}// /class BuildingScriptStep
