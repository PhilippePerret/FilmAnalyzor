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
  log.info('-> FABuilder::createNew')
  this.currentBuilder = new FABuilder(current_analyse)
  log.info('<- FABuilder::createNew (return currentBuilder)')
  return this.currentBuilder
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse){
  this.analyse = this.a = analyse
}

/**
 * Pour afficher l'analyse construite
 */
show(options){
  log.info(`-> FABuilder.show(${options})`)
  if(undefined === options) options = {}
  if(false == this.isUpToDate || options.force_update) this.build(options, this.showReally.bind(this))
  log.info('<- FABuilder.show')
}

showReally(){
  log.info('-> FABuilder.showReally')
  ipc.send('display-analyse')
  ipc.send('load-url-in-pubwindow', {path: this.html_path})
  log.info('<- FABuilder.showReally')
}

/**
  Fonction principale construisant l'analyse

  "Construire l'analyse", pour le moment consiste à produire le document
  HTML rassemblant tous les éléments.
*/
build(options, fn_callback){
  log.info(`-> FABuilder.build(options:${options})`)
  var my = this

  // On s'assure que tous les composants soient bien chargés
  this.buildLoopTries = 0
  if(!this.componantsLoaded){
    return this.loadAllComponants(this.build.bind(this, options, fn_callback))
  } else {
    delete this.buildLoopTries
  }

  my.options = options
  my.traitedFiles = {} // tous les fichiers traités
  my.rebuildBaseFiles(fn_callback)
  my.verifyCompletude()
  my.report.show()
  my.report.saveInFile()
  my = null
  log.info('<- FABuilder.build')
}


/**
  Reconstruction des fichiers de base (HTML)
**/
rebuildBaseFiles(fn_callback){
  log.info('-> FABuilder.rebuildBaseFiles')
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
  log.info('<- FABuilder.rebuildBaseFiles')
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


// ---------------------------------------------------------------------
//  FONCTIONS UTILITAIRES

loadAllComponants(fn_callback){

  // Verrou pour empêcher de boucler trop sur le chargement des composants.
  ++this.buildLoopTries
  this.buildLoopTries < 10 || raise(T('too-much-tries'))

  // Les fondamentales
  if(NONE == typeof(Fondamentales)) return this.a.loadFondamentales(this.loadAllComponants.bind(this,fn_callback))

  // Pour indiquer à build que les composants sont chargés
  this.componantsLoaded = true

  // On en a fini, on peut appeler la fonction de callback
  fn_callback()

}

}
