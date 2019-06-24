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
    verbe:'contient',comp_verbe:'dans event.json', objet:`${JSON.stringify(expected)}`
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

constructor(analyse){
  super('L’analyse courante')
  this.a = analyse
  Object.assign(this.assertions,{
    is_modified: this.is_modified.bind(this)
  })
}

}

Object.defineProperties(global,{
  CurrentAnalyse:{get(){return new CurrentAnalyseFITSubject(current_analyse)}}
})
