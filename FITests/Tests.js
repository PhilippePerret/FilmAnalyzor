'use strict'

const Tests = {
    config: {}
  , appPath: path.resolve('.')
  , MAINFOLDER: null
  , inited: false
  , ARGV: undefined
  , nombre_failures:  0
  , nombre_success:   0
  , nombre_pendings:  0
  , loadings: 0

// ---------------------------------------------------------------------

, initAll(){
    if ( not(this.inited) ) {
      this.MAINFOLDER = path.join(this.appPath,'FITests')
      this.requireFolder('./lib/required/divers', window)
      this.requireFolder('./lib/required/Tests', this)
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
    this.loadSupportFiles()
    this.buildTestsFilesList()
  }

, runAll(){
    if ( isEmpty(this.testsFiles) ) {
      console.log(`%cAucun fichier test n'est à jouer. Merci de les définir ou de rectifier le filtrage.`, REDBOLD)
      return
    }
    console.log(`%cFichiers à jouer : ${this.testsFiles.length}` , REDBOLD)
    // So we start!
    this.runNextTestFile()
  }

/**
  Chargement des fichiers de support propres à l'application
**/
, loadSupportFiles(){
    console.log("%cLe dossier support est à charger", REDBOLD)
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
    console.log("%cLes méthodes générales sont à exposer", REDBOLD)
    return // pour le moment
    window.assert       = this.assert.bind(this) // obsolète, normalement
    window.given        = this.given.bind(this)
    window.pending      = this.pending.bind(this)
    window.tester       = this.tester.bind(this)
    window.action       = this.action.bind(this)
    window.beforeTests  = this.beforeTests.bind(this)
    window.afterTests   = this.afterTests.bind(this)
  }

/**
 * Retourne tous les fichiers javascript du dossier FITest +relPath+
 */
, JsFilesOf(relPath){
    return glob.sync(`${this.MAINFOLDER}/${relPath}/**/*.js`)
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
        Object.assign( owner, require(file) )
      } catch (e) {
        console.error("Problème avec le fichier :", file)
        console.error(e)
      }
    })
  }

}



module.exports = Tests
