'use strict'

module.exports = function(options){
  let my = this
  my.log("* Construction des infos du film…")
  // Noter que c'est strictement le même code que celui utilisé pour
  // afficher les informations dans l'application, avec 'CMD-ALT-MAJ-i'
  const FAInfosFilm = require(path.join(APPFOLDER,'app/js/tools/building/infos_film.js'))

  let str = ''
  str += '<h1 id="infos-film-title">Informations techniques</h1>'
  str += '<section id="infos-films">'
  str += DCreate('DIV', {append: (new FAInfosFilm(my.a)).buildBody()}).innerHTML
  str += '</section>'
  return str
}
