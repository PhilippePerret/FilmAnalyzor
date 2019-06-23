'use strict'
/**
  Pour voir toutes les méthodes de ce fichier, utiliser :
**/
const execSync = require('child_process').execSync

/*
  @method (returned) makeFile(provided)
  @description  Crée un fichier dans le dossier `support/files` avec les données provided
  @provided
    :path {String} Le path éventuel
    :in {String} Le path optionnel du dossier dans lequel placer le fichier
    :folder {String} Alias de `in`
    :filename {String}  Le nom optionnel du fichier optionnel
    :extension {String} L'extension optionnelle du fichier
    :content {String} Le contenu optionnel du fichier
    :content_length {Number} Longueur optionnelle du contenu voulu
  @returned
    :path {String} Le chemin d'accès réel du fichier créé
    :name {String} Le nom du fichier créé
    :content {String} Le contenu placé dans le fichier.
  @usage  let dfile = await makeFile({...})
*/
if ( global.makeFile) {
  throw new Error("La propriété ou méthode `makeFile` ne doit pas être utilisée. Elle sert aux FITests.")
} else {
  global.makeFile = async function(data){
    data = data || {}
    const folderFiles = Tests.supportFilesFolder
    fs.existsSync(folderFiles) || fs.mkdirSync(folderFiles)
    if ( undefined === data.filename ) {
      data.filename = `file${Number(new Date())}${Math.rand(1000)}`
    }
    if ( data.extension ) data.filename += `.${data.extension}`

    // Dossier dans lequel mettre le fichier
    let filepath
    data.folder && ( data.in = data.folder )
    if ( data.in ) {
      if (!fs.existsSync(data.in)){
        throw new Error(`Impossible de créer le fichier dans ${data.in}. Ce dossier n'existe pas.`)
      }
      filepath = path.join(data.in, data.filename)
    } else {
      filepath = path.join(folderFiles, data.filename)
    }

    if ( undefined === data.content ) {
      var from = Math.rand(1000)
      var len  = data.content_length || Math.rand(2000)
      data.content = String.LoremIpsum.substring(from,from+len)
    }

    return new Promise( (ok,ko) => {
      fs.writeFile(filepath, data.content, (err) => {
        if ( err ) console.error(err)
        ok({path: filepath, content: data.content, name:data.filename })
      })
    })
  }
}

/*
  @method (void) removeAllFiles()
  @description Détruit tous les fichiers/dossiers du dossier `support/files`
  @usage removeAllFiles()
 */
global.removeAllFiles = function(){
  const folderFiles = Tests.supportFilesFolder
  let res = execSync(`rm -rf "${folderFiles}";mkdir "${folderFiles}"`)
}

if ( global.makeFolder ) {
  throw new Error("La propriété ou méthode `makeFolder` ne doit pas être utilisée. Elle sert aux FITests.")
} else {
  /*
    @method (returned) makeFolder(provided)
    @description Crée un dossier, dans `support/files` avec les données fournies
    @provided
      :path {String} Chemin d'accès optionnel au fichier
      :name {String}  Nom optionnel du fichier
      :in {String} Le path optionnel du dossier dans lequel placer le dossier
    @returned
      :path {String} Chemin d'accès au dossier créé.
      :name {String} Nom du dossier créé.
    @usage  let dfolder = await makeFolder({name:'Mon-dossier'})
  */
  global.makeFolder = function(data){
    data = data || {}
    const folderFiles = Tests.supportFilesFolder
    fs.existsSync(folderFiles) || fs.mkdirSync(folderFiles)
    if ( undefined === data.name ) {
      data.name = `folder${Number(new Date())}${Math.rand(1000)}`
    }
    let fpath
    if ( undefined === data.in ) {
      fpath = path.join(folderFiles, data.name)
    } else {
      if ( fs.existsSync(data.in) ) {
        fpath = path.join(data.in, data.name)
      } else {
        throw new Error(`Impossible de créer un dossier dans "${data.in}", ce dossier n'existe pas.`)
      }
    }

    return new Promise( (ok,ko) => {
      fs.mkdir(fpath, (err) => {
        if ( err ) console.error(err)
        ok({path: fpath, name: data.name})
      })
    })
  }
}
