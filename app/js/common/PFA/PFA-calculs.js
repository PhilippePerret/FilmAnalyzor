'use strict'
/**
  Extension pour PFA pour les calculs
**/
const NodeTblTimes = function(node, absRel){
  return {
    start:  node[`startAt${absRel}`]
  , end:    node[`endAt${absRel}`]
  , name:   node[absRel==='Abs'?'hname':'shortHname'].toUpperCase()
  , node:   node
  }
}

const PFA_calculs = {

/**
* Méthode qui calcule toutes les dimensions d'après la largeur voulue
**/
  calcDimsFor(larg){
    // console.log(`PFA.calcDimsFor(larg = ${larg})`)
    this.quart  = this.qu = larg / 4
    this.tiers  = this.ti = larg / 3
    this.moitie = this.mo = larg / 2
    this.troisquart = 3 * this.quart
    this.totalWidth  = larg
}

/**
  Retourne le noeud dramatique absolu qui se trouve avant ou après le temps time
**/
, absNodeBefore(time) {
    return this.absNodeAround(time, false /* node before */)
  }
, absNodeAfter(time){
    return this.absNodeAround(time, true /* => node after */)
  }

, absNodeAround(time, after) {
    isFunction(time.updateSeconds) && ( time = time.rtime )
    time = time.round(2)
    console.log("Temps courant comparé aux noeuds absolus : ", time)
    for (var [knode, node] of this.absNodes) {
      console.log("Comparaison node.startAtAbs", node.startAtAbs)
      if ( node.startAtAbs > time ) {
        console.log("LE TEMPS ABSOLU EST SUPÉRIEUR. JE REVOIS LE ", after ? 'NOEUD' : 'NOEUD AVANT', after ? node : node.previous)
        return after ? node : node.previous
      }
    }
  }

/**
  Méthode qui définit TimesTables qui va
  contenir simplement les temps des parties et des
  zones pour le suivi du film.

  Cf. l'utilisation dans le locator ou le contrôleur pour se déplacer de
  section en section, de noeud en noeud.
**/
, setTimesTables(){
    var kstt, dnode, node, ktable

    this.TimesTables = {
      'Mains-Abs': []
    , 'Subs-Abs': []
    , 'Mains-Rel': []
    , 'Subs-Rel': []
    }

    for(kstt in DATA_STT_NODES){
      dnode = DATA_STT_NODES[kstt]
      node  = this.node(kstt)
      if(dnode.main === true){
        // Les actes
        this.TimesTables[`Mains-Abs`].push(NodeTblTimes(node,'Abs'))
        if (node.event_id) this.TimesTables[`Mains-Rel`].push(NodeTblTimes(node,'Rel'))
      } else {
        // Les zones
        this.TimesTables[`Subs-Abs`].push(NodeTblTimes(node,'Abs'))
        if (node.event_id) this.TimesTables[`Subs-Rel`].push(NodeTblTimes(node,'Rel'))
      }
    }
  }


}// Fin de l'export

module.exports = PFA_calculs
