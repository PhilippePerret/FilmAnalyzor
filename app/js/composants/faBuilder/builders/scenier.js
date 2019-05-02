'use strict'

module.exports = function(options){
  // Note : on doit se servir de l'objet PFA pour le faire
  var my = this
  my.log("* Construction du scénier du film…")
  my.report.add('Construction du scénier du film…', 'title')
  let str = ''
  str += '<h1 id="scenier-title">Scénier</h1>'
  str += '<section id="scenier">'
  str += my.generalDescriptionOf('scenier')
  FAEscene.forEachSortedScene(function(scene){ str += scene.as('book', FORMATED|LINKED, options)})
  str += '</section>'
  return str
}
