'use strict'
/**
  Usine pour produire des brins pour les tests
**/
global.FITBrin = class {
constructor(analyse, data){
  this.a = this.analyse = analyse
  this.pData = data || {}
}
// Retourne les données à enregistrer dans le fichier
data(){
  return {
      id:           this.id
    , title:        this.title
    , type:         this.type
    , description:  this.description
    , associates:   this.associates
  }
}

get id(){return this.pData.id || (this.pData.id = this.c.getAId())}
get type(){return this.pData.type || (this.pData.type = this.c.getAType())}
get title(){return this.pData.title || ( this.pData.title = this.c.getATitle())}
get description(){return this.pData.description || ( this.pData.description = this.c.getADescription())}
get associates(){return this.pData.associates || ( this.pData.associates = this.c.getAssociates(this.a))}

get c(){return this.constructor}
// ---------------------------------------------------------------------
//  CLASSE

// Pour créer un brin
static create(analyse, data){
  this.a = this.analyse = analyse
  let brin = new FITBrin(analyse, data)
  this.add(brin) // on l'ajoute dans le fichier de données (ou on le crée)
  return brin
}

static add(brin){
  var dataBrins = []
  if ( fs.existsSync(this.a.brinsFilePath) ) {
    dataBrins = YAML.safeLoad(readFileSync(this.a.brinsFilePath,'utf8'))
  }
  dataBrins.push(brin.data())
  fs.writeFileSync(this.a.brinsFilePath, YAML.dump(dataBrins))
}

static getAId(){
  return String.someSimpleWords(2).join('_')
}
static getAType(){
  return this.types[Math.rand(this.nombre_types)]
}
static getATitle(){
  return `Le brin ${new Date().getTime()}`
}
static getADescription(){
  let fromCar = Math.rand(2000)
  return String.LoremIpsum.substring(fromCar, fromCar + Math.rand(400))
}
/**
  Définit des associés
  L'opération est plus délicate car elle nécessite de connaitre
  les éléments de l'analyse avant de pouvoir les associer entre
  eux.
**/
static getAssociates(analyse){
  return null // rien pour le moment
}

static get types(){
  if (undefined === this._types){
    this._types = Object.keys(YAML.safeLoad(fs.readFileSync(this.tpath,'utf8')))
    this._nombre_types = this._types.length
  }
  return this._types
}
static get nombre_types(){
  if (undefined === this._nombre_types) this.types // pour forcer le chargement
  return this._nombre_types
}
static get tpath(){
  return `./app/js/data/btypes_brins.yaml`
}

}
