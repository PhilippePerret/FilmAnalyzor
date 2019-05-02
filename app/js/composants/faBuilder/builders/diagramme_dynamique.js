'use strict'
/**
  Le DIAGRAMME DYNAMIQUE présente les éléments dynamique narratifs,
  c'est-à-dire la triade des objectifs, obstacles, conflits au cours
  du récit.
**/
module.exports = function(options){
  let my = this
  my.log("* Construction du diagramme dynamique")
  let str = ''
  str += '<h1 id="diagramme_dynamique-title">Diagramme dynamique</h1>'
  str += '<section id="diagramme_dynamique">'
  str += my.generalDescriptionOf('diagramme_dynamique')
  // TODO Faire le diagramme à partir des events dynamiques (utilise le filtre universel)
  str += '</section>'
  return str
}
