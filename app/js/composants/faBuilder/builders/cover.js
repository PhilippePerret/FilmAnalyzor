'use strict'

const {
  INFOSFILM_METHS
, INFOSFILM_PROPS
} = require(path.join(APPFOLDER,'app/js/tools/building/infos_film.js'))
Object.assign(InfosFilm.prototype, INFOSFILM_METHS)
Object.defineProperties(InfosFilm.prototype, INFOSFILM_PROPS)

module.exports = function(){
var str = ''

const inff = new InfosFilm()
if ( isUndefined(inff.data) ){
  my.report.add(T('export-infos-film-not-defined'), 'error')
  return 'INFOS FILM MANQUANTES'
}

return DCreate(DIV,{class:'cover',append:[
    DCreate(DIV,{class:'mainTitle', inner:inff.title})
  , DCreate(DIV,{class:'author', inner: inff.f_ecriture})
  , DCreate(DIV,{class:'div-analystes',append:[
      DCreate(LABEL,{inner:'Analysé par'})
    , DCreate(SPAN, {class:'analystes', inner:inff.f_analystes})
    ]})
  ]}).outerHTML

} // /function exportée
