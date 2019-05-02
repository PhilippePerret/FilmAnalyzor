'use strict'

const HandTests = {
  class:'HandTests'
, type: 'object'
// Méthode principale appelée pour lancer les tests (par exemple depuis le
// menu, par App)
, initAndRun(options){
    if(undefined === options) options = {}
    log.info('-> HandTests::initAndRun')
    this.init() // sauf le résultat
    if(options.from_last){
      // Pour rejoindre le dernier test effectué. Fonctionnement : on
      // passe en revue tous les tests, jusqu'à trouver celui qui n'est
      // pas complet.
      this.mode_last = true
      this.loadResultats()
    } else {
      this.mode_last = false
      this.initResultats()
    }
    this.run()
  }
// Initialisation des tests manuels
, init(){
    log.info('-> HandTests::init')
    log.info("*** Initialisation des tests manuels (HandTests)")
    if(this._fwindow){
      this.fwindow.remove()
      delete this._fwindow
    }
    this.fwindow.show()
    this.index_current_htestfile = -1
    log.info('<- HandTests::init')
  }
, initResultats(){
    // On prépare le résultat final. noter qu'on ne le fait pas
    // si l'on doit rejoindre le dernier test.
    this.resultats = {
      date: new Date().getTime(),
      successCount: 0, failureCount: 0, pendingCount: 0,
      tests:{}
    }
  }
, run(){
    log.info('-> HandTests::run')
    this.nextHTestFile()
    log.info('<- HandTests::run')
  }
, nextHTestFile(){
    log.info('-> HandTests::nextHTestFile')
    ++ this.index_current_htestfile
    log.info(`     this.index_current_htestfile = ${this.index_current_htestfile}`)
    let hTestFile = this.HTestFiles[this.index_current_htestfile]
    log.info(`     hTestFile = "${hTestFile}"`)
    if(hTestFile){
      this.currentHtestFile = new HandTestFile(hTestFile)
      this.currentHtestFile.run()
    } else {
      this.resumeTests()
    }
    log.info('<- HandTests::nextHTestFile')
  }

// ---------------------------------------------------------------------
//  MÉTHODES DE RÉSULTATS

  /**
    Fin des tests, provoquée ou normale

    @param {Object}   options   Contenant les résultats
  **/
, resumeTests(){
    let jqo = this.fwindow.jqObj
      , body = jqo.find('.htest-body')
      , res  = this.resultats
      , color
    jqo.find('.htest-footer').hide()
    let msg = `success: ${res.successCount}    failures: ${res.failureCount}     pending: ${res.pendingCount}`
    if (res.failureCount){
      color = 'red'
    } else if (res.pendingCount){
      color = 'orange'
    } else {
      color = 'green'
    }
    body.html(`<pre style="font-family:monospace;font-weight:bold;font-size:1.2em;color:${color}">${msg}</pre>`)
    this.saveResultats()
    body.append(DCreate('DIV',{class:'small italic', inner: "Résultats enregistrés dans ./Tests_manuels/resultats.json."}))
  }


, saveResultats(){
    this.code   = this.resultats
    this.iofile.save({after: this.endSaveResultats.bind(this), no_warm_if_shorter: true})
  }
, endSaveResultats(){
  }

, loadResultats(){
    this.resultats = JSON.parse(fs.readFileSync(this.path,'utf8'))
  }
// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

, writePath(rpath){ this.fwindow.jqObj.find('input#htest-path').val(rpath) }
, writeLibelle(lib){ this.writeFoo('libelle', lib) }
, writeDescription(desc){ this.writeFoo('description', desc) }
, writeNote(note){ this.writeFoo('note', note) }
, writeFoo(what, str){
    this.fwindow.jqObj.find(`.htest-${what} span`).html(str)
  }
, resetStepList(){
    this.fwindow.jqObj.find('ul.htest-steps').html('')
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CONSTRUCTION

, build(){
  let my = this
  var headers = [
    DCreate('BUTTON', {type: 'button', class:'btn-close'})
  , DCreate('H2', {class: 'htest-libelle', append:[DCreate('SPAN',{inner:'...'})]})
  ]
  headers.push(DCreate('DIV', {class: 'div-htest-path', append:[
      DCreate('LABEL', {inner: 'Fichier : '})
    , DCreate('INPUT', {id:'htest-path', type:'text', value:'...', class:'small'})
    , DCreate('BUTTON', {id:'btn-htest-path', class:'small', inner: 'jouer'})
  ]}))
  this.description && headers.push(DCreate('DIV', {class: 'htest-description explication', append:[
      DCreate('LABEL', {inner: 'Description : '})
    , DCreate('SPAN', {inner: '...'})
  ]}))
  this.note && headers.push(DCreate('DIV', {class: 'htest-note explication', append:[
      DCreate('LABEL', {inner: 'Note : '})
    , DCreate('SPAN', {inner: '...'})
  ]}))

  return [DCreate('DIV', {class:'htest', append: [
    // Header
    DCreate('DIV', {class:'htest-header', append: headers})
    // Le body
  , DCreate('DIV', {class:'htest-body', append:[
      DCreate('UL',{class: 'htest-steps'})
    ]})
    // Les boutons dans le footer
  , DCreate('DIV', {class: 'htest-footer', append: [
      DCreate('BUTTON', {id: 'btn-finir',     inner: 'FINIR'})
    , DCreate('BUTTON', {id: 'btn-next-file', inner: 'Next File'})
    , DCreate('BUTTON', {id: 'btn-next-test', inner: 'Next Test'})
    , DCreate('BUTTON', {id: 'btn-next-step', inner: 'Next Step'})
    , DCreate('SPAN', {class:'separator', style:'display:inline-block;width:50px;'})
    , DCreate('BUTTON', {id: 'btn-step-success', inner: 'OK'})
    , DCreate('BUTTON', {id: 'btn-step-failure', inner: 'ERROR'})
    ]})

  ]})]
}

, observe(){
  let jqo = this.fwindow.jqObj

  jqo.find('#btn-next-file').on('click',  this.nextFile.bind(this))
  jqo.find('#btn-next-test').on('click',  this.nextTest.bind(this))
  jqo.find('#btn-next-step').on('click',  this.nextStep.bind(this))
  jqo.find('#btn-finir').on('click',      this.resumeTests.bind(this))
  jqo.find('#btn-step-success').on('click', this.markSuccessOrNormal.bind(this))
  jqo.find('#btn-step-failure').on('click', this.markFailure.bind(this))

  // Le bouton pour jouer le test entré dans le champ
  jqo.find('#btn-htest-path').on('click', this.runThisTest.bind(this))
}

/**
  Méthode qui marque un succès ou une étape normale.
  En fait, cette méthode répond au bouton "OK" qui peut signifier deux choses :
  - si on est sur une étape de synopsis, elle signifie qu'on a exécuté l'action
    demandée. Ce n'est pas un success à proprement parler, on n'incrémente pas
    les succès et l'on ne marque pas l'étape en vert.
  - en revanche, si on est sur une étape de check, ce "OK" signifie vraiment
    un succès, qu'on doit marquer tel quel.
**/
, markSuccessOrNormal(){
    if (this.currentHtestFile.currentHTest.currentStep.isSynopsis){
      this.markNormalStep()
    } else {
      this.markSuccess()
    }
  }
, markNormalStep(){
    if(false === this.mode_last){
      this.consigneResCurStep(2)
    }
    this.currentHtestFile.currentHTest.currentStep.markNormalStep()
}
, markSuccess(){
    if (false === this.mode_last){
      this.resultats.successCount ++
      this.consigneResCurStep(1)
    }
    this.currentHtestFile.currentHTest.currentStep.markSuccess()
  }
, markFailure(){
    if (false === this.mode_last){
      this.resultats.failureCount ++
      this.consigneResCurStep(0)
    }
    this.currentHtestFile.currentHTest.currentStep.markFailure()
  }
  // Quand on n'utilise ni le bouton OK ni le bouton ERROR
, markPending(){
    if (this.mode_last) return
    this.resultats.pendingCount ++
    this.consigneResCurStep(2)
  }
  // Retourne la clé absolue de l'étape du test courant du fichier courant
, consigneResCurStep(valRes){
    if(undefined === this.resultats.tests[this.currentHtestFile.relpath]){
      this.resultats.tests[this.currentHtestFile.relpath] = {}
    }
    if(undefined === this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id]){
      this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id] = {}
    }
    this.resultats.tests[this.currentHtestFile.relpath][this.currentHtestFile.currentHTest.id][this.currentHtestFile.currentHTest.currentStep.index] = valRes
  }
, nextStep(){
    this.markPending()
    this.currentHtestFile.currentHTest.nextStep()
  }
, nextTest(){
    this.markPending()
    this.currentHtestFile.nextTest()
  }
  // Pour passer au fichier suivant
, nextFile(){
    this.markPending()
    this.nextHTestFile()
  }

  /**
    Méthode appelée par le bouton "Jouer" à côté du path relatif du test
    pour jouer un test particulier, ou un dossier de test.
    L'expression peut être régulière, elle est cherchée de toute façon
    comme une expression régulière.

    Le path peut se terminer par ":<id test>" pour jouer un test particulier
    du fichier.
    Une erreur est produite si aucun test n'est trouvé.

  **/
, runThisTest(){
    let raw = this.fwindow.jqObj.find('#htest-path').val().trim()
    if (raw === ''){
      // <= Aucun test n'a été entré
      // => Je signale l'erreur et je les prends tous.
      return F.notify('Il faut indiquer le test à jouer. Je les prends tous.')
    } else {
      let [dpath, test_id] = raw.split(':')
        , fullpath = path.join(this.folder,dpath)

      // Servira à la class HandTestFile pour trouver le bon test
      this.required_test_id = test_id

      if(fs.existsSync(fullpath)){
        // <= Le fichier indiqué existe
        // => C'est celui-là que je peux jouer
        this._HTestFiles = [fullpath]
        return this.initAndRun()
      } else {
        // <= Ce n'est pas un test précis qui a été donné
        // => On cherche le ou les tests par expression régulière
        var arr = [], cfile
        let reg = new RegExp(dpath)
          , regRel = new RegExp(`^${path.join(this.folder)}/`)
        this.HTestFiles.forEach(function(file){
          cfile = file.replace(regRel,'')
          if(cfile.match(reg)) arr.push(file)
        })
        this._HTestFiles = arr
        arr = null
        return this.initAndRun()
      }
    }

    // TODO On réinitialise tout (on était peut-être en train de tester)
  }
} // /fin de HandTests
Object.defineProperties(HandTests,{
  path:{
    get(){return path.join(this.folder, 'resultats.json')}
  }
, iofile:{
    get(){return this._iofile||defP(this,'_iofile',new IOFile(this))}
  }
, HTestFiles:{
  get(){
    if(undefined === this._HTestFiles){
      this._HTestFiles = glob.sync(`${this.folder}/**/*.yaml`)
    }
    return this._HTestFiles
  }
}
, fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{x: 600, y:20}))}
}
, folder:{
    get(){return this._folder||defP(this,'_folder',path.join(APPFOLDER,'Tests_manuels'))}
  }
})
