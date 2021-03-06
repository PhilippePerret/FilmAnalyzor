'use strict'
/**
  Les méthodes "show" qui permettent d'afficher les events, les documents ou les temps
**/

// Permet de se rendre au temps réel voulu
function showTime(time){
  current_analyse.locator.setTime(new OTime(time))
}

// Permet d'éditer ou d'afficher l'event voulu (pour le moment, de l'éditer)
function showEvent(event_id){
  let ev = FAEvent.get(event_id)
  ev.reveal()
}

// Permet d'éditer un document
function showDocument(dtype, doc_id){
  current_analyse.editDocument(dtype, doc_id)
}

// Permet de se rendre à une scène donnée
function showScene(numero){
  current_analyse.locator.setTime(FAEscene.getByNumero(numero).otime)
}

// Permet de voir le brin
function showBrin(brin_id){
  current_analyse.displayBrins(brin_id/*TODO : mettre en exergue ce brin-là*/)
}

// Permet de voir un personnage
function showPersonnage(perso_id, e){
  e && stopEvent(e)
  current_analyse.togglePanneauPersonnages(true, perso_id)
  return false
}
