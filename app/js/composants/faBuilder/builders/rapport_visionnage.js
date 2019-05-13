'use strict'
/**

  Construction d'un rapport de visionnage de film

**/
module.exports = function(options){
  let my = this
  my.log("* Construction du rapport de visionnage du film…")
  let str = ''
  str += '<h1 id="brins-title">Rapport de visionnage</h1>'
  str += '<section id="rapport-visionnage">'
  // str += my.generalDescriptionOf('rapport_visionnage')
  str += new RapportVisionnageBuilder().output({format:'html'})
  str += '</section>'
  return str
}

class RapportVisionnageBuilder {

/**
  Pour procéder à ce rapport, on va :
    1. rassembler tous les éléments (notes, scènes, infos, etc.)
    2 les classer dans leur ordre d'arrivée
    3 les afficher dans le rapport
**/
output(option){
  return '<div>Je suis le rapport de visionnage</div>'
}


}// /class
