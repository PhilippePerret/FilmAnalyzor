'use strict'

/**
  Module qui produit une nouvelle version de l'analyse
**/
const pfx = '[tool/new_version]'

var AdmZip = require('adm-zip');

module.exports = async function(){
  var my = this
  FAVersion.a = my
  let new_version = await FAVersion.askForNewVersion()
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
, async buildVersion(version){
  let my = this
    , old_version = `${this.a.version}`
    , folder_oldv = this.versionFolder(old_version)
    , folderFiles_oldv  = path.join(folder_oldv,'analyse_files')
    , zipPath = path.join(this.folder, `version-${old_version}.zip`)

  var srcPath, dstPath

  log.info(`${pfx} Création d'une nouvelle version de l'analyse courante.`)

  // On construit les dossiers au besoin
  fs.existsSync(folder_oldv) || fs.mkdirSync(folder_oldv)
  fs.existsSync(folder_oldv) || raise(`Le dossier '${folder_oldv}' devrait avoir été créé.`)
  fs.existsSync(folderFiles_oldv) || fs.mkdirSync(folderFiles_oldv)
  fs.existsSync(folderFiles_oldv) || raise(`Le dossier '${folderFiles_oldv}' devrait avoir été créé.`)

  // On doit copier tous les fichiers dans le dossier de la
  // version
  log.info(`${pfx} Copie de tous les fichiers JSON dans le dossier de la version courante`)
  // await Sys.glob(`${this.a.folder}/*.json`, (err, files) => {
  let filesTraitedCount = await glob(`${this.a.folder}/*.json`, (err, files) => {
    if(err)throw Error(err)
    for(srcPath of files){
      dstPath = path.join(folder_oldv, path.basename(srcPath))
      // console.log("Traitement du fichier : ", path.basename(srcPath), dstPath)
      fs.copyFileSync(srcPath, dstPath)
    }
  })
  filesTraitedCount = filesTraitedCount.length
  // Fichiers dans le dossier de l'ancienne version
  let count = globSync(`${folder_oldv}/*.json`).length
  count > 3 || raise(`${pfx} Les fichiers JSON auraient dû être copiés dans le dossier '${folder_oldv}'…`)
  count == filesTraitedCount || raise(`${pfx} Le nombre de fichiers JSON originaux (${filesTraitedCount}) et copiés (${count}) ne correspond pas…`)
  log.info(`${pfx} ${count} fichiers JSON copiés.`)

  log.info(`${pfx} Copie des fichiers du dossier analyse_files de l’analyse…`)
  // await Sys.glob(`${this.a.folder}/analyse_files/*.*`, (err, files) => {
  filesTraitedCount = await glob(`${this.a.folder}/analyse_files/*.*`, (err, files) => {
    if(err)throw(err)
    for(srcPath of files){
      dstPath = path.join(folderFiles_oldv, path.basename(srcPath))
      // console.log("Traitement du fichier file : ", path.basename(srcPath), dstPath)
      fs.copyFileSync(srcPath, dstPath)
    }
  })
  filesTraitedCount = filesTraitedCount.length
  count = globSync(`${folderFiles_oldv}/*.*`).length
  count > 0 || raise(`${pfx} Aucun fichier n'a été copié dans le dossier 'analyse_files'…`)
  count == filesTraitedCount || raise(`${pfx} Le nombre de fichiers d'analyse originaux (${filesTraitedCount}) et copiés (${count}) ne correspond pas…`)
  // zip.addLocalFile(dstPath)
  my.buildZipFile(folder_oldv, zipPath)
  // Enfin, on change la définition de la version courante
  my.changeVersion(version)
}
/**
  Construction du zip file et suppression du dossier
  de version original
**/
, buildZipFile(zfolder, zpath){
    log.info(`${pfx} Construction du fichier zip de la version courante.`)
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
  log.info(`${pfx} Création de la nouvelle version (${version})`)
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
    let idx_nversion = DIALOG.showMessageBoxSync(null, {
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
