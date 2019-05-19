'use strict'
const path  = require('path')
const fs    = require('fs')
const glob  = require('glob')
const log   = require('electron-log')

/**
 * Object System
 * -------------
 * Permet de gérer le système courant
 */
const System = {

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
loadComponant(compName, fn_callback){
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
      if(glob.sync(`./${folder}/**/*.js`).length === 0){
        log.info(`<- System::loadNextFolder (pas de script dans le dossier)`)
        return this.loadNextFolder()
      }
    }
    if (undefined === folder || !fs.existsSync(folder) ){
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

}

module.exports = System
