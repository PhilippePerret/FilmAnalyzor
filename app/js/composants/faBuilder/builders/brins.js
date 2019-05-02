'use strict'
/**
  Module de construction des brins pour le livre
**/

module.exports = function(options){
  let my = this
  my.log("* Construction des brins du film…")
  let str = ''
  str += '<h1 id="brins-title">Brins du film</h1>'
  str += '<section id="brins">'
  str += my.generalDescriptionOf('brins')
  str += BrinsBuilder.output({format:'html'})
  str += '</section>'
  return str
}

const BrinsBuilder = {
/**
  Sortie générale du code des brins
**/
output(options){
  if(undefined === options) options = {}
  if(FABrin.count === 0) {
    log.warning('Construction du chapitre des BRINS demandée, mais aucun brin défini.')
    return '<span class="warning">[LES BRINS SONT À DÉFINIR]</span>'
  }
  var inner = []

  FABrin.forEachBrin(brin => inner.push(brin.asDiv({forBook: true})))
  inner = DCreate('UL', {class:'brins', append: inner})

  if(options.format === 'html'){
    return inner.outerHTML
  } else { // ou format 'dom'
    return inner
  }
}


}// /Fin BrinsBuilder
