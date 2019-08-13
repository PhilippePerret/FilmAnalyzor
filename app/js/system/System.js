'use strict'
const path      = require('path')
const fs        = require('fs')
// const glob      = require('glob')
const log       = require('electron-log')
const electron  = require('electron')
const remote    = electron.remote
const DIALOG    = remote.dialog
const ipc       = electron.ipcRenderer
const YAML      = require('js-yaml')
const exec      = require('child_process').exec


const System  = {} // pour pouvoir mettre tout de suite des trucs "dedans"
const Sys     = System

// = glob =
// --------
// Glob avec async/await (j'ai essayé promisify sans succès)
// @return les fichiers traités (même si ça ne sert à rien)
const globSync  = require('glob').sync
Object.assign(System, {
  glob(pattern, options, callback){
    const glob = require('glob')
    if ( undefined === callback && 'function' === typeof options) {
      callback = options ; options  = null }
    return new Promise((ok,ko)=>{
      glob(pattern, options, (err, files) => {
        if ( err ){ko(err);throw Error(err)}
        else {callback(err, files);ok(files)}
      })
    })
  }
})
const glob  = System.glob

let ScreenWidth, ScreenHeight

/**
 * Object System    (alias : Sys)
 * -------------
 * Permet de gérer le système courant
 */
Object.assign(System,{
  name: 'System'

/**
  |
  | Initialisation du système
  |
  |
**/
, init() {
    log.transports.console.level = 'warn'
  }
/**
  |
  | Méthodes pour requérir un module suivant son emplacement.
  |
  |
**/
, reqTool(relative){
  relative.endsWith('.js') || relative.concat('.js')
  return require(`./js/tools/${relative}`)
}

/**
* Pour charger un composant de l'application.
* Un composant :
*   - se trouve dans le dossier app/js/composants
*   - possède au minimum un dossier required_first
*   - possède au minimum un dossier required_then
*   - possède exceptionnellement un dossier required_xfinally
*
* La méthode charge tous les scripts et inscrit les feuilles de
* style dans le document.
**/
, loadComponant(compName, fn_callback){
    this.loadCSSFolder(`./app/js/composants/${compName}/css`)
    this.loadJSFolders(`./app/js/composants/${compName}`, ['required_first', 'required_then', 'required_xfinally'], fn_callback)
  }

  /**
   * Permet de charger des modules javascript dans le programme en inscrivant
   * leur balise <script> et en attendant que tout soit chargé.
   *
   * +mainFolder+   'string' du path au dossier principal dans lequel se
   *                trouvent les dossiers à charger.
   * +subFolders+   'array' des sous-dossiers
   * +fn_callback+  'function' à appeler à la fin du chargement.
   */
, loadJSFolders(mainFolder, subFolders, fn_callback){
    log.info(`-> System::loadJSFolders(mainFolder:${mainFolder}, subFolders:${JSON.stringify(subFolders)})`)
    this.folders = []
    subFolders.map(subFolder => this.folders.push(path.join(mainFolder,subFolder)))
    log.info(`   folders: ["${this.folders.join('", "')}"]`)
    this.methodAfterLoadingFolders = fn_callback
    this.loadNextFolder()
  }

, loadNextFolder(){
    log.info('-> System::loadNextFolder')
    var folder = this.folders.shift()
    log.info(`   Folder: "${folder}"`)
    // Protection contre les dossiers vides
    if(folder && fs.existsSync(folder)){
      if(globSync(`./${folder}/**/*.js`).length === 0){
        log.info(`<- System::loadNextFolder (pas de script dans le dossier)`)
        return this.loadNextFolder()
      }
    }
    if ( isUndefined(folder) || isFalse(fs.existsSync(folder)) ){
      // <= On est arrivé à la fin des dossiers à charger
      // => On s'arrête là en appelant la méthode callback.
      log.info(`   Fin des folders. Appel de la fonction callback`)
      return this.methodAfterLoadingFolders()
    }
    glob(`./${folder}/**/*.js`, (err, files) => {
      if(err)throw new Error(err)
      this.loadScripts(files)
    })
    log.info(`<- System::loadNewFolder(${folder})`)
  }

, loadScripts(files){
    var i = 0
    this.loadingScriptsCount = files.length
    this.loadings = 0
    for(;i<this.loadingScriptsCount;++i){this.loadScript(files[i])}
  }

, loadScript(file){
    let my = this
    let script = document.createElement('SCRIPT')
    script.src = file.replace(/\.\/app/,'.')
    document.head.append(script)
    script.onload = function(){
      my.addNewLoading(file)
      script = null
    }
    script.onerror = function(err){
      throw new Error(`Une erreur est malheureusement survenue en chargement le script ${file} : ${err}`)
    }
  }

, addNewLoading(fpath){
    ++ this.loadings
    if(this.loadings === this.loadingScriptsCount){
      // <= Le nombre de chargements correspond au nombre de scripts
      // => On peut passer à la suite
      this.loadNextFolder()
    }
  }

, loadCSSFolder(folder){
  let my = this
  if(!fs.existsSync(folder)) return // pas de dossier css => finir
  glob(`${folder}/**/*.css`, (err, files) => {
    if(err) throw new Error(err)
    files.map(file => this.loadCSSFile(file))
  })
}

, loadCSSFile(file, id){
    var relpath = file.replace(/\.\/app/,'.')
    document.head.append(DCreate(LINK, {id:id, attrs:{href: relpath, rel:'stylesheet'}}))
  }

}) // System (assign)

// const Sys = System
