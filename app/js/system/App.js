'use strict'


const App = {
  class: 'App'
, type: 'object'
, ready: false
, onReady(){
    UI.init()
    log.info("--- APP READY ---")
    if (MODE_TEST) {
      Tests.initAndRun()
    } else {
      FAnalyse.checkLast()
    }
  }

, runHandTests(options){
    if('undefined' === typeof(HandTests)) return this.loadHandTests(this.runHandTests.bind(this))
    HandTests.initAndRun(options)
  }
  /**
    Méthode pour rejouer les tests depuis le dernier
  **/
, runFromLastHandTest(){
    if('undefined' === typeof(HandTests)) return this.loadHandTests(this.runFromLastHandTest.bind(this))
    HandTests.initAndRun({from_last: true})
  }

, loadHandTests(fn_callback){
    if(undefined === this.nbTriesLoadHandTests) this.nbTriesLoadHandTests = 1
    else {
      ++ this.nbTriesLoadHandTests
      if (this.nbTriesLoadHandTests > 5){
        F.error("Trop de tentatives pour charger les tests manuels, je renonce.")
        return false
      }
    }
    if('undefined' === typeof(HandTests)) return System.loadComponant('HandTests', this.loadHandTests.bind(this, fn_callback))
    fn_callback()
  }

/**
  Méthode appelée depuis le menu « Outils > Ouvrir le manuel » pour ouvrir
  le manuel d'utilisation en version HTML
**/
, openManuel(){
    let pref  = path.join(APPFOLDER,'Manuel','Manuel.md')
      , pdest = path.join(APPFOLDER,'Manuel','Manuel.html')
    if (this.isOutOfDate(pref, pdest)){
      this.updateManual(false, pdest)
    } else {
      this.openInBrowser(pdest)
    }
  }
// Pour ouvrir le manuel de développement
, openManuelDeveloppement(){
    let pref  = path.join(APPFOLDER,'Manuel','Manuel_developpement.md')
      , pdest = path.join(APPFOLDER,'Manuel','Manuel_developpement.html')
    if (this.isOutOfDate(pref, pdest)){
      this.updateManual(true, pdest)
    } else {
      this.openInBrowser(pdest)
    }
  }
// Ouverture du fichier +fpath+ dans Safari (ou autre, à voir)
, openInBrowser(fpath){
    log.info(`-> App::openInBrowser(${fpath})`)
    exec(`open -a Safari "${fpath}"`)
    log.info('<- App::openInBrowser')
  }

, updateManual(isDev, fpath){
    log.info('-> App::updateManual')
    let my  = this
      , cmd = `cd "${path.join(APPFOLDER,'Manuel')}";pandoc -s Manuel${isDev?'_developpement':''}.md --css="manuel.css" --metadata pagetitle="Manuel" --from=markdown --output=Manuel${isDev?'_developpement':''}.html`
    exec(cmd, err => {
      if(err) throw err
      my.openInBrowser(fpath)
    })
    log.info('<- App::updateManual')
  }

/**
  Retourne true si le fichier +actual+ et plus vieux que son +referent+
  ou s'il n'existe pas.
**/
, isOutOfDate(referent, actual){
    if(!fs.existsSync(actual)) return true
    return fs.statSync(referent).mtime > fs.statSync(actual).mtime
  }

}// /fin App

const AppLoader = {
  class:  'AppLoader'
, type:   'object'
, REQUIRED_MODULES: [
      ['common', 'FAnalyse']
    , ['common', 'FAEvents']
    , ['common', 'FAEvent']
  ]
, start(){
    this.requiredModules = Object.assign([], this.REQUIRED_MODULES)
    this.requireNext()
  }
, requireNext(){
    // console.log("-> requireNext")
    if(this.requiredModules.length){
      // <= Il y a encore des modules à charger
      // => On poursuit
      let [folder, subfolder] = this.requiredModules.shift()
      System.loadJSFolders(`./app/js/${folder}`, [subfolder], this.requireNext.bind(this))
    } else {
      // <= Il n'y a plus de modules à charger
      // => On est prêt
      this.onReady()
    }
  }

, onReady(){
    App.ready = true
    App.onReady()
  }
}

// On démarre le chargement
AppLoader.start()
