'use strict'
/**
  Le sujet complexe CurrentAnalyse
**/

class CurrentAnalyseFITSubject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(CurrentAnalyse).is_modified(options)
  @description Produit un succès si l'analyse courante est marquée modifiée
  @provided
    :options {Object} Les [options classiques des assertions](#options_assertions)
 */
is_modified(options){
  let resultat = this.newResultat({
    verbe:'est', comp_verbe:'marquée modifiée', options:options
  })
  resultat.validIf(this.a.modified === true)
  return assert(resultat)
}

/*
  @method expect(CurrentAnalyse).contains_in_events_file(expected,options)
  @description Produit un succès si le fichier events.json de l'analyse contient un enregistrement qui correspond au hash +expected+ (analysé avec o(hash).contains(expected))
  @provided
    :expected {Object} Un dictionnaire contenant les valeurs à comparer (et seulement les valeurs à comparer, par exemple l'identifiant et le type)
    :options {Object} Table des [options classiques des assertions](#options_assertions)
  @usage expect(CurrentAnalyse).contains_in_events_file({id:12,type:'note'},{onlyFailure:true})
 */
contains_in_events_file(expected, options){
  let resultat = this.newResultat({
    verbe:'contient',comp_verbe:'dans son fichier event.json', objet:`un object contenant ${JSON.stringify(expected)}`
    , options:options
  })
  const hevents = JSON.parse(fs.readFileSync(this.a.eventsFilePath,'utf8'))
  var eventFound = false
  // console.log("hevents:",hevents)
  for (var hevent of hevents){
    if ( o(hevent).contains(expected,{onlyReturn:true}) ) { // il a été trouvé
      // console.log("On l'a trouvé : ", he)
      eventFound = true
      break
    }
  }
  resultat.validIf(eventFound)
  return assert(resultat)
}

// /Assertions
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
//  PUBLIC METHODS

getEvent(event_id){
  return this.byId.get(event_id)
}


// ---------------------------------------------------------------------
constructor(analyse){
  super('L’analyse courante')
  this.a = analyse
  Object.assign(this.assertions,{
      is_modified: this.is_modified.bind(this)
    , contains_in_events_file: this.contains_in_events_file.bind(this)
  })
}

/**
  Retourne la liste Array des CurrentAnalyseEvent de l'analyse
**/
get events(){
  if ( undefined === this._events ){
    this._events = []
    current_analyse.events.forEach(ev => this._events.push(new CurrentAnalyseEvent(this,ev)))
  }
  return this._events
}
/**
  Retourne la liste des events (Map) avec en clé l'identifiant de l'event
  et en valeur son instance CurrentAnalyseEvent
**/
get byId(){
  if ( undefined === this._byid ){
    this._byid = new Map()
    this.events.forEach( cae => this._byid.set(cae.id, cae) )
    // console.log("this._byid = ", this._byid)
  }
  return this._byid
}

}

Object.defineProperties(global,{
  CurrentAnalyse:{get(){return new CurrentAnalyseFITSubject(current_analyse)}}
})
