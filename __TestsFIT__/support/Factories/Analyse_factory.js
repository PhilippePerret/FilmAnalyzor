'use strict'
/**
  Usine de test pour les analyses

  @usage  CF. le Manuel des tests de l'application, dans le dossier support.

**/
const execSync = require('child_process').execSync

global.FITAnalyse = class {

// ---------------------------------------------------------------------
//  CLASSE FITAnalyse

static create(data){
  // On calcule des données par défaut que les données transmises remplaceront
  let dataDefaut = {
      events:       1 + Math.rand(9)
    , scenes:       1 + Math.rand(4)
    , personnages:  4 + Math.rand(4)
    , brins:        1 + Math.rand(3)
    , documents:    1 + Math.rand(3)
  }
  let finalData
  if ( data !== EMPTY ){
    data = data || {}
    finalData = Object.assign({}, dataDefaut, data)
  }
  // console.log("Données finales pour construire la fixture d'analyse : ", finalData)
  let ca = new FITAnalyse(finalData)
  ca.build()
  return ca
}

static async createAndLoad(data){
  const ca = await this.create(data)
  await ca.load()
  return ca
}

static rmdir(fpath){
  execSync(`rm -rf "${path.resolve(fpath)}"`)
  if ( fs.existsSync(fpath) ) {
    console.error("Le dossier suivant n'a pas pu être détruit : ", fpath)
  }
}




// ---------------------------------------------------------------------
//  INSTANCE

constructor(data){
  this.pData = data || {}
}

get BUILDING_OPERATIONS(){return [
    'buildMainFolder'
  , 'buildDataFile'
  , 'buildEventsFile'
  , 'buildFilesFolder'
  , 'buildDocuments'
  , 'buildBrins'
  , 'buildPersonnages'
]}

/**
  Chargement de l'analyse dans l'application
  Utiliser `await ca.load()` dans le test pour attendre le chargement
**/
load(){
  return new Promise((ok,ko) => {
    FAnalyse.load(this.folder, ok)
  })
}

/**
  Construction de l'analyse de test
**/
build(){
  var operation
  try {
    for (operation of this.BUILDING_OPERATIONS) {
      this[operation]()
    }
  } catch (e) {
    console.error("Problème avec l'opération ", operation)
    console.error(e)
  }
}
// Construction du fichier de données
// Données par défaut ou par data
buildDataFile(){
  const datajson = {
      folder: this.path
    , title:  this.pData.title || path.basename(this.path,path.extname(this.path))
    , version: this.pData.version || '0.0.1'
    , locked:  (undefined === this.pData.locked)?false:this.pData.locked
    , filmStartTime:  this.pData.filmStartTime || 0
    , filmEndTime:    this.pData.filmEndTime   || null
    , videoPath:      this.pData.videoPath     || path.join(this.folder,'../Drive-10mn-light.mp4')
    , lastCurrentTime:  this.pData.lastCurrentTime || 0
    , stopPoints:       this.pData.stopPoints || []
  }
  fs.writeFileSync(this.dataFilePath, JSON.stringify(datajson))
}
// Construction du fichier des events
// Note : il faut toujours que ce fichier existe
buildEventsFile(){
  const my = this
  if ( undefined === this.pData.events ){
    this.pData.events = []
  } else if ( 'number' === typeof(this.pData.events) ) {
    var nombre = this.pData.events
    this.pData.events = []
    while ( nombre -- ) this.pData.events.push(FITEvent.create({analyse:my}).data)
  } else {
    // Les events ont été fabriqués avec des données déterminées, mais il
    // faut s'assurer que ce sont ces données qui ont été transmises et non
    // pas les instances
    this.pData.events = this.pData.events.map( de => {
      if ( undefined === de.data ) return de
      else return de.data
    })
  }
  // Dans tous les cas, il faut s'assurer que les events sont bien classés
  this.pData.events.sort((a, b) => a.time - b.time)
  // console.log("this.pData.events classés : ", this.pData.events)
  fs.writeFileSync(this.eventsFilePath, JSON.stringify(this.pData.events))
}
// Construction des documents
buildDocuments(){
  if ( undefined === this.pData.documents ) return
  if ( 'number' === typeof(this.pData.documents) ){
    var nombre = this.pData.documents
    this.pData.documents = []
    while ( nombre -- ) { this.pData.documents.push(new FITDocument(this)) }
  }
  // Ici, on doit avoir une liste de documents
  this.pData.documents.map( document => {
    if ( document instanceof(FITDocument) ) {
      document.build()
    } else {
      console.error(`${document} n'est pas une instance FITDocument.`)
    }
  })
}

buildBrins(){
  if (undefined === this.pData.brins) return
  if ( 'number' === typeof(this.pData.brins) ) {
    var nombre = this.pData.brins
    this.pData.brins = []
    while ( nombre -- ) { this.pData.brins.push(new FITBrin(this)) }
  }
  // on peut enregistrer les données brins
  let d = this.pData.brins.map( brin => brin.data() )
  fs.writeFileSync(this.brinsFilePath, YAML.dump(d))
  if ( ! fs.existsSync(this.brinsFilePath) ) {
    console.error("Le fichier brin n'a pas pu être créé avec le path ", this.brinsFilePath)
  }
}
buildPersonnages(){
  if (undefined === this.pData.personnages) return
  if ( 'number' === typeof(this.pData.personnages) ) {
    var nombre = this.pData.personnages
    this.pData.personnages = []
    while ( nombre -- ) { this.pData.personnages.push(new FITPersonnage(this)) }
  }
  // on peut enregistrer les données personnages
  let d = this.pData.personnages.map( perso => perso.data() )
  fs.writeFileSync(this.personnagesFilePath, YAML.dump(d))
  if ( ! fs.existsSync(this.personnagesFilePath) ) {
    console.error("Le fichier personnages n'a pas pu être créé avec le path ", this.personnagesFilePath)
  }
}
// Construction du dossier principal
buildMainFolder(){
  fs.existsSync(this.path) && this.constructor.rmdir(this.path)
  fs.mkdirSync(this.path)
}
// Construction du dossier des fichiers (analyse_files)
buildFilesFolder(){
  fs.mkdirSync(this.filesFolderPath)
}

// Les éléments de l'analyse
get events()      { return this.pData.events      || [] }
get brins()       { return this.pData.brins       || [] }
get personnages() { return this.pData.personnages || []}
get documents()   { return this.pData.documents   || [] }

// alias parce que je parle plus souvent de "dossier" de l'analyse que de "path"
get folder(){return this.path}
get path(){
  if (undefined === this.pData.path){
    var dossier = path.join(Tests.appPath,'analyses')
    fs.existsSync(dossier) || fs.mkdir(dossier)
    dossier = path.join(dossier,'FITests')
    fs.existsSync(dossier) || fs.mkdir(dossier)
    this.pData.path = path.join(dossier, this.pData.folder || 'myTestAnalyse')
  }
  return this.pData.path
}
get eventsFilePath()  { return path.join(this.path,'events.json')}
get dataFilePath()    { return path.join(this.path,'data.json')}
get brinsFilePath()   { return path.join(this.filesFolderPath,'dbrins.yaml')}
get personnagesFilePath()   { return path.join(this.filesFolderPath,'dpersonnages.yaml')}
get exportFolderPath(){ return path.join(this.path,'export') }
get filesFolderPath() { return path.join(this.path,'analyse_files')
}



}
