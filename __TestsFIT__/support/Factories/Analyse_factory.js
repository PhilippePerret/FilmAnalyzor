'use strict'
/**
  Usine de test pour les analyses

  @usage

    const ca = new FITAnalyse({<data>})
    ca.build() // construit l'analyse avec les données fournies
**/
global.FITAnalyse = class {
  constructor(data){
    this.data = data || {}
  }

get BUILDING_OPERATIONS(){return [
    'buildMainFolder'
  , 'buildDataFile'
  , 'buildEventsFile'
  , 'buildFilesFolder'
]}

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
    , title:  this.data.title || path.basename(this.path,path.extname(this.path))
    , version: this.data.version || '0.0.1'
    , locked:  (undefined === this.data.locked)?false:this.data.locked
    , filmStartTime:  this.data.filmStartTime || 0
    , filmEndTime:    this.data.filmEndTime   || null
    , videoPath:      this.data.videoPath     || '../Drive-10mn-light.mp4'
    , lastCurrentTime:  this.data.lastCurrentTime || 0
    , stopPoints:       this.data.stopPoints || []
  }
  fs.writeFileSync(this.dataFilePath, JSON.stringify(datajson))
}
// Construction du fichier des events
buildEventsFile(){
  if ( undefined === this.data.events || this.data.events.length == 0 ) return
  // TODO Plus tard, on pourrait faire des vérifications
  fs.writeFileSync(this.eventsFilePath, JSON.stringify(this.data.events))
}
// Construction du dossier principal
buildMainFolder(){
  fs.existsSync(this.path) && fs.rmdirSync(this.path)
  fs.mkdirSync(this.path)
}
// Construction du dossier des fichiers (analyse_files)
buildFilesFolder(){
  fs.mkdirSync(this.filesFolderPath)
}

get path(){
  if (undefined === this.data.path){
    var dossier = path.join(Tests.appPath,'analyses')
    fs.existsSync(dossier) || fs.mkdir(dossier)
    dossier = path.join(dossier,'FITests')
    fs.existsSync(dossier) || fs.mkdir(dossier)
    this.data.path = path.join(dossier,'myTestAnalyse')
  }
  return this.data.path
}
get eventsFilePath(){return path.join(this.path,'events.json')}
get dataFilePath(){return path.join(this.path,'data.json')}
get exportFolderPath(){ return path.join(this.path,'export') }
get filesFolderPath(){
  return path.join(this.path,'analyse_files')
}
}
