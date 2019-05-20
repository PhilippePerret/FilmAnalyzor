'use strict'

module.exports = {
/**
  Méthode qui reçoit un nombre de pixels +x+ correspondant à une coordonnée
  dans le ban de timeline et retourne le temps correspondant en fonction :
    - du zoom appliquée, de la position 0 de la timeline (son scroll horizontal)
**/
  p2t(x){

    // On ajoute le scroll éventuel de la bande
    x += this.scrollX
    return (x * this.coefP2T()).round(2)
  }
, t2p(t){
    return (t * this.coefT2P()).round(2) - this.scrollX
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CALCUL

, coefP2T(){
    return this._coefp2t || defP(this,'_coefp2t', (this.a.duree / this.width ) / this.zoom)
  }

, coefT2P(){
    return this._coeft2p || defP(this,'_coeft2p', (this.width / this.a.duree) * this.zoom)
}


}
