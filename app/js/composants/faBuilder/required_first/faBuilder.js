'use strict'
/**
 * Classe FABuilder  (pour "Analyze Builder")
 * --------------
 * Pour construire l'analyse
 *
 */

class FABuilder {
// ---------------------------------------------------------------------
//  CLASSE

/**
 * Créer une nouvelle instance de builder et la retourner (pour le chainage)
 */
static createNew(){
  this.currentBuilder = new FABuilder(current_analyse)
  return this.currentBuilder
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse){
  this.analyse = analyse
}

/**
 * Pour afficher l'analyse construite
 */
show(options){
  if(undefined === options) options = {}
  if(false == this.isUpToDate || options.force_update) this.build(options, this.showReally.bind(this))
}
showReally(){
  ipc.send('display-analyse')
  ipc.send('load-url-in-pubwindow', {path: this.html_path})
}

/**
  Fonction principale construisant l'analyse

  "Construire l'analyse", pour le moment consiste à produire le document
  HTML rassemblant tous les éléments.
*/
build(options, fn_callback){
  var my = this
  if(undefined === this.buildLoopTries) this.buildLoopTries = 0
  ++this.buildLoopTries
  if(this.buildLoopTries > 10) throw('Trop de tentatives de chargement. Un composant empêche le chargement. J’interromps la procédure.')
  // Il faut d'abord s'assurer que tous les composants soient bien
  // chargés.
  delete this.timerLoading
  if(false === my.allComponantsLoaded(options, fn_callback)) return

  delete this.buildLoopTries
  my.options = options
  my.traitedFiles = {} // tous les fichiers traités
  my.rebuildBaseFiles(fn_callback)
  my.verifyCompletude()
  my.report.show()
  my.report.saveInFile()
  my = null
}

/**
  Chargement de tous les composants nécessaires

  Note : la plupart sont déjà chargés
**/
allComponantsLoaded(options, callback){
  try {
    this.a.Fonds        || raise('Chargement de la classe Fondamentales (Fonds)')
    this.a.Fonds.loaded || raise('Attente de fin de chargement des données fondamentales')
  } catch (e) {
    this.timerLoading = setTimeout(this.build.bind(this, options, callback), 50)
    console.error(e)
    return false
  }
  return true
}

/**
  Reconstruction des fichiers de base (HTML)
**/
rebuildBaseFiles(fn_callback){
  var my = this
  my.building = true
  my.log('*** Construction de l’analyse…')
  my.report.add('Début de la construction de l’analyse', 'title')
  this.destroyBaseFiles()
  this.buildChunks()
  this.exportAs('html', this.options, fn_callback)
  my.log('=== Fin de la construction de l’analyse')
  my.report.add('Fin de la construction de l’analyse', 'title')
  my.building = false
  my = null
}

/**
  Vérification de la completude de l'export de l'analyse
  On s'assure dans cette partie que tous les fichiers existants
  sont bien exportés.
**/
verifyCompletude(fn_callback){
  var my = this
  my.report.add('Vérification de la complétude', 'title')
  // Liste des fichiers non traités
  var unTreated = []
  // Liste des erreurs à afficher
  var error_list = []
  // TODO ensuite, indiquer si c'est :
  //  - parce que le fichier a été traité mais qu'on a rencontré une erreur
  //  - parce que le fichier est inexistant
  // S'assurer que tous les fichiers du dossier `analyse_files` ont
  // été traités
  glob.sync(`${this.a.folderFiles}/**/*.md`).forEach(function(file){
    // console.log(file)
    var fname  = path.basename(file)
    var affixe = path.basename(file, path.extname(file))
    if(undefined === my.traitedFiles[affixe]){
      // => un fichier non traité
      unTreated.push(fname)
      error_list.push(`NON TRAITÉ : "${fname}"`)
    } else if (my.traitedFiles[affixe].ok === false){
      unTreated.push(affixe)
      error_list.push(`ERRONÉ : "${fname}" (${my.traitedFiles[affixe].error})`)
    }
  })

  if(unTreated.length){
    error_list = '- ' + error_list.join(',<br>- ')
    my.report.add(`Cet export de l'analyse est incomplet. Les fichiers suivants n'ont pas été traités :`, 'error bold')
    my.report.add(error_list, 'error')
  } else {
    my.report.add('Tous les fichiers de l’analyse ont été traités.', 'notice')
  }
  my = false
}




destroyBaseFiles(){
  if(fs.existsSync(this.a.html_path)) fs.unlinkSync(this.a.html_path)
}

/**
  Construit tous les bouts de codes HTML qui vont servir plus tard à
  assembler le fichier HTML final.
**/
buildChunks(){
  var method = require(`./js/composants/faBuilder/builders/build-chunks.js`).bind(this)
  method(this.options)
}

// ---------------------------------------------------------------------
buildAs(format, options){
  var my = this
  my.log(`* buildAs "${format}". Options:`, options)
  if(!this.building && !this.isUpToDate) this.build()
  var method = require(`./js/composants/faBuilder/builders/as-${format}.js`).bind(this)
  method(options)
}

exportAs(format, options, fn_callback){
  var my = this
  if(!this.building && !this.isUpToDate) this.build()
  var method = require(`./js/composants/faBuilder/exporters/as-${format}.js`).bind(this)
  method(options, fn_callback)
}


/**
* Retourne true si l'analyse précédemment construite est à jour
*/
get isUpToDate(){
  var my = this
  if (!fs.existsSync(my.html_path)){
    my.log("  = Fichier MD inexistant => CREATE")
    return false
  }
  var htmlFileDate = fs.statSync(my.html_path).mtime
  var lastChangeDate = 0
  lastChangeDate = this.getLastChangeDateIn('analyse_files', lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans 'analyse_files' => UPDATE")
    return false
  }
  lastChangeDate = this.getLastChangeDateIn('exports/img', lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans 'exports/img' => UPDATE")
    return false
  }
  // Fichiers individuels
  lastChangeDate = this.getLastChangeDateIn(['events.json'], lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans les fichiers => UPDATE")
    return false
  }
  // Finalement, c'est donc up-to-date
  return true
}

// ---------------------------------------------------------------------
//  Méthodes de fichier

/**
* Méthode qui retourne la date la plus récente dans le dossier +folder+
* de l'analyse du builder courant
*/
getLastChangeDateIn(folder, lastDate){
  var my = this
  my.log('* Recherche de l’antériorité des fichiers…')
  var files, fpath, file
  if(Array.isArray(folder)){
    // <= folder est un Array
    // => Donc c'est une liste de fichiers (chemins relatifs)
    files = folder.map(fpath => path.join(this.a.folder, fpath))
  } else {
    // <= folder n'est pas un Array
    // => C'est le path d'un dossier à fouiller
    fpath = path.join(this.a.folder,folder)
    files = glob.sync(`${fpath}/**/*.*`)
  }
  for(file of files){
    var t = fs.statSync(file).mtime
    my.log(`  - Check de : ${file} (${t})`)
    if(t > lastDate) lastDate = t
  }
  return lastDate
}

// ---------------------------------------------------------------------
//  Méthodes utilitaires

/**
  Retourne le texte HTML de la description générale de l'élément
  +chapitre+, qui peut être 'fondamentales', 'pfa', etc.
  C'est un texte qui est ajouté en dessous du titre de la partie,
  du chapitre, s'il doit être exporté.
**/
generalDescriptionOf(chapitre){
  return fs.readFileSync(`./app/js/composants/faBuilder/assets/general_descriptions/${chapitre}.html`)
}

/**
 * Pour le log de la procédure
 */
log(msg, args){ this.constructor.log(msg, args) }
  static log(msg, args){
    if(undefined === this.logs) this.logs = []
    this.logs.push({msg: msg, args: args})
    if (args) console.log(msg, args)
    else console.log('%c'+msg,'color:blue;margin-left:4em;font-family:Arial;')
}

// ---------------------------------------------------------------------
//  Raccourcis

get a(){ return this.analyse }
get wholeHtmlPath(){return this._wholeHtmlPath||defP(this,'_wholeHtmlPath', path.join(this.folderChunks,'wholeHTML.html'))}
get folderChunks(){
  if(undefined === this._folderChunks){
    this._folderChunks = path.join(this.a.folderExport, '.chunks')
    if(!fs.existsSync(this._folderChunks)){
      fs.mkdirSync(this._folderChunks)
    }
  }
  return this._folderChunks
}
get md_path()   { return this.a.md_path }
get html_path() { return this.a.html_path }
get report(){return this._report||defP(this,'_report', new FAReport('analyse-building'))}

}
