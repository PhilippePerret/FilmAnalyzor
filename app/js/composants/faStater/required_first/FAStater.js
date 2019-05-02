'use strict'


const FAStater = {
  class: 'FAStater'

  // Les valeurs attendues pour une analyse complète
, ExpectedCustomDocsCount:  5
, ExpectedEventsByMinute:   20
, ExpectedDocuments: {
    'introduction':     {requirity: 8,  minLen: two.pages}
  , 'annexes':          {requirity: 5,  minLen: four.pages}
  , 'au_fil_du_film':   {requirity: 10, minLen: fifth.pages}
  , 'building_script':  {requirity: 10, minLen: 100}
  , 'fondamentales':    {requirity: 10, minLen: one.pages}
  , 'lecon_tiree':      {requirity: 8,  minLen: tree.pages}
  , 'lexique':          {requirity: 4,  minLen: 100}
  , 'personnages':      {requirity: 6,  minLen: tree.pages}
  , 'pfa':              {requirity: 9,  minLen: one.pages}
  , 'synopsis':         {requirity: 10, minLen: one.pages}
  , 'themes':           {requirity: 5,  minLen: two.pages}
  , 'infos':            {requirity: 5,  minLen: 100}
  }

, inited: false

/**
  Initialisation du stater, le gestion d'état de l'analyse courante
**/
, init(analyse){
    this.a = this.analyse = analyse

    this.observe()

    this.inited = true
  }
, observe(){
  if(this.a){
    // Quand on clique sur la jauge d'avancement, ça ouvre le
    // détail
    $('#statebar-jauger label[for="statebar-jauger"]').on('click', this.a.displayAnalyseState.bind(this.a))
    // Quand on clique sur la dernière étape, ça ouvre la fenêtre
    // de protocol
    $('#statebar-last-step-protocole, label[for="statebar-last-step-protocole"]').on('click', this.a.protocole.show.bind(this.a.protocole))
  }
}

/**
  Demande d'affichage de l'état d'avancement en bas de la fenêtre.
**/
, displaySumaryState(){

    // Pour essayer avec des valeurs :
    // this.setJaugeAtPourcent(20)
    // this.setNombreDocuments(5)
    // this.setNombreEvents(34)

    // Pour le moment, on appelle cette méthode, mais peut-être qu'on pourra
    // imaginer ensuite de mémoriser les valeurs et de les afficher simplement.
    this.updateSumaryState()

  }

// Actualisation de l'état d'avancement (raccourci : FAStater.update())
, update(){return this.updateSumaryState.bind(this)()}
, updateSumaryState(){

  // Les nombres totaux qui seront utilisés pour obtenir le
  // pourcentage. Le premier correspond à la valeur maximale,
  // la valeur "100%", la seconde correspond à la valeur
  // courant, pour l'analyse courante.
  this.totalMaxValue = 0
  this.totalCurValue = 0

  delete this._documentsCount
  delete this._documents

  // On remet les compteurs à 0 (ou presque…)
  this.setJaugeAtPourcent(0.01)
  this.setNombreDocuments('...')
  this.setNombreEvents('...')
  this.setLastStepProtocole('...')
  this.setMaxPctProtocole('...')

  if(!this.a) return

  // Pourcentage par rapport à ceux attendus
  this.calcStateDocuments()
  // Nombre de documents (normaux et customisés)
  this.calcAndShowDocumentsCount()
  // Nombre d'events et pourcentage
  this.calcAndShowEventsCount()
  this.calcPourcentageEvents()

  this.calcStatePFA()

  // On peut calculer le pourcentage final
  let finalPct = (this.pourcentageProtocoleReference() * pourcentage(this.totalMaxValue, this.totalCurValue)) / 100
  finalPct = Math.round(finalPct * 100) / 100

  // On règle enfin le pourcentage final
  this.setJaugeAtPourcent(finalPct, `${finalPct} %`)
  this.setMaxPctProtocole(`${this.pourcentageProtocoleReference()} %`)


  this.setLastStepProtocole(this.a.protocole.lastStep() || '...')

  }


/**
  Calcul de l'état du protocole

  Normalement, dans l'idéal, on devrait tout étudier à la lueur de
  l'état du protocole. Un pourcentage général ne doit pouvoir être
  atteint que lorsque l'on a atteint une certaine étape du protoccole.

  Par exemple, on ne peut atteindre les 90/100% que lorsque l'on
  a atteint la 'relecture', la 'full-correction', la finalisation de la
  couverture ('final-cover') et la finalisation de l'eBook (final-ebook)
  Avant ça, quelque soit l'état, il ne peut qu'atteindre les 90%
**/
, pourcentageProtocoleReference(){
    return this._pctprotoref || defP(this,'_pctprotoref', this.calcStateProtocole())
}
, calcStateProtocole(){
    var lastPct
    for(var pct in FAProtocole.States){
      if(this.areSPChecks(FAProtocole.States[pct])){
        lastPct = parseInt(pct,10)
      } else {
        return lastPct
      }
    }
  }
// Retourne true si les étapes +steps+ du protocole sont cochées
// Note : 'SP' pour 'Step Protocole'
, areSPChecks(steps){
    if(undefined === this.checks) this.checks = this.a.protocole.data
    for(var step of steps){
      if(this.checks[step] !== true) return false
    }
    return true
  }
/**
  Calcul de l'état du PFA
**/
, calcStatePFA(){
    var curValue = 0
      , maxValue = 0
      , kstt, dstt
      , pfa = this.a.PFA

    for(kstt in pfa.DATA_STT_NODES){
      dstt = pfa.DATA_STT_NODES[kstt]
      if(pfa.data[kstt]){
        curValue += 10 * dstt.requirity
      }
      maxValue += 10 * dstt.requirity
    }
    // console.log("Résultat pour le PFA. Valeur courante, valeur maximale, ", curValue, maxValue, asPourcentage(maxValue, curValue))

    this.totalCurValue += curValue
    this.totalMaxValue += maxValue

    pfa = null
  }
/**
  Pour calculer le pourcentage d'events, on part du principe
    1. qu'il en faut au moins 2000 pour une analyse complète,
    2. qu'il faut une scène par minute
**/
, calcPourcentageEvents(){
    this.scenesCountExpected = Math.round(this.a.duree / 60)
    this.scenesCountActual   = FAEscene.count

    // console.log("Nombre de scènes attendues et réelles :", this.scenesCountExpected, this.scenesCountActual)

    if ( this.scenesCountActual > this.scenesCountExpected){
      this.scenesCountExpected = this.scenesCountActual
    }

    this.totalMaxValue += this.scenesCountExpected
    this.totalCurValue += this.scenesCountActual
    // console.log("Pourcentage pour les scènes : ", asPourcentage(this.scenesCountExpected, this.scenesCountActual))
  }

, calcAndShowEventsCount(){
    var eventsCount =

    this.eventsCountExpected = 2000
    this.eventsCountActual   = this.a.events.length
    this.setNombreEvents(this.eventsCountActual)

    if (this.eventsCountActual > this.eventsCountExpected ){
      this.eventsCountExpected = this.eventsCountActual
      // Pour ne pas dépasser 100%
    }

    this.totalMaxValue += Math.round(this.eventsCountRequired)
    this.totalCurValue += Math.round(this.eventsCountActual)

    // console.log("Pourcentage pour les events : ", asPourcentage(this.eventsCountExpected, this.eventsCountActual))

  }
/**

  TODO Il faudra prendre en compte la longueur des documents pour
  qu'ils puissent compter.
**/
, calcStateDocuments(){
    // console.log("this.documents:", this.documents)
    // La valeur maximale que peut atteindre la liste
    // des documents (en fonction de la requirity de chaque
    // document)
    var maxValue = 0
    // La valeur pour l'analyse
    var curValue = 0

    var curS  // pour la taille du document
      , minS  // pour la taille minimale
      , factor // le facteur résultant
      ;

    // Les documents "officiels"
    for(var kdoc in this.ExpectedDocuments){
      var ddoc = this.ExpectedDocuments[kdoc]
      maxValue += ddoc.requirity
      if(undefined === this.documents.items[kdoc]){
        // <= Le document n'existe pas
        // => On le ne compte pas
        // console.log("Document inconnu:", kdoc)
      } else {
        // <= Le document existe
        // => On doit vérifier sa longueur pour modérer sa valeur
        curS = this.documents.items[kdoc].stat.size
        minS = ddoc.minLen
        if (curS >= minS) factor = 1
        else factor = curS / minS // => 0.5 si on est à la moitié
        // console.log("Document:",{
        //   kdoc: kdoc, curS: curS, minS: minS, factor: factor,
        //   requirity: ddoc.requirity, value: ddoc.requirity * factor,
        //   valueRound: Math.round(ddoc.requirity * factor)
        // })
        curValue += ddoc.requirity * factor
      }
    }

    // Les documents "personnalisés"
    // On considère que 5 documents personnalisés est une bonne
    // chose. Ça pourra être rectifié plus tard.
    // TODO Sinon ? On les comptes en prenant les fichiers docX.md
    this.ActualCustomDocsCount = glob.sync(path.join(this.a.folderFiles, '**', 'doc-*.md')).length
    curValue += this.ActualCustomDocsCount
    maxValue += this.ExpectedCustomDocsCount


    // Pour les documents
    var pct = asPourcentage(maxValue, curValue)
    // Pour le total
    this.totalMaxValue += maxValue
    this.totalCurValue += curValue
  }

, calcAndShowDocumentsCount(){
    this.setNombreDocuments(`${this.documentsCount} + ${this.ActualCustomDocsCount}`)
  }

, displayFullState(){
    F.notify('Je vais afficher l’avancement dans le détail')
    var method = require('./js/tools/building/fondamentales.js')
    this.a.method.bind(this.a)()
  }

// ---------------------------------------------------------------------
// Méthodes DOM de réglage

// Règle la jauge au poucenter +pct+ donné
, setJaugeAtPourcent(pct, pctStr){
    // console.log("-> setJaugeAtPourcent : ", pct, pctStr)
    this.jqJauge.css('width', `${pct}%`)
    this.jqJauger.attr('title', `État d'avancement estimé à ${pctStr}`)
    $('#statebar-pourcentage').html(pctStr)
  }
, setMaxPctProtocole(str){
    $('#statebar-max-pct-suivant-protocole').html(str)
  }
, setNombreDocuments(nb){
    $('#statebar-docs-count').html(nb)
  }
, setNombreEvents(nb){
    $('#statebar-events-count').html(nb)
  }
, setLastStepProtocole(step_name){
    $('#statebar-last-step-protocole').html(step_name)
  }
}
Object.defineProperties(FAStater,{
  jqJauge:{
    get(){return this._jqJauge||defP(this,'_jqJauge', $('#statebar-jauge'))}
  }
, jqJauger:{
    get(){return this._jqJauger||defP(this,'_jqJauger', $('#statebar-jauger'))}
  }

/**
  Les documents
  -------------
  C'est une table contenant les clés :
    length      Nombre de documents
    items       Les documents.
                Une table contenant en clé l'affixe du document et en
                valeur :
                :affixe     L'affixe
                :name       Le nom seul du document
                :path       Le chamin d'accès au document
                :stat       Les fs.stat du document
**/
, documents:{
    get(){
      if(undefined === this._documents){
        this._documents = {length: 0, items: {}}
        glob.sync(path.join(this.a.folderFiles,'*.*')).forEach(file => {
          var affixe = path.basename(file,path.extname(file))
          this._documents.items[affixe] = {
            affixe: affixe
          , path: file
          , name: path.basename(file)
          , stat: fs.statSync(file)
          }
          ++ this._documents.length
        })
      }
      return this._documents
    }
  }
, documentsCount:{
    get(){
      if(undefined === this._documentsCount){
        this._documentsCount = this.documents.length
      }
      return this._documentsCount
    }
  }
, eventsCountRequired:{
    get(){return this._ecountreq||defP(this,'_ecountreq', Math.round(this.ExpectedEventsByMinute * (this.dureeFilm / 60)))}
  }
, dureeFilm:{
    get(){return this._dureeFilm||defP(this,'_dureeFilm', this.a.duree)}
  }
})
