'use strict'

if ( 'undefined' === typeof MESSAGES) {
  global.path = require('path')
  global.fs = require('fs')
  // POUR LE MOMENT, JE METS DES PATHS ABSOLUS POUR POUVOIR UTILISER
  // LES TESTS AILLEURS
  // const APP_FOLDER = '/Users/philippeperret/Programmation/FilmAnalyzor'
  const APP_FOLDER = path.dirname(__dirname)
  const SYS_FOLDER = path.join(APP_FOLDER,'app','js','system')
  const T_ERR_MSG = require(path.join(SYS_FOLDER,'first_required', 'messages_et_errors'))
  Object.assign(global,{
    glob: require('glob')
    , Console: require(path.join(SYS_FOLDER,'console'))
    , T: T_ERR_MSG.T
    , ERRORS: T_ERR_MSG.ERRORS
    , MESSAGES: T_ERR_MSG.MESSAGES
  })
}

/**
  |
  |
  | Constante Tests
  |
  |
**/
const Tests = {

  appPath: path.resolve('.')
, config: {}
, inited: false
, ARGV: undefined
, MAINFOLDER: null

/**
  La méthode qui peut être appelée de l'extérieure avec `Tests.run()`
**/
, run(){
    this.init()
      .resetCounters()
      .initTests()
      .clearAll() // nettoie la console
      .runAll()
  }
// ---------------------------------------------------------------------

/**

  Voir pour l'atelier Icare par exemple
**/
, initForExpectOnly(name){
    this.init().resetCounters()
    this.currentTest = new Test(name || 'False test')
    this.currentTest.init()
    // Il faut indiquer aussi que les messages doivent être retournés
    this.EXPECT_ONLY_MODE = true
  }
, init(){
    if ( ! this.inited ) {
      // this.MAINFOLDER = path.join(this.appPath,'FITests')
      this.MAINFOLDER = __dirname
      // console.log("__dirname", __dirname)
      // console.log("this.MAINFOLDER = ", this.MAINFOLDER)
      this.require('lib/required2/FITSubject')
      // this.requireFolder('./lib/required1/divers', window)
      this.requireFolder('lib/required1/divers', global)
      this.requireFolder('lib/auto_required')
      // if (undefined === FITResultat) throw new Error("FITResultat devrait être défini")
      this.requireFolder('lib/required2/Tests', this)
      global.FITCase = this.require('lib/required2/FITCase')
      this.require('lib/required2/FITAssertion') // => function assert
      this.require('lib/required2/expect') // => function expect
      this.require('lib/required2/remember') // => function remember
      this.require('lib/required2/FITest')
      // toutes les assertions
      this.requireFolder('lib/required2/Assertions')
      this.requireFolder('lib/_tests_utilities')

      this.initTestsMethods() // pour exposer 'pending', 'tester' etc.

      this.loadSupportFiles()

      this.inited = true
    }

    return this // pour le chainage
  }

/**
  Initialisation des "compteurs"

  Note : la méthode est isolée pour pouvoir utiliser les FITests sans FITests,
  comme par exemple pour l'atelier Icare, où on n'appelle que init() pour
  profiter des expectations

**/
, resetCounters(){
    // Liste Array des instances Test des tests joués (et seulement les tests joués)
    this.tests = []
    this.success_count    = 0
    this.failure_count    = 0
    this.pending_count    = 0
    this.files_count      = 0
    this.tests_count      = 0
    this.cases_count      = 0
    this.instanciedTests  = 0
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
    if ( this.config.regFiles ) this.config.regFiles = new RegExp(this.config.regFiles)
    if ( this.config.regNames ) this.config.regNames = new RegExp(this.config.regNames)
    if ( this.config.regCases ) this.config.regCases = new RegExp(this.config.regCases)

    // Détruire tous les fichiers support/files créés à la volée
    // aux tests précédents
    removeAllFiles()

    // Faire la liste des tests
    this.buildTestsFilesList()
    // on prépare tous les cases, en fonction des filtrages à opérer
    this.prepareAllCases()

    return this // pour le chainage
  }

/**
  Méthode inverse de "initTests" qui est appelée à la fin des tests,
  principalement pour nettoyer le terrain.
**/
, desinitTests(){
    const trace = this.config.trace === true
      , dontTrace = !trace

    // Détruire tous les fichiers support/files créés à la volée
    // mais seulement si l'option `trace` n'a pas été activée dans les
    // la configuration
    dontTrace && removeAllFiles()

  }

/**
  Chargement des fichiers de support propres à l'application
**/
, loadSupportFiles(){
    // Tout le support de l'application courante
    this.requireFolder(path.join(this.testsFolder,'support'))
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
        files.push(...globSync(p))
      })
    } else {
      p = path.join(this.testsFolder,'**','*.js')
      files = globSync(p)
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
    if ( ! this.EXPECT_ONLY_MODE ){
      global.describe     = this.describe.bind(this)
    }
    global.action       = this.action.bind(this)
    global.pending      = this.pending.bind(this)
    global.tester       = this.tester.bind(this)
    global.sumary       = this.sumary.bind(this)
    global.sumarize     = this.sumary.bind(this)
    global.sumarise     = this.sumary.bind(this)
  }

, sumary(msg){
    msg = msg.split(RC).map(lig => `\t${lig.trim()}`).join(RC)
    Console.smallblue(`SOMMAIRE\n--------${msg}`)
  }

, describe(sujet, fn){
    let test = new Test(sujet)
    if ( undefined === this.newInstanciedTests ){
      // Cela arrive lorsqu'on utilise FITests sans jouer ses propres tests,
      // juste pour profiter des expectations et assertions, comme c'est le
      // cas avec l'atelier Icare
      this.newInstanciedTests = []
    }
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
    if ( ! fs.existsSync(pfolder) ) pfolder = path.join(this.MAINFOLDER,pfolder)
    pfolder = path.join(pfolder,'**','*.js')
    globSync(pfolder).map( file => {
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
// Dossier contenant les fichiers créés à la volée pour les tests
, supportFilesFolder:{get(){
  return path.join(Tests.supportTestsFolder,'files')
}}
, supportTestsFolder:{get(){
    return path.join(this.testsFolder,'support')
}}
, testsFolder:{get(){
    return path.join(this.appPath,'__TestsFIT__')
  }}
})

global.FITestExpectation = class {
  constructor(data){}
}

global.Tests = Tests
module.exports = Tests
