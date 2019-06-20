'use strict'
/**
  Factory pour gérer les documents dans les tests
**/

global.FITDocument = class {
constructor(analyse, data){
  this.a = this.analyse = analyse
  this.data = data || this.c.defaultValues
  if ( this.data.filename && !this.data.filename.endsWith('.md') ){
    this.data.filename += '.md'
  }
}
// Construction proprement dite du document
build(){
  fs.writeFileSync(this.path, this.fullContents)
}

// Le contenu intégral du document
get fullContents(){
  return `# ${this.titre}\n\n${this.contents}`
}
get titre(){
  return this.data.titre || this.c.getATitre()
}
get contents(){
  return this.data.contents || this.c.getAContents()
}
get filename(){
  return this.data.filename || this.c.getAFilename()
}
get path(){
  if (undefined === this._path) this._path = path.join(this.a.filesFolderPath,this.filename)
  return this._path
}
get c(){return this.constructor}

// ---------------------------------------------------------------------
// CLASSE FITDocument

// Pour créer un document
static create(analyse, data){
  let doc = new FITDocument(analyse, data)
  doc.build()
  return doc
}

static get defaultValues(){
  return {}
}
static getATitre(){
  return `Document ${Math.rand(10000)}`
}
static getAContents(){
  const fromCar = Math.rand(1000)
  return String.LoremIpsum.substring(fromCar, fromCar + Math.rand(2000))
}
static getAFilename(){
  return `custom-${this.newCustomId()}.md`
}
static newCustomId(){
  if (undefined === this.lastCustomId) this.lastCustomId = 0
  return ++ this.lastCustomId
}
}
