'use strict'

global.Tests = {
  appPath: path.resolve('.')
, config: {}
, inited: false
, ARGV: undefined
, MAINFOLDER: null

// ---------------------------------------------------------------------

, initAll(){
    if ( not(this.inited) ) {
      this.MAINFOLDER = path.join(this.appPath,'FITests')
      this.requireFolder('./lib/required/divers', window)
      this.requireFolder('./lib/required/Tests', this)
      this.requireFolder('./lib/required/Test', Test.prototype)
      this.requireFolder('./lib/required/FITCase', FITCase.prototype)
      this.requireFolder('./lib/required/Expect')
      this.requireFolder('./lib/required/FITAssertion')
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
    Object.assign(this.config, JSON.parse(fs.readFileSync(path.join(this.MAINFOLDER,'config.json'),'utf8')))
    // Si des expressions régulières doivent être utilisées pour filtrer les fichiers ou les noms
    // de tests on les prépare.
    if ( this.config.regFiles ) this.config.regFiles = new RegExp(RegExp.escape(this.config.regFiles))
    if ( this.config.regNames ) this.config.regNames = new RegExp(RegExp.escape(this.config.regNames))
    if ( this.config.regCases ) this.config.regCases = new RegExp(RegExp.escape(this.config.regCases))
    // Liste Array des instances Test des tests joués (et seulement les tests joués)
    this.tests = []
    this.loadSupportFiles()
    this.success_count  = 0
    this.failure_count  = 0
    this.pending_count  = 0
    this.files_count    = 0
    this.tests_count    = 0
    this.cases_count    = 0
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
    if ( this.config.onlyFolders ) {
      // On ne recherche que dans certains dossiers
      this.config.onlyFolders.map( rfolder => {
        p = path.join(this.appPath,this.config.TEST_FOLDER,rfolder,'**','*.js')
        files.push(...glob.sync(p))
      })
    } else {
      p = path.join(this.appPath,this.config.TEST_FOLDER,'**','*.js')
      files = glob.sync(p)
    }
    console.log("Fichiers après filtrage ou non par les dossiers : ", files)

    if ( this.config.regFiles ) {
      // Si une expression régulière est définie pour les noms de fichier,
      // on l'applique
      files = files.filter( file => file.match(this.config.regFiles) )
      console.log("Fichiers après filtrage par l'expression régulière sur le path : ", files)
    }

    // Si les tests doivent être joués au hasard
    if ( this.config.random && files.length > 1 ){
      files = Array.shuffle(files)
      console.log("Fichiers après randomisation : ", files)
    }

    this.testsFiles = files
  }

, initTestsMethods(){
    Console.redbold("Les méthodes générales sont à exposer")
    return // pour le moment
    global.given        = this.given.bind(this)
    global.pending      = this.pending.bind(this)
    global.tester       = this.tester.bind(this)
    global.action       = this.action.bind(this)
    global.beforeTests  = this.beforeTests.bind(this)
    global.afterTests   = this.afterTests.bind(this)
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

global.Test = class {
  constructor(name){ this.name = name }
}
global.FITestExpectation = class {
  constructor(data){}
}
global.FITCase = class {
  constructor(test, name, fn){
    this.test = test  // {Test}
    this.name = name  // {String}
    this.fn   = fn    // {Function}
  }
}

module.exports = Tests
