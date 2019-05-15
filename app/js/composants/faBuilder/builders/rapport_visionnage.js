'use strict'
/**

  Construction d'un rapport de visionnage de film

**/
module.exports = function(options){
  let my = this
  my.log("* Construction du rapport de visionnage du film…")
  let str = ''
  str += '<h1 id="brins-title">Rapport de visionnage</h1>'
  // str += my.generalDescriptionOf('rapport_visionnage')
  str += new RapportVisionnageBuilder(current_analyse).output({format:'html'})
  return str
}

class RapportVisionnageBuilder {
constructor(analyse){
  this.analyse = this.a = analyse
}
/**
  Pour procéder à ce rapport, on va :
    1. rassembler tous les éléments (notes, scènes, infos, etc.)
    2 les classer dans leur ordre d'arrivée
    3 les afficher dans le rapport
**/
output(options){
  return this.formateAllElements(options).outerHTML
}

formateAllElements(){
  var divs = []
    , div
  this.a.events.map(ev => {
    if(ev.type === 'scene'){
      div = ev.asShort({as:'dom', forBook:true})
    } else {
      div = ev.asBook({as:'dom'})
    }
    if(Array.isArray(div)){
      div = div.length == 0 ? null : ev.inItsDiv(div)
    }
    if(!div){
      console.error(`asBook de l'event ${ev} ne retourne aucun élément.`)
    } else {
      divs.push(div)
    }
  })
  let section = DCreate(SECTION,{id:'rapport-visionnage', class:'rapport-visionnage scenier', append:divs})
  divs = null
  return section
}


}// /class RapportVisionnageBuilder
