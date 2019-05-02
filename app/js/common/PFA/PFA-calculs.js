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

module.exports = {

/**
  Méthode qui définit TimesTables qui va
  contenir simplement les temps des parties et des
  zones pour le suivi du film.
  Cf. l'utilisation dans le locator.
**/
setTimesTables(){
  var kstt, dnode, node, ktable

  this.TimesTables = {
    'Mains-Abs': []
  , 'Subs-Abs': []
  , 'Mains-Rel': []
  , 'Subs-Rel': []
  }

  for(kstt in this.DATA_STT_NODES){
    dnode = this.DATA_STT_NODES[kstt]
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
  // console.log("this.TimesTables:", this.TimesTables)
}


}// Fin de l'export
