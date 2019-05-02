'use strict'
/**

  Construction du Paradigme de Field Augmenté pour le livre

  Ce paradigme-là est vertical, contrairement au paradigme normal, et il
  est beaucoup plus littéraire.
  C'est une table avec en première colonne les grandes parties

**/

// Le constructeur de PFA
const PFABuilder = {
  class: 'PFABuilder'

, GRAPH_WIDTH: 688  // Largeur du graphique en pixels


/** ---------------------------------------------------------------------
  Construction du paradigme graphique
**/
, buildPFAgraph(pfa){
  var x, y, good

  // Pour conserver la liste des divergences entre le PFA absolu
  // et le PFA relatif et les afficher plus tard, plus bas
  this.divergences = []

  var nodesMainZonesAbs = []
  for(var kstt of pfa.MAIN_STTNODES){
    nodesMainZonesAbs.push(pfa.node(kstt).inAbsPFA(this.coefT2P, pfa.node(kstt).dim))
  }

  var nodesSubZonesAbs = []
  for(var kstt of pfa.SUB_STTNODES){
    nodesSubZonesAbs.push(pfa.node(kstt).inAbsPFA(this.coefT2P, pfa.node(kstt).dim))
  }
  var partsAndZones = [
      // === ABSOLUES ===
      DCreate('DIV', {class:'pfa-part-name', inner: 'EXPO.'})
    , DCreate('DIV', {class:'pfa-part-name', inner: 'DÉV Partie 1'})
    , DCreate('DIV', {class:'pfa-part-name', inner: 'DÉV Partie 2'})
    , DCreate('DIV', {class:'pfa-part-name', inner: 'DÉNOU.'})
    , DCreate('DIV', {id:'pfa-zones-main', class: 'pfa-zones',
        append:nodesMainZonesAbs})
    , DCreate('DIV', {id:'pfa-zones-sub', class: 'pfa-zones',
        append:nodesSubZonesAbs})
    // === RELATIFS (en fonction des définitions) ===
  ]

  // === RELATIFS (en fonction des définitions) ===
  var nodesMainZonesRel = []
  var pos
  for(var kstt of pfa.MAIN_STTNODES){
    // console.log("Traitement du noeud:", kstt)
    pos = this.posRelSttNode(kstt)
    if(pos.good == false) this.divergences.push(pos)

    // => On peut définir l'incident déclencheur
    // console.log("Placement du noeud:", kstt, pos)
    nodesMainZonesRel.push(
      DCreate('DIV', {
        class: `pfa-main-node-rel${pos.class}`
      , style: `left:${pos.left}px;width:${pos.width}px`
      , append:[ DCreate('SPAN', {inner: pfa.node(kstt).dim}) ]
      })
    )
  }
  var mainZonesDiv = DCreate('DIV',{id:'pfa-zones-main-rel', class:'pfa-zones',
    append:nodesMainZonesRel
  })
  partsAndZones.push(mainZonesDiv)
  mainZonesDiv = null

  var nodesSubZonesRel  = []
  for(var kstt of pfa.SUB_STTNODES){
    pos = this.posRelSttNode(kstt)
    if(pos.good == false) this.divergences.push(pos)
    // => On peut définir l'incident déclencheur
    nodesSubZonesRel.push(
      DCreate('DIV', {
        class: `pfa-sub-node-rel${pos.class}`
      , style: `left:${pos.left}px;width:${pos.width}px`
      , append:[ DCreate('SPAN', {inner: pfa.node(kstt).dim}) ]
      })
    )
  }

  var subZonesDiv = DCreate('DIV',{id:'pfa-zones-sub-rel', class:'pfa-zones',
    append:nodesSubZonesRel
  })
  partsAndZones.push(subZonesDiv)
  subZonesDiv = null

  if ( this.leftDev1() ){
    // => On peut définir l'exposition
    good = this.expoIsGood()
    if(!good) this.divergences.push(pos)
    partsAndZones.push(
      DCreate('DIV', {
        class: `pfa-part-name-rel${good?'':' wrong'}`
      , style: `left:0px;width:${this.leftDev1()}px`
      , inner: 'EXPO.'
      })
    )
  }
  if ( this.leftDev1() && this.leftDev2() ) {
    // => On peut définir le développement part 1
    x = this.leftDev1()
    y = this.leftDev2()
    good = this.dev1IsGood()
    if(!good) this.divergences.push(pos)
    partsAndZones.push(
      DCreate('DIV', {
        class: `pfa-part-name-rel${good?'':' wrong'}`
      , style: `left:${x}px;width:${y-x}px`
      , inner: 'DÉV Partie 1'
      })
    )
  }
  if ( this.leftDev2() && this.posDenou() ){
    // => On peut définir le développement part 2
    x = this.leftDev2()
    y = this.posDenou()
    good = this.dev2IsGood()
    if(!good) this.divergences.push(pos)
    partsAndZones.push(
      DCreate('DIV', {
        class: `pfa-part-name-rel${good?'':' wrong'}`
      , style: `left:${x}px;width:${y-x}px`
      , inner: 'DÉV Partie 2'
      })
    )
  }
  if ( this.posDenou() && this.leftFin() ){
    // => On peut définir le dénouement
    x = this.posDenou()
    y = this.leftFin()
    good = this.denouIsGood()
    if(!good) this.divergences.push(pos)
    partsAndZones.push(
      DCreate('DIV', {
        class: `pfa-part-name-rel${good?'':' wrong'}`
      , style: `left:${x}px;width:${y-x}px`
      , inner: 'DÉNOUE.'
      })
    )
  }
  var divGraph = DCreate('DIV', {
    id: 'pfa-graph-container',
    append: partsAndZones
  })

  partsAndZones = null

  return divGraph
}

/**
  Méthode qui construit la liste des divergences entre
  le PFA absolu et le paradigme relatif.
**/
, buildPFADivergences(){
  var divergencesListe = []
  var str
  for(var divergence of this.divergences){
    str = `– Nœud “${divergence.node.hname}” ${divergence.motif}`
    divergencesListe.push(DCreate('DIV',{inner: str}))
  }
  return DCreate('DIV',{
    id: 'pfa-divergences'
  , append: divergencesListe
  })
}
// ---------------------------------------------------------------------
//  Méthodes de calcul pour le paradigme graphique


  // Retourne {:left, :width, :good} de l'incident déclencheur
  // relatif s'il est défini.
  // Null dans le cas contraire.
, posRelSttNode(kstt){
  var isDefined = this.node(kstt).isDefined
  var start = this.node(kstt)[isDefined?'startAtRel':'startAtAbs']
  var end   = this.node(kstt)[isDefined?'endAtRel':'endAtAbs']
  var isGood = isDefined && this.node(kstt).isGood
  var motifBad

  if(isDefined){
    if(!isGood) motifBad = 'en dehors de sa zone absolue'
  } else {
    motifBad = 'non défini'
  }
  return {
    node:   this.node(kstt)
  , left:   Math.round(start * this.coefT2P)
  , width:  Math.round((end - start) * this.coefT2P)
  , good:   isGood
  , class:  isDefined ? (isGood ? '': ' wrong') : ' ghost'
  , motif:  motifBad
  }
}

  // Retourne true si l'exposition est bonne
  //  Elle est bonne si :
  //    -  Elle est à moins d'un 24e de durée du début
  //        de l'absolu
  //    - Elle ne chevauche pas la partie suivante (dev 1)
, expoIsGood(){
    // note : on ne passe par ici que si les données sont
    // suffisante pour afficher la partie
    var ok = this.posDev1().isCloseTo(this.node('DEV1').startAtAbs, this.ieme24)
    if (ok && this.getEventAtZone('EXPO') && this.getEventAtZone('DEV1')){
      ok = this.node('EXPO').endAtRel < this.node('DEV1').startAtRel
    }
    return ok
  }
  // Retourne true si le développement part 1 est bon
, dev1IsGood(){
    // note : on ne passe par ici que si les données sont
    // suffisante pour afficher la partie
    var ok = this.posDev1().isCloseTo(this.node('DEV1').startAtAbs, this.ieme24)
    ok = ok && this.posDev2().isCloseTo(this.node('DEV2').startAtAbs, this.ieme24)
    if(ok && this.getEventAtZone('DEV1') && this.getEventAtZone('DEV2')){
      ok = this.node('DEV1').endAtRel < this.node('DEV2').startAtRel
    }
    return ok
  }
  // Retourne true si le développement part 2 est bon
, dev2IsGood(){
    // note : on ne passe par ici que si les données sont
    // suffisante pour afficher la partie
    var ok = this.posDev2().isCloseTo(this.node('DEV2').startAtAbs, this.ieme24)
    ok = ok && this.posDenou().isCloseTo(this.node('DNOU').startAtAbs, this.ieme24)
    if(ok && this.getEventAtZone('DEV2') && this.getEventAtZone('DNOU')){
      ok = this.node('DEV2').endAtRel < this.node('DNOU').startAtRel
    }
    return ok
  }
  // Retourne true si le dénouement est bon
, denouIsGood(){
    // note : on ne passe par ici que si les données sont
    // suffisante pour afficher la partie
    var ok = this.posDenou().isCloseTo(this.node('DNOU').startAtAbs, this.ieme24)
    ok = ok && this.node('DNOU').endAtRel <= this.dureeFilm
    if(ok && this.getEventAtZone('DEV2') && this.getEventAtZone('DNOU')){
      ok = this.node('DEV2').endAtRel < this.node('DNOU').startAtRel
    }
    return ok
  }

// Pour le début du développement
// On peut le trouver :
//  - soit parce qu'il est défini explicitement
//  - soit parce que le pivot 1 est défini
, leftDev1(){return this._leftDev1||defP(this,'_leftDev1',this.calcLeftDev1())}
, calcLeftDev1(){
    if(this.posDev1()) return Math.round(this.posDev1() * this.coefT2P)
  }
, posDev1(){return this._posDev1||defP(this,'_posDev1',this.calcPosDev1())}
, calcPosDev1(){
    if(this.getEventOfZone('DEV1')) return this.node('DEV1').startAtRel
    else if (this.getEventOfZone('pivot1')) return this.node('pivot1').endAtRel
    else return null
}
, leftDev2(){return this._leftDev2||defP(this,'_leftDev2',this.calcLeftDev2())}
, calcLeftDev2(){
    if(this.posDev2()) return Math.round(this.posDev2() * this.coefT2P)
  }
, posDev2(){return this._posDev2||defP(this,'_posDev2', this.calcPosDev2())}
, calcPosDev2(){
    if(this.getEventOfZone('DEV2')) return this.node('DEV2').startAtRel
    else if (this.getEventOfZone('cledev'))return this.node('cledev').endAtRel
    else return null
}
, leftDenou(){return this._leftDenou||defP(this,'_leftDenou',this.calcLeftDenou())}
, calcLeftDenou(){
  console.log("this.getEventOfZone('DNOU'):", this.getEventOfZone('DNOU'))
  console.log("this.posDenou():", this.posDenou())
    if(this.posDenou()) return Math.round(this.posDenou() * this.coefT2P)
  }
, posDenou(){return this._posDenou||defP(this,'_posDenou', this.calcPosDenou())}
, calcPosDenou(){
    if(this.getEventOfZone('DNOU')) return this.node('DNOU').startAtRel
    else if (this.getEventOfZone('pivot2')) return this.node('pivot2').endAtRel
    else return null
}
, leftFin(){return this._leftFin||defP(this,'_leftFin', this.dureeFilm * this.coefT2P)}

// ---------------------------------------------------------------------
//  PARADIGME TEXTUEL
//
, buildPFAtext(pfa){
  var allDivs = [
      DCreate('DIV',{class:'pfa-part-name expo', append:[
        DCreate('SPAN', {inner:'EXPOSITION'})
      ]})
    , DCreate('DIV',{class:'pfa-part-name dev1', append:[
        DCreate('SPAN', {inner:'DÉV 1'})
      ]})
    , DCreate('DIV',{class:'pfa-part-name dev2', append:[
        DCreate('SPAN', {inner:'DÉV 2'})
      ]})
    , DCreate('DIV',{class:'pfa-part-name dnou', append:[
        DCreate('SPAN', {inner:'DÉNOUEMENT'})
      ]})
  ]
  var divZone
  for(var kstt in pfa.DATA_STT_NODES){
    var dstt = pfa.DATA_STT_NODES[kstt]
    if(dstt.main) continue
    divZone = DCreate('DIV', {
        class: `pfa-zone ${kstt}`
      , append: [
          DCreate('DIV', {class: `pfa-zone-name ${kstt}`, inner: `${dstt.hname}<br>(${dstt.dim})`})
        , DCreate('DIV', {class: `pfa-zone-desc ${kstt}`, inner: this.descriptionZone(kstt)})
        ]
    })
    allDivs.push(divZone)
  }

  // Le paradigme de field en version textuel
  return DCreate('DIV', {
    id:'pfa-container'
  , append: allDivs
  })

}
, build(pfa){

    this.pfa = pfa

    return DCreate('SECTION', {
      id: 'pfa'
    , append:[
        DCreate('H2', {inner: 'Paradigme de Field graphique'})
      , DCreate('DIV', {class: 'explication', inner: this.ExplicationPFAGraphique})
      , this.buildPFAgraph(pfa)
      , DCreate('H2', {inner: 'Divergences avec le paradigme absolu'})
      , this.buildPFADivergences()
      , DCreate('H2', {inner: 'Paradigme de Field textuel'})
      , DCreate('DIV', {class:'explication', inner:this.ExplicationPFATextuel})
      , this.buildPFAtext(pfa)
    ]
    })

}

// Retourne la description du noeud +zoneId+ (en compilant le titre,
// la description et la note de l'event.)
, descriptionZone(zoneId){
  var evt = this.getEventOfZone(zoneId)
  if(evt){
    // console.log("event:", this.pfa.a.getEventById(this.pfa.data[zoneId].event_id))
    var str = ''
    str = `<div class="titre">${evt.titre}</div>`
    str += `<div class="content">${evt.content}</div>`
    if(evt.note){str += `<div class="note">${evt.note}</div>`}
    return this.formater.formate(str)
  } else {
    return `Description de la zone ${zoneId}<br>INEXISTANTE.`
  }
}
, node(stt_id){return this.pfa.node(stt_id)}
, getEventOfZone(zoneId){
    if(this.pfa.data[zoneId]){
      return this.pfa.a.getEventById(this.pfa.data[zoneId].event_id)
    } else {
      return null
    }
}

}// /PFABuilder
Object.defineProperties(PFABuilder,{
  a:{get(){return this.pfa.a}}
, coefT2P:{
    get(){return this._coefT2P || defP(this,'_coefT2P', this.GRAPH_WIDTH / this.dureeFilm)}
  }
, formater:{
    get(){return this._formater||defP(this,'_formater', new FATexte(''))}
  }
, dureeFilm:{
    get(){return this._dureeFilm||defP(this,'__dureeFilm', this.pfa.a.duree)}
  }
, ieme24:{get(){return this.pfa.ieme24}}
, ExplicationPFAGraphique:{get(){
    return `
<div>Le <em>Paradigme de Field Graphique</em> permet de voir de façon
graphique la position des parties — des actes — et des scènes
clés du film.</div>
<div>En haut se trouve le <em>Paradigme Absolu</em>, avec les positions
absolues des éléments, tandis qu'en dessous, en miroir, est
exposé le <em>Paradigme Relatif</em> correspondant au film « ${this.a.title} ».</div>

    `
  }}
, ExplicationPFATextuel:{get(){
    return `
<div>Le <em>Paradigme de Field Textuel</em> présente les parties et les
scènes-clés en les décrivant et en les explicitant par rapport au film.</div>
    `
}}
})

module.exports = function(options){
  var my = this // FABuilder

  // Note : on doit se servir de l'objet PFA pour le faire
  my.log("* Construction du paradigme de Field Augmenté…")

  var pfa = my.a.PFA

  let str = ''
  str += '<h1 id="section-pfa">Paradigme de Field Augmenté du film</h1>'
  str += '<!-- TODO : lien version explication -->'
  str += '<section id="pfa">'
  str += my.generalDescriptionOf('pfa')
  str += PFABuilder.build(pfa).outerHTML
  str += '</section>'

  return str
}
