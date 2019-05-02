'use strict'

// Pour écrire les messages de sortie console
function wError(msg, err_id){
  console.log('%c' + msg, 'color:red;font-weight:bold;')
  AnalyseChecker.addError.bind(AnalyseChecker)(msg, err_id)
}
function wWarm(msg){
  console.log('%c' + msg, 'color:orange;')
}
function wNotice(msg){
  console.log('%c' + msg, 'color:green;')
}

Object.defineProperties(FAEvent.prototype,{
  ref:{get(){return this._ref || defP(this,'_ref', this.spanRef().innerHTML)}}
})
Object.assign(FAEvent.prototype,{
  checkAll(){
    wNotice(`   - ${this.ref}`)
    this.checkBalisesEvents()
    this.checkBalisesScenes() // il ne doit plus y en avoir
    this.checkBalisesDocuments()
    this.checkBalisesBrins()
    this.checkDiminutifs()
  }
, forEachTextProperties(method){
    for(var tprop of this.constructor.TEXT_PROPERTIES){
      if(!this[tprop]) continue
      if(false === method(this[tprop])) break
    }
  }

// ---------------------------------------------------------------------

, checkBalisesEvents(){
    this.forEachTextProperties(val => this.checkBalisesEventsIn(val))
  }
, checkBalisesScenes(){
    this.forEachTextProperties(val => this.checkBalisesScenesIn(val))
  }
, checkBalisesDocuments(){
    this.forEachTextProperties(val => this.checkBalisesDocumentsIn(val))
  }
, checkBalisesBrins(){
    this.forEachTextProperties(val => this.checkBalisesBrinsIn(val))
  }
, checkDiminutifs(){

  }
// ---------------------------------------------------------------------

, checkBalisesEventsIn(str){
    let res
    if(!(res = str.match(FATexte.defineRegExpTag('event')))) return
    let event_id = parseInt(res.groups.event_id,10)
    if(!FAEvent.get(event_id)){
      return wError(`L'event #${event_id} associé à ${this.ref} est inconnu.`, 2)
    }
  }
, checkBalisesScenesIn(str){
    let res
    if(!(res = str.match(FATexte.defineRegExpTag('scene')))) return
    return wError(`${this.spanRef.outerHTML} : les balises scène ({{scene:...}} ne doivent plus exister.)`, 1)
  }
, checkBalisesDocumentsIn(str){
    let res
    if(!(res = str.match(FATexte.DOC_REGEXP))) return
  }
, checkBalisesBrinsIn(str){
    let res
    if(!(res = str.match(FATexte.BRIN_REGEXP))) return
  }
})

const AnalyseChecker = {
  CORRECTIONS:{
    1: {aide: 'Elles doivent être remplacées par des balises {{event:<ID>|Scène <NUMERO>}}'}
    // Event introuvable, inconnu, peut-être détruit, dans une balise dans le texte
  , 2: {aide: 'On peut passer en revue les events manquants et les reconstruire. Ou détruire la balise de liaison.'}
    // Event associé (pas dans le texte) inconnu
  , 3: {aide: 'Il faut dissocier les events manquants ou les reconstruire.'}
    // Mauvais numéro de scène
  , 4: {aide: 'Il faut lancer l’outil de renumérotation des scènes.'}
  }
//
, addError(msg, err_id){
    if(undefined === this._errors) this._errors = []
    this._errors.push([{message:msg, error_id:err_id}])
  }
/**
  Méthode principale permettant de checker l'analyse +analyse+

  @param {FAnalyse} analyse   Analyse à checker (celle courante)

**/
, checkAll(analyse){
    this.a = this.analyse = analyse
    console.clear()
    try {
      this.checkAllEvents()
      this.checkAllScenes()
    } catch (e) {
      wError(e)
    } finally {
      var err, herr = {}
      if(this._errors){
        console.log('%c--- LISTE DES ERREURS ---', 'font-weight:bold;font-size:1.2em;')
        for(err of this._errors){
          console.log('%c'+err.message)
          if(this.CORRECTIONS[err.error_id]) herr[err.error_id] = true
        }
      }
      // Les aides
      if(Object.keys(herr).length){
        console.log('%c--- AIDE ---', 'font-weight:bold;font-size:1.2em;')
        for(var err_id of Object.keys(herr)){
          console.log('%c'+this.CORRECTION[err_id].aide, 'font-size:0.85em;')
        }
      }
      F.notify("J'ai procédé au check de l'analyse courante. Les résultats se trouvent dans la console.")
    }
  }
//
, checkAllEvents(){
    wNotice('* CHECK DES EVENTS')
    this.a.events.map(ev => ev.checkAll())
  }
//
, checkAllScenes(){
    wNotice('* CHECK DES SCÈNES')
    var next_numero_expected = 1
    this.a.events.map(ev => {
      if(!ev.isScene || !ev.isRealScene) return
      wNotice(`  - Check de la scene ${ev.ref} (numéro ${ev.numero})`)
      if(ev.numero != next_numero_expected){
        wError(`Le numéro de la scène ${ev.ref} est invalide (${ev.numero} au lieu de ${next_numero_expected})`, 4)
      } else {
        ++next_numero_expected
      }
    })
  }
//
}

module.exports = function(){
  AnalyseChecker.checkAll(this)
}
