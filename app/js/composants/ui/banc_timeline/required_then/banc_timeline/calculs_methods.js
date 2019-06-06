'use strict'

Object.assign(BancTimeline,{
/**
  Méthode qui calcule la rangée d'un event
**/
/**
  Méthode qui reçoit un nombre de pixels +x+ correspondant à une coordonnée
  dans le ban de timeline et retourne le temps correspondant en fonction du
  zoom appliqué.
**/
  p2t(x){
    return (x * this.coefP2T()).round(2)
  }
, t2p(t){
    // console.log({
    //   operation: 't2p'
    // , 'temps donné': t
    // , 'coefficiant T2P': this.coefT2P()
    // , return: Math.round(t * this.coefT2P())
    // })
    return Math.round(t * this.coefT2P())
  }
// ---------------------------------------------------------------------
//  MÉTHODES DE CALCUL

, coefP2T(){
    return this._coefp2t || defP(this,'_coefp2t', this.calcCoefP2T())
  }
, coefT2P(){ return this._coeft2p || defP(this,'_coeft2p', this.calcCoefT2P())}

// ---------------------------------------------------------------------
// Méthodes de calculs

, calcCoefP2T(){
    let duree = UI.video.duration
      , coef  = ( duree / this.width ) / this.zoom
    return coef
  }

, calcCoefT2P(){
    log.info('-> BancTimeline::calcCoefT2P')
    let duree = UI.video.duration
    try {
      this.width    || raise('la largeur du banc est nulle.')
      this.a.duree  || raise('La durée du film est nulle.')
      this.zoom     || raise('Le zoom du banc est nul.')
      // Le calcul
      this._coeft2p = (this.width / duree) * this.zoom
    } catch (e) {
      raise(`Impossible de calculer le coefficiant BancTimeline time2pixels : ${e}`)
    }
    // console.log({
    //   operation:'Calcul coef T2P (temps -> pixels)'
    // , width: this.width
    // , zoom: this.zoom
    // , duree: duree
    // , coefficiant: this._coeft2p
    // })
    return this._coeft2p
  }


})
