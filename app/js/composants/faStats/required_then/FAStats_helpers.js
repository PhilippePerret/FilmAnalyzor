'use strict'
/**
  Méthodes d'helper
**/
Object.assign(FAStats.prototype,{

/**
  Retourne le div principal pour afficher les statistiques du propriété owner
**/
divStatistiques(opts){
  delete this._divpresence
  delete this._divpersonnages
  var divs = []
  divs.push(DCreate(H3,{inner:'Statistiques'}))
  this.divPresence() && divs.push(this.divPresence())
  this.divPersonnages() && divs.push(this.divPersonnages())
  // Le div complet des statistiques
  return DCreate(DIV,{class:'statistiques', append:divs})

}

, divPresence(){
    if(undefined === this._divpresence){
      try {
        this._divpresence = DCreate(DIV,{class:'stats-presence', append:[
          DCreate(H4,{inner:'Présence'})
        , DCreate(DIV,{append:[
            DCreate(LABEL,{inner:'Durée d’utilisation dans le film'})
          , DCreate(SPAN,{inner: `${this.tempsPresence()} (${this.pourcentagePresence()})`})
          ]})
        ]})
      } catch (e) {
        log.error(e)
        this._divpresence = null
      }
    }
    return this._divpresence
  }

, divPersonnages(){
    if(undefined === this._divpersonnages){
      try {
        if(this.owner.personnages){
          this._divpersonnages = DCreate(DIV,{class:'stats-personnages',append:[
              DCreate(H4,{inner:'Personnages impliqués'})
            , DCreate(DIV,{append:[
                DCreate(LABEL,{inner:'Nombre'})
              , DCreate(SPAN,{inner: this.personnagesCount()})
              ]})
            , DCreate(DIV,{append:[
                DCreate(LABEL,{inner:'Liste'})
              , DCreate(SPAN,{inner: this.personnagesList()})
              ]})
          ]})
        }
      } catch (e) {
        log.error(e)
        this._divpersonnages = null
      }
    }
    return this._divpersonnages
  }

})
