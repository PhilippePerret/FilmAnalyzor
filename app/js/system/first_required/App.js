'use strict'


const App = {
  class: 'App'
, type: 'object'
, allComponantsLoaded: false
, ready: false

  // Quand App est prête
, onReady(){

    const UIBuilder = require('./ui/ui_builder')
    UIBuilder.init()

    log.info("--- APP READY ---")
    if (MODE_TEST) {
      Tests.initAndRun()
    } else {
      FAnalyse.checkLast()
    }
  }

/**
  Pour charger un module se trouvant dans le dossier app/js/tools
**/
, loadTool(affixe){
    if(!affixe.endsWith('.js')) affixe += '.js'
    return require(`${APPFOLDER}/app/js/tools/${affixe}`)
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
    Méthode qui s'assure, avant de charger l'analyse choisie, que tous les
    composants sont bien chargés. Et les charge au besoin.
  **/
, loadAllComponants(){
    log.info("-> AppLoader::loadAllComponants")
    App.allComponantsLoaded = false
    // return 
    if(NONE === typeof UI)            return this.loadComponant('ui/ui')
    if(NONE === typeof BancTimeline)  return this.loadComponant('ui/banc_timeline')
    if(NONE === typeof DataEditor)    return this.loadComponant('DataEditor')
    if(NONE === typeof EventForm)     return this.loadComponant('EventForm')
    if(NONE === typeof FAWriter)      return this.loadComponant('faWriter')
    if(NONE === typeof FAProtocole)   return this.loadComponant('faProtocole')
    if(NONE === typeof FAStater)      return this.loadComponant('faStater')
    if(NONE === typeof FAEventer)     return this.loadComponant('faEventer')
    if(NONE === typeof FABrin)        return this.loadComponant('faBrin')
    if(NONE === typeof FAPersonnage)  return this.loadComponant('faPersonnage')
    if(NONE === typeof FAProcede)     return this.loadComponant('faProcede')
    if(NONE === typeof FAReader)      return this.loadComponant('faReader')
    if(NONE === typeof FAStats)       return this.loadComponant('faStats')
    if(NONE === typeof FAImage)       return this.loadComponant('faImage')

    // Si tout est OK, on peut rappeler la méthode Fanalyse.load
    log.info("   Tous les composants sont chargés.")
    App.allComponantsLoaded = true
    this.onReady()
    log.info("<- AppLoader::loadAllComponants")
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

// On démarre le chargement
AppLoader.start()

module.exports = App
