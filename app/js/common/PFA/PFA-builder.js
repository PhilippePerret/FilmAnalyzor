'use strict'
/**
  Extention pour la construction des PFA

  Attention : il ne s'agit pas de la construction des PFA dans le livre mais
  de la construction pour visualisation.

  Note : le PFA remplace la Timeline dans le banc-timeline.

**/

class PFABuilder {
/**
  Instanciation du builder, avec l'instance {PFA} courante
**/
constructor(pfa){
  this.pfa = pfa
}

/**
* Retourne le code du PFA absolu
**/
get absolutePFA(){
  return DCreate(SECTION,{
    class: `pfa-absolute`
  , append: [
        DCreate(DIV,{class:'part part-expo', inner:'exposition'})
      , DCreate(DIV,{class:'part part-dev1', inner:'développement part 1'})
      , DCreate(DIV,{class:'part part-dev2', inner:'développement part 2'})
      , DCreate(DIV,{class:'part part-dnou', inner:'dénouement'})
      , this.divAbsZones(STRtop)
      , this.divAbsZones(STRbottom)
  ]})
}
get relativePFA(){
  return DCreate(SECTION,{
    class: `pfa-relative`
  , append: [
      this.divRelZones(STRbottom)
    , this.divRelZones(STRtop)
    , this.divRelParts
  ]})
}

// Retourne les styles propres, calculés en fonction du film
get styles(){
  return DCreate(LINK, {
    attrs: {rel: "stylesheet", media: 'screen', href: './js/common/PFA/PFA.css'}
  })
}

get divAbsParts(){
  var div = this.divParts('Abs')
  return div
}
get divRelParts(){
  var div = this.divParts('Rel')
  return div
}

divParts(dimT /* 'Abs' ou 'Rel'*/ ){
  var div, zoneId, node, span
  div = DCreate(DIV, {
      id:    `pfa-${this.pfa.index}-div-parts-${dimT}`
    , class: 'pfa-div-parts'
    , style: `width:${this.totalWidth}px;`
  })
  for(zoneId of this.partsIds){
    node = this.pfa.node(zoneId)
    span = node[`in${dimT}PFA`](this.coefT2P)
    span && div.appendChild(span)
  }
  node = null
  return div
}

/**
* Il y a deux lignes de zones, une supérieure avec les nœuds les plus
* importants et une ligne en dessous avec les noeuds moindres
**/
divAbsZones(which){
  var div = this.divZones('Abs', which)
  return div
}
divRelZones(which){
  var div = this.divZones('Rel', which)
  return div
}
divZones(dimT, which){
  var div
    , zoneId
    , span
    , pfa = this.pfa
    , zoneIds = which === STRtop ? MAIN_STT_NODES : SUB_STTNODES
    , spans = []
    ;

  // Fabrication du noeud, soit dans le paradigme absolu avec
  // la méthode `SttNode.inAbsPFA` soit dans le relatif avec
  // la méthode `SttNode.inRelPFA` définies dans l'instance
  // SttNode.
  for(zoneId of zoneIds){
    span = pfa.node(zoneId)[`in${dimT}PFA`](this.coefT2P)
    span && spans.push(span)
  }

  return DCreate(DIV, {
    id:     `pfa-${pfa.index}-div-zones-${dimT}-${which}`
  , class:  'div-pfa-zones'
  , append: spans
  })
}

get coefT2P(){return this._coefT2P||defP(this,'_coefT2P',this.totalWidth/this.duree)}
get duree(){return this.a.duree}
get partsIds() {return this._partsIds || this.defineIds().parts}
get zonesIds() {return this._zonesIds || this.defineIds().zones}
get a(){return this.pfa.a}
get totalWidth(){return this.pfa.totalWidth}

/**
  Définit la liste des identifiants des zones principales (parties, partsIds)
  et la liste des identifiants des autres zones (zonesIds)
**/
defineIds(){
  var ps = [], zs = [], kstt, dstt
  for(kstt in DATA_STT_NODES){
    DATA_STT_NODES[kstt].main ? ps.push(kstt) : zs.push(kstt)
  }
  this._partsIds = ps
  this._zonesIds = zs
  return {parts: ps, zones: zs}
}

}// /class PFABuilder

// Doit retourner les éléments à ajouter à la flying-window,
// dans le build()
module.exports = PFABuilder
