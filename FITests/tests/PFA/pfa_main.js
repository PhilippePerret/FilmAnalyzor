'use strict'
/**
 * Tests généraux du paradigme (object PFA)
 */

// Sous forme de constantes
const DUREE = 5400
const QUART = 1350
const TIERS = 1800
const MOITI = 2700
const HUITI = 675
const DOUZI = 450
const IEM24 = 225


var t = new Test("Objet PFA, Paradigme de Field Augmenté")

t.case("Méthodes", () => {
  assert_property('PFA',current_analyse, {success:'PFA est une propriété de l’analyse courante'})
  assert_function('node', current_analyse.PFA, {success: '`node` est une méthode PFA'})
})

t.case("node permet de récupérer un noeud structurel valide", () => {
  // On définit quelques valeurs pour l'analyse courante
  current_analyse.filmStartTime = 0
  current_analyse.filmEndTime   = DUREE

  assert_equal(DUREE, current_analyse.duree, {success: false, failure:`La durée du film devrait être 5400, elle vaut ${current_analyse.duree}`})
  // === Test ===
  var expo  = current_analyse.PFA.node('EXPO')
  var dev1  = current_analyse.PFA.node('DEV1')
  var dev2  = current_analyse.PFA.node('DEV2')
  var dnou  = current_analyse.PFA.node('DNOU')

  // === Vérifications ===

  assert_match(
    [0, QUART], expo.zone,
    {success: "La zone de l'exposition a bien été définie", failure: `La zone de l'exposition devrait être [0, ${QUART}], elle vaut [${expo.zone.join(', ')}]`}
  )
  assert_match(
    [QUART,MOITI], dev1.zone,
    {success: "La zone du développement est bien définie", failure: `la zone du développement Part 1 devrait être [${QUART}, ${MOITI}], elle vaut [${dev1.zone.join(', ')}]`}
  )
  assert_match(
    [MOITI,3*QUART], dev2.zone,
    {success: "La zone du développement est bien définie", failure: `la zone du développement Part 1 devrait être [${MOITI}, ${3*QUART}], elle vaut [${dev2.zone.join(', ')}]`}
  )
  assert_match(
    [3*QUART,DUREE], dnou.zone,
    {success: "La zone du développement est bien définie", failure: `la zone du développement Part 1 devrait être [${3*QUART}, ${DUREE}], elle vaut [${dnou.zone.join(', ')}]`}
  )
})


t.case("La zone d'un nœud qui dépend d'un autre nœud est bien calculé", ()=>{

  current_analyse.filmStartTime = 0
  current_analyse.filmEndTime   = DUREE

  var pfa = current_analyse.PFA

  /**
   * Par exemple, la zone de la zone de refus commence après l'incident déclencheur et
   * se termine au pivot 1. En l'absence de ces noeuds, des valeurs alternatives sont
   * choisies
   */
   var zrefus = pfa.node('zone_r')

   assert_match(
     [QUART-DOUZI, QUART], zrefus.zone,
     {
       success:"La zone de refus est bien calculée, avec ses valeurs par défaut",
       failure: `La zone de refus devrait être [${QUART-IEM24-IEM24}, ${QUART}], elle vaut [${zrefus.zone.join(', ')}]`
     }
   )

   // Maintenant, on affecte les noeuds incident déclencheur et pivot 1 pour
   // voir la zone changer
   pfa.node('incDec').endAtAbs   = HUITI
   pfa.node('pivot1').startAtAbs = QUART + 11
   var expected = [HUITI, QUART + 11]
   zrefus = pfa.node('zone_r')
   assert_match(
     expected, zrefus.zone,
     {
       success: "La zone de la zone de refus a bien été calculée avec des incidents définis",
       failure: `La zone de la zone de refus a mal été calculée avec des incidents définis. Expected: [${expected.join(', ')}], Actual: [${zrefus.zone.join(', ')}]`
     }
   )
})
