'use strict'

global.Tests = {
  appPath: path.resolve('.')
, config: {}
, inited: false
, ARGV: undefined
, MAINFOLDER: null

/**
  La méthode qui peut être appelée de l'extérieure avec `Tests.run()`
**/
, run(){
    this.initAll().runAll()
  }
// ---------------------------------------------------------------------

, initAll(){
    if ( not(this.inited) ) {
      this.MAINFOLDER = path.join(this.appPath,'FITests')
      this.requireFolder('./lib/required/divers', window)
      this.requireFolder('./lib/required/Tests', this)
      global.FITCase = this.require('lib/required/FITCase')
      this.require('./lib/required/FITAssertion') // => function assert
      this.require('./lib/required/FITExpectation') // => function expect
      this.require('./lib/required/FITest') // => function expect
      // toutes les assertions
      this.requireFolder('./lib/required/Assertions')

      this.initTestsMethods() // pour exposer 'pending', 'tester' etc.
    }
    this.initTests()
    // console.log("config:", this.config)
    this.inited = true
    return this // pour le chainage
  }

/**
  Initialisation des tests proprement dits, c'est ici qu'on :
    * charge les fichiers de support propres à l'application
    * relève la liste des fichiers tests filtrés
**/
, initTests(){
    // La configuration doit être chargée chaque fois
    Object.assign(this.config, JSON.parse(fs.readFileSync(path.join(this.testsFolder,'config.json'),'utf8')))
    // Si des expressions régulières doivent être utilisées pour filtrer les fichiers ou les noms
    // de tests on les prépare.
    if ( this.config.regFiles ) this.config.regFiles = new RegExp(RegExp.escape(this.config.regFiles))
    if ( this.config.regNames ) this.config.regNames = new RegExp(RegExp.escape(this.config.regNames))
    if ( this.config.regCases ) this.config.regCases = new RegExp(RegExp.escape(this.config.regCases))
    // Liste Array des instances Test des tests joués (et seulement les tests joués)
    this.tests = []
    this.loadSupportFiles()
    this.success_count    = 0
    this.failure_count    = 0
    this.pending_count    = 0
    this.files_count      = 0
    this.tests_count      = 0
    this.cases_count      = 0
    this.instanciedTests  = 0
    this.buildTestsFilesList()
    // on prépare tous les cases, en fonction des filtrages à opérer
    this.prepareAllCases()

  }

/**
  Chargement des fichiers de support propres à l'application
**/
, loadSupportFiles(){
    Console.redbold("Le dossier support est à charger")
  }

/**
  Définit la liste des fichiers tests, en fonction éventuellement
  d'un filtre défini dans le fichier config.json

  Définit la propriété this.testsFiles
 */
, buildTestsFilesList(){
    let files = [], p, arr
    if ( this.config.onlyFolders && this.config.onlyFolders.length) {
      // On ne recherche que dans certains dossiers
      this.config.onlyFolders.map( rfolder => {
        p = path.join(this.testsFolder,rfolder,'**','*.js')
        files.push(...glob.sync(p))
      })
    } else {
      p = path.join(this.testsFolder,'**','*.js')
      files = glob.sync(p)
    }
    // console.log("Fichiers après filtrage ou non par les dossiers : ", files)

    const systemFiles = ['before_tests.js', 'after_tests.js']
    files = files.filter( file => {
      var fname = path.basename(file)
      if ( systemFiles.indexOf(fname) > -1 ) {
        return false
      } else {
        return true
      }
    })
    // console.log("Fichiers après filtrage par les fichiers système : ", files)

    if ( this.config.regFiles ) {
      // Si une expression régulière est définie pour les noms de fichier,
      // on l'applique
      files = files.filter( file => file.match(this.config.regFiles) )
      // console.log(`Fichiers après filtrage par l'expression régulière ${this.config.regFiles} sur le path : `, files)
    }

    // Si les tests doivent être joués au hasard
    if ( this.config.random && files.length > 1 ){
      files = Array.shuffle(files)
      // console.log("Fichiers après randomisation : ", files)
    }

    this.testsFiles = files
  }

, initTestsMethods(){
    global.describe     = this.describe.bind(this)
    global.action       = this.action.bind(this)
    // global.given        = this.given.bind(this)
    // global.pending      = this.pending.bind(this)
    // global.tester       = this.tester.bind(this)
    // global.beforeTests  = this.beforeTests.bind(this)
    // global.afterTests   = this.afterTests.bind(this)
  }

, describe(sujet, fn){
    let test = new Test(sujet)
    this.newInstanciedTests.push(test)
    fn.bind(test).call()
  }

/**
  Pour requérir un module du dossier des FITests
  @return le module requis
**/
, require(relPath){
    try {
      return require(path.join(this.MAINFOLDER,relPath))
    } catch (err) {
      Console.error(`Problème avec le fichier "${this.MAINFOLDER}/${relPath}"`)
      Console.error(`Chemin complet : ${path.join(this.MAINFOLDER,relPath)}`)
      console.error(err)
    }
  }
/**
  Pour requérir tous les modules .js du dossier +pfolder+ et étendre (mixin)
  l'objet +owner+
**/
, requireFolder(pfolder, owner){
    // glob.sync(path.join(pfolder,'**','*.js')).map( file => {
    glob.sync(path.join(this.MAINFOLDER,pfolder,'**','*.js')).map( file => {
      // console.log("Requérir:", file)
      try {
        if ( owner ) Object.assign( owner, require(file) )
        else require(file)
      }
      catch (e) {
        console.error("Problème avec le fichier :", file)
        console.error(e)
      }
    })
  }
}
Object.defineProperties(Tests,{
  beforeTestsFile:{get(){
    return path.join(this.testsFolder,'before_tests.js')
  }}
, afterTestsFile:{get(){
    return path.join(this.testsFolder,'after_tests.js')
  }}
, testsFolder:{get(){
    return path.join(this.appPath,'__TestsFIT__')
  }}
})

global.FITestExpectation = class {
  constructor(data){}
}

module.exports = Tests
