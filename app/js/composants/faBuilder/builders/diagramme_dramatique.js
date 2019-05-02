'use strict'

module.exports = function(options){
  let my = this
  my.log("* Construction du diagramme dramatique")
  let str = ''
  str += '<h1 id="diagramme_dramatique-title">Diagramme dramatique</h1>'
  str += '<section id="diagramme_dramatique">'
  str += my.generalDescriptionOf('diagramme_dramatique')
  str += QRDBuilder.output({format: 'html'})
  str += '</section>'
  return str
}


class QRDBuilder {

// ---------------------------------------------------------------------
//  CLASS

static get GRAPHIC_HEIGHT() {return 200}
static get GRAPHIC_WIDTH()  {return 600}

static output(options){
  if(undefined === options) options = {}

  // Dans un premier temps, on définit, pour chaque scène,
  // quelles sont ses questions et ses réponses dramatiques.
  var tranches = [null]

  // On fait autant de tranches que de scènes
  FAEscene.forEachScene(function(sc){
    tranches.push({n: sc.numero, q:[], r:[]})
  })

  // On place les qrd dans leur scène
  FAEqrd.forEachSortedQRD(function(ev){
    if(ev.isComplete() == false) return
    tranches[ev.sceneQ.numero].q.push(ev)
    tranches[ev.sceneQ.numero].r.push(ev)
  })

  // +Tranches+ contient chaque scène, avec ses questions et ses
  // réponses dramatiques. On retire le premier élément qui a
  // juste permis à simplifier le code
  tranches.shift()
  console.log("tranches:",tranches)

  // On doit calculer l'intensité max
  let intensiteMax = 0 // TODO : À CALCULER
  var curIntensite = 0
  for(var tr of tranches){
    curIntensite += tr.q.length
    if(curIntensite > intensiteMax) intensiteMax = curIntensite
    curIntensite -= tr.q.length
  }
  // console.log("intensiteMax=", intensiteMax)

  // On en fait des div
  var divsTranches = []
    , hT, hB
  let coefScene     = this.GRAPHIC_WIDTH / FAEscene.count
    , coefIntensite = this.GRAPHIC_HEIGHT / intensiteMax
    , sceneWidth    = Math.floor(coefScene)
  curIntensite = 0
  for(var tr of tranches){
    curIntensite += tr.q.length
    hB = Math.round(curIntensite * coefIntensite)
    hT = this.GRAPHIC_HEIGHT - hB
    console.log({
      hB:hB, hT: hT
    })
    divsTranches.push(DCreate('DIV', {
      class: 'GDtr', style: `left:${Math.round((tr.n - 1) * coefScene)}px;width:${sceneWidth}px;`, append:[
        DCreate('DIV', {class:'GDtrT', style:`height:${hT}px;`})
      , DCreate('DIV', {class:'GDtrB', style:`height:${hB}px;`, attrs:{title: `Scène ${tr.n}. Intensité courante : ${curIntensite}`}})
      ], attrs:{onclick: `showScene(${tr.n})`}
    }))
    // L'intensité baisse d'autant de réponses données
    curIntensite -= tr.r.length
  }

  var div = DCreate('DIV', {
    class: 'graphic-drama', append: divsTranches, style:`width:${this.GRAPHIC_WIDTH}px;height:${this.GRAPHIC_HEIGHT + 10}px;`
  })
  if(options.format === 'html'){
    return div.outerHTML
  } else {
    return div
  }
}

}
