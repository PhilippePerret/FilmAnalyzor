'use strict'

Object.assign(PrevNext,{
  /**
    Cherche l'élément courant de type eType
    Mais fait beaucoup plus que ça : si les propriétés `__next` et
    `__prev` ne sont pas définies, la méthode les calcule, ce qui
    permettra de connaitre très rapidement les éléments précédents
    et suivant.
  **/
  searchCurrent(eType){
    console.log("Recherche du courant de type ",eType)
    let curTime = this.a.locator.currentTime.vtime
    switch (eType) {
      case STRevent: // recherche avec les Events
        if ( isEmpty(this.a.events) ) return
        // Si la liste des events n'est pas préparée, il faut la préparer
        isDefined(this.a.events[0].__index) || this.prepareListeEvents()
        var eFound
        this.a.forEachEvent( e => {
          if ( e.startAt < curTime && e.endAt > curTime ){
            eFound = e
            return false // pour interrompre la boucle
          }
        })
        return eFound
    }

  }
, searchNextOfType(eType){
    let curt = this.a.locator.currentTime.vtime
    switch (eType) {
      case STRevent:
        var eFound
        let len = FAEvent.count
        // Je cherche d'abord de 100 en 100
        for(var i = 0; i < len; i += 100){
          console.log("Recherche avec l'index : ", i)
          var e = this.a.events[i]
          if ( e.time > curt ) {
            eFound = e // c'est peut-être vraiment le suivant
            break
          }
        }
        // Je cherche de 10 en 10
        for (var i2 = i - 100; i2 < i + 100 ; i2 += 10){
          console.log("Recherche avec l'index : ", i2)
          var e = this.a.events[i2]
          if ( e.time > curt ) {
            eFound = e // c'est peut-être vraiment le suivant
            break
          }
        }
        // Finalement je cherche dans ce qui reste
        for (var i3 = i2 - 10; i3 < i2 + 10; ++i3){
          console.log("Recherche avec l'index : ", i3)
          var e = this.a.events[i3]
          if ( e.time > curt ) {
            eFound = e
            break
          }
        }

        //
        //
        // this.a.forEachEvent( e => {
        //   if ( e.startAt > curt ){
        //     eFound = e
        //     return false // pour interrompre la boucle
        //   }
        // })
        return eFound // peut être null
      case STRstt:
        throw new Error("Pas encore implémenté")
        break

    }
  }
, searchPrevOfType(eType){
    let curt = this.a.locator.currentTime.vtime
    switch (eType) {
      case STRevent:
        for(var i = FAEvent.count; i >= 0; --i){

        }
        break
      case STRstt:
        throw new Error("Pas encore implémenté")
        break
    }
  }

})
