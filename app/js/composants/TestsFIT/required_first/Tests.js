'use strict'

const Tests = {
    tests: []
  , inited: false
  , ARGV: undefined
  , MAINFOLDER: null // doit être défini par l'application
  , nombre_failures:  0
  , nombre_success:   0
  , nombre_pendings:  0
  , loadings: 0

  // ---------------------------------------------------------------------

  , initAndRun:function(){
      console.clear()
      defaultize(this,'ARGV',[])
      if ( not(this.inited) ) {
        // Charger la configuration
        Object.assign(this,require(path.join(this.MAINFOLDER,'config.js')))
        this.ARGV = remote.process.argv
        this.ARGV.shift()
        this.ARGV.shift()
        this.sys_errors = []
        return this.loadSupportFiles() // ça appellera init()
        this.init()
      } else {
        this.run2()
      }
    }

  , run2(){
      this.init()
      console.log("Je runne de l'autre manière.")
      this.testFilesList = this.getTestFileList()
      this.nextTest()
      // console.log("Liste des tests : ", this.testFilesList)
      // var testFile
      // while (testFile = testsList.shift() ) {
      //   this.run2next(testFile)
      // }
    }
  , run2next(testFile) {
      require(testFile)
      this.tests[0].run()
    }


  , init:function(){
      // Base de l'application (sert notamment pour les paths des tests)
      this.appPath = path.resolve('.')
      this.inited = true
      return
    }

    /**
     * Retourne la liste des fichiers tests, on fonction éventuellement
     * d'un filtre défini en argument
     */
  , getTestFileList:function(){
      console.log("-> TestsFIT.getTestFileList")
      var filtre    = this.ARGV[0]
      var searched, liste
      if ( undefined === filtre ) {
        searched = '**/*.js'
      } else if (filtre && filtre.match(/\.js$/)){
        searched = filtre
      } else { // un dossier
        searched = `${filtre}/**/*.js`
      }
      // console.log("Dossier tests:", `${this.appPath}/${this.config.TEST_FOLDER}/${searched}`)
      liste = glob.sync(`${this.appPath}/${this.config.TEST_FOLDER}/${searched}`)
      if (liste.length == 0){
        throw new Error("Aucun test !")
      }
      // console.log("Liste des tests : ", liste)
      return liste
    }
  , loadSupportFiles:function(){

      // var sysFiles  = this.JsFilesOf('system')
      var supFiles  = this.JsFilesOf('support')

      this.expected_loadings = 0
      // this.expected_loadings += sysFiles.length
      this.expected_loadings += supFiles.length

      // La méthode qui devra être appelée après le chargement
      // this.methode_suite_loading = this.loadTestFiles.bind(this)
      this.methode_suite_loading = this.run2.bind(this)

      for(var filesFolder of [supFiles]){
        // console.log("Fichiers du dossier :", filesFolder, sysFiles)
        for(var relpath of filesFolder){
          this.createScript(relpath)
        }
      }
    }

  , loadTestFiles:function(){

      this.expected_loadings = 0
      var testFiles = this.getTestFileList()
      this.expected_loadings += testFiles.length

      // La méthode qui devra être appelée après le chargement
      this.methode_suite_loading = this.initBeforeRun.bind(this)

      for(var relpath of testFiles){
        this.createScript(relpath)
      }

    }

    /**
     * Méthode appelée lorsqu'un nouveau chargement de script est terminé
     */
  , addNewLoading:function(){
      -- this.expected_loadings
      if (this.expected_loadings === 0){
        // <= Tous les chargements ont été effectués
        // => On peut passer à la suite les tests
        this.methode_suite_loading()
      }
    }
  , createScript: function(fpath){
      let script = document.createElement('script')
      script.src = fpath.replace(/\.\/app/,'.')
      document.head.append(script)
      script.onload = function(){
        Tests.addNewLoading()
        script = null
      }
      script.onerror = function(err){
        throw(`Une erreur est malheureusement survenue en chargement le script ${fpath} : ${err}`)
      }
    }

    /**
     * Retourne tous les fichiers javascript du dossier FITest +relPath+
     */
  , JsFilesOf:function(relPath){
      return glob.sync(`${this.MAINFOLDER}/${relPath}/**/*.js`)
    }

}

// Object.assign(Tests,require.resolve('../config.js'))

module.exports = Tests
