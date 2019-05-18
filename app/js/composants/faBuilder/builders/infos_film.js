'use strict'

module.exports = function(options){
  let my = this
  my.log("* Construction des infos du film…")

// Noter que c'est strictement le même code que celui utilisé pour
// afficher les informations dans l'application, avec 'CMD-ALT-MAJ-i'
if(NONE === typeof(InfosFilm) || NONE === typeof(INFOSFILM_METHS)){
  const {
    INFOSFILM_METHS
  , INFOSFILM_PROPS
  } = require(path.join(APPFOLDER,'app/js/tools/building/infos_film.js'))
  Object.assign(InfosFilm.prototype, INFOSFILM_METHS)
  Object.defineProperties(InfosFilm.prototype, INFOSFILM_PROPS)
}

  const inff = new InfosFilm()

  if ( isUndefined(inff.data) ){
    my.report.add(T('export-infos-film-not-defined'), 'error')
    return ''
  }

  let str = ''
  str += '<h1 id="infos-film-title">Informations techniques</h1>'
  str += DCreate(SECTION, {id:'infos-film', append: inff.buildBody()}).outerHTML
  return str
}
