'use strict'
/**
 * Export de l'analyse au format Markdown
 *
 * Contrairement aux autres formats d'export (exception fait de HTML), cet
 * export construit en fait l'analyse courante, à partir de tous ses éléments.
 * Le format Markdown permettra de générer les autres format
 */

const fsExtra = require('fs-extra')  // pour 'rm -Rf'
const child_process = require('child_process')

// Double retour chariot
const DRC = `

`
Object.assign(FABuilder.prototype, {

/**
  Méthode utilitaire permettant d'ajouter le contenu du document
  de clé +key_doc+
**/
convertAndAddFile(key_doc){
  var my = this
  var ca = my.analyse

  my.log(`* Traitement du fichier "${key_doc}"`)
  my.traitedFiles[key_doc] = {ok: null, error: null}

  // Le document template, dans le cas où le document original n'existerait pas
  // On l'utilise s'il est demandé par le script de construction.
  var tempPath  = ca.tempFilePathOf(key_doc)
  var anaPath   = ca.filePathOf(key_doc)
  var itexte

  if(fs.existsSync(anaPath)) {
    itexte = new FATexte(fs.readFileSync(anaPath, 'utf8'))
    itexte = itexte.formate()
  } else if (fs.existsSync(tempPath)) {
    itexte = fs.readFileSync(tempPath, 'utf8')
  } else {
    // Aucun des deux fichiers n'a été trouvé, on ne fait rien
    my.traitedFiles[key_doc].ok     = false
    my.traitedFiles[key_doc].error  = 'required but unfound'
    return
  }
  var cmd = `echo "${itexte.replace(/\"/, '\\"')}" | pandoc -t html`
  // exec(cmd, (err, itexteHTML, stderr) => {
  //   if(err)throw err
  //   my.exporter.append(my.wholeHtmlPath, itexteHTML)
  //   my.log(`= Ajout de "${key_doc}" dans le fichier wholeHTML.html`)
  // })
  var itexteHTML = child_process.execSync(cmd)
  my.exporter.append(my.wholeHtmlPath, itexteHTML)
  my.log(`= Ajout de "${key_doc}" dans le fichier wholeHTML.html`)
  my.traitedFiles[key_doc].ok = true
  itexte = null
  my = null
}
})
/**
 * Pour la construction d'éléments à construire comme les fondamentales ou
 * le paradigme de Field augmenté
 */
FABuilder.prototype.buildAndAddChunk = function(what){
  var my = this
  my.log(`* Traitement du build "${what}"`)
  my.traitedFiles[what] = {ok: null, error: null}
  var ca = my.analyse
  var finalCode = ""
  finalCode += `<!-- BUILD ${what} -->${RC}`
  switch (what.toLowerCase()) {
    case 'fiche identité':
      finalCode += my.loadAndRunBuilder('fiche_identite_film')
      break
    case 'infos film':
      finalCode += my.loadAndRunBuilder('infos_film')
      break
    case 'fondamentales':
      finalCode += my.loadAndRunBuilder('fondamentales')
      break
    case 'pfa':
      finalCode += my.loadAndRunBuilder('pfa')
      break;
    case 'brins':
      finalCode += my.loadAndRunBuilder('brins')
      break
    case 'diagramme dramatique':
    case 'diagramme qrd':
      finalCode += my.loadAndRunBuilder('diagramme_dramatique')
      break
    case 'statistiques':
      finalCode += my.loadAndRunBuilder('statistiques')
      break
    case 'scenier':
      finalCode += my.loadAndRunBuilder('scenier')
      break
    case 'test mef':
      finalCode += my.loadAndRunBuilder('test_mef')
      break
    default:

  }

  // On enregistre le code dans son fichier (en vérifiant qu'il ait bien
  // été enregistré)
  my.exporter.append(my.wholeHtmlPath, finalCode)
  my.log(`= Ajout de "${what}" dans le fichier wholeHTML.html`)
  my.traitedFiles[what].ok = true
}

/**
* Méthode qui charge le builder du +composant+ et lance
* sa construction.
* Retourne le code construit.
**/
FABuilder.prototype.loadAndRunBuilder = function(composant){
  var method = require(`../builders/${composant}`).bind(this)
  return method(FABuilder.options)
}


module.exports = function(options){
  var my = this // instance FABuilder

  this.exporter = new FAExporter(this.a)

  // Il faut détruire et reconstruire le dossier 'chunks'
  if(fs.existsSync(my.folderChunks)) fsExtra.emptyDirSync(my.folderChunks)
  else fs.mkdirSync(this.folderChunks)

  // Script d'assemblage
  // ===================
  // Existe-t-il un scénario de construction ?
  var bScriptPath = my.a.filePathOf('building_script.md')
  if(fs.existsSync(bScriptPath)){
    // On l'enregistre dans la liste des fichiers traités pour
    // le vérificateur de complétude.
    my.traitedFiles['building_script'] = {ok: true, error: null}
  } else {
    bScriptPath = my.a.tempFilePathOf('building_script.md')
  }

  var bScript = fs.readFileSync(bScriptPath, 'utf8')

  my.log("** Lecture et analyse de chaque ligne du script d'assemblage…")
  bScript.split(RC).forEach(function(line){
    if(line.trim() == '' || line.substring(0,1) == '#') return
    var dline   = line.trim().split(' ')
    if (dline.length < 2) return
    var command = dline.shift()
    var args    = dline.join(' ')
    switch (command.toUpperCase()) {
      case 'FILE':
        return my.convertAndAddFile(args.toLowerCase())
      case 'BUILD':
        return my.buildAndAddChunk(args.toLowerCase())
      default:
        console.error("Je ne connais pas la commande building script:", command.toUpperCase())
    }
  })

}
