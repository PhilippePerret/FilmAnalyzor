'use strict'


const App = {
  class: 'App'
, type: 'object'
, allComponantsLoaded: false
, ready: false
, runtests(){
    if ( NONE === typeof(Tests) ) {
      return System.loadComponant('TestsFIT', this.runtests.bind(this))
    } else {
      Tests.MAINFOLDER = path.join(APPFOLDER,'app','js','composants','TestsFIT')
    }
    Tests.initAndRun()
  }

  // Quand App est prête
, onReady(){

    if ( MODE_TEST ) {
      if ( NONE === typeof(Tests) ) {
        return System.loadComponant('TestsFIT', this.onReady.bind(this))
      } else {
        Tests.MAINFOLDER = path.join(APPFOLDER,'app','js','composants','TestsFIT')
      }
    }

    const UIBuilder = require('./ui/ui_builder')
    UIBuilder.init()

    log.info("--- APP READY ---")
    log.info("    MODE_TEST = ", MODE_TEST || 'false')
    if ( MODE_TEST ) {
      // Tests.initAndRun()
    } else {
      FAnalyse.checkLast()
    }
  }

/**
  Pour requérir un module dans le dossier ./app/js/ (ne pas mettre ./app/js/)
**/
, require(rpath){
    try {
      return require(path.join(APPFOLDER,'app','js',rpath))
    } catch (e) {
      log.error("ERROR dans App::require avec le path", rpath)
      log.error(e)
    }

  }

/**
  Pour charger un module se trouvant dans le dossier app/js/tools
**/
, loadTool(affixe){
    if(!affixe.endsWith('.js')) affixe += '.js'
    return tryRequire(`${APPFOLDER}/app/js/tools/${affixe}`)
  }

, runHandTests(options){
    if(NONE === typeof(HandTests)) return this.loadHandTests(this.runHandTests.bind(this))
    HandTests.initAndRun(options)
  }
  /**
    Méthode pour rejouer les tests depuis le dernier
  **/
, runFromLastHandTest(){
    if(NONE === typeof(HandTests)) return this.loadHandTests(this.runFromLastHandTest.bind(this))
    HandTests.initAndRun({from_last: true})
  }

, loadHandTests(fn_callback){
    isDefined(this.nbTriesLoadHandTests) || ( this.nbTriesLoadHandTests = 0 )
    ++ this.nbTriesLoadHandTests
    if (this.nbTriesLoadHandTests > 5){
      F.error("Trop de tentatives pour charger les tests manuels, je renonce.")
      return false
    }
    if(NONE === typeof(HandTests)) return System.loadComponant('HandTests', this.loadHandTests.bind(this, fn_callback))
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
    let pref  = path.join(APPFOLDER,'Manuel','Manuel_developpeur.md')
      , pdest = path.join(APPFOLDER,'Manuel','Manuel_developpeur.html')
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
      , cmd = `cd "${path.join(APPFOLDER,'Manuel')}";pandoc -s Manuel${isDev?'_developpeur':''}.md --css="manuel.css" --metadata pagetitle="Manuel" --from=markdown --output=Manuel${isDev?'_developpeur':''}.html`
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

, confirmQuit(){
    confirm({
        message: "L'analyse a été modifiée mais pas sauvée. Confirmez-vous la perte des nouvelles données ?"
      , buttons:['Quitter quand même', 'Renoncer']
      , okButtonIndex: 0
      , defaultButtonIndex: 1
      , cancelButtonIndex: 1
      , methodOnOK: this.execQuit.bind(this)
    })
  }
, execQuit(){
    F.notify("Je ne sais pas encore provoquer le quit de l'application.", {error:true})
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
      // => On est prêt à charger tous les composants
      this.loadAllComponants()
    }
  }

/**
  Méthodes de chargement des composants (au load principal)
**/
, loadComponant(componant, fn_callback){
    fn_callback || (fn_callback = this.loadAllComponants.bind(this))
    log.info(`  Loading componant <${componant}>`)
    return System.loadComponant(componant, fn_callback)
  }

, onReady(){
    App.ready = true
    App.onReady()
  }
}

// Object.assign(AppLoader,require(`./js/system/first_required/App_load_componants`))
Object.assign(AppLoader,require(`./App_load_componants`))


// On démarre le chargement
AppLoader.start()

module.exports = App
