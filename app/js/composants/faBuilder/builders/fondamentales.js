'use strict'

module.exports = function(options){
  var my = this
  if(!my.a.Fonds.exists()) return ''
  my.log("* Construction des Fondamentales")
  my.report.add('Construction des Fondamentales', 'title')
  let str = ''
  str += '<h1 id="fontamentales-title">Fondamentales</h1>'
  str += '<section id="fondamentales">'
  str += my.generalDescriptionOf('fondamentales')
  str += my.a.Fonds.export()
  str += '</section>'
  return str
}
