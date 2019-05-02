'use strict'
/**
  Module qui produit une nouvelle version de l'analyse
**/
var AdmZip = require('adm-zip');

module.exports = function(){
  var my = this
  FAVersion.a = my
  let new_version = FAVersion.askForNewVersion()
  if (!new_version || new_version == 'Annuler') return
  FAVersion.buildVersion(new_version)
}

const FAVersion = {
  class: 'FAVersion'
, type: 'object'

/**
  Méthode qui crée la version +version+

  @param {String} version   La nouvelle version voulue

**/
, buildVersion(version){
  let my = this
    , old_version = `${this.a.version}`
    , folder_oldv = this.versionFolder(old_version)
    , folderFiles_oldv  = path.join(folder_oldv,'analyse_files')
    , zipPath = path.join(this.folder, `version-${old_version}.zip`)

  var srcPath, dstPath

  // On construit les dossiers au besoin
  fs.existsSync(folder_oldv) || fs.mkdirSync(folder_oldv)
  fs.existsSync(folderFiles_oldv) || fs.mkdirSync(folderFiles_oldv)
  // On doit copier tous les fichiers dans le dossier de la
  // version
  glob(`${this.a.folder}/*.json`, (err, files) => {
    if(err)throw(err)
    for(srcPath of files){
      dstPath = path.join(folder_oldv, path.basename(srcPath))
      // console.log("Traitement du fichier : ", path.basename(srcPath), dstPath)
      fs.copyFileSync(srcPath, dstPath)
    }
  })
  glob(`${this.a.folder}/analyse_files/*.*`, (err, files) => {
    if(err)throw(err)
    for(srcPath of files){
      dstPath = path.join(folderFiles_oldv, path.basename(srcPath))
      // console.log("Traitement du fichier file : ", path.basename(srcPath), dstPath)
      fs.copyFileSync(srcPath, dstPath)
    }
    // zip.addLocalFile(dstPath)
    my.buildZipFile(folder_oldv, zipPath)
    // Enfin, on change la définition de la version courante
    my.changeVersion(version)
  })

}
/**
  Construction du zip file et suppression du dossier
  de version original
**/
, buildZipFile(zfolder, zpath){
    let zip = new AdmZip()
    zip.addLocalFolder(zfolder)
    zip.writeZip(zpath);
    // console.log("Fichier ZIP créé : ", zpath)
    exec(`rm -rf "${zfolder}"`, err => {if(err) throw(err)})
  }
/**
  Pour changer de version vraiment, si tout s'est bien passé
**/
, changeVersion(version){
  this.a.version  = version
  this.a.setTitle()
  F.notify(`Nouvelle version appliquée (${version}).`)
}
/**
  Méthode qui demande la nouvelle version.
**/
, askForNewVersion(){
    // TODO Ici on fait les nouvelles version
    let [majorV, minorV, revision] = this.a.version.split('.').map(x => Math.round(x))
    let nversions = []
    nversions.push('Annuler')
    nversions.push([majorV + 1, 0, 0].join('.'))
    nversions.push([majorV, minorV+1, 0].join('.'))
    nversions.push([majorV, minorV, revision+1].join('.'))
    let idx_nversion = DIALOG.showMessageBox(null, {
      type: 'question'
    , buttons: nversions
    , title: 'Nouvelle version de l’analyse'
    , message: `Version courante : ${this.a.version}.${RC}Nouvelle version :`
    })
    return nversions[idx_nversion]
  }

, versionFolder(version){
    return path.join(this.folder, version)
  }
, definePathFolder(){
    let p = path.join(this.a.folder,'xversions')
    fs.existsSync(p) || fs.mkdirSync(p)
    return p
  }
}
Object.defineProperties(FAVersion,{
  folder:{
    get(){return this._folder||defP(this,'_folder', this.definePathFolder())}
  }
})
