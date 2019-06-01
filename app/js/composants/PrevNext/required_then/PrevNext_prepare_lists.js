'use strict'

Object.assign(PrevNext,{
  /**
    Préparation de la liste des events
    Définition de la propriété __index, __prev et __next de chaque event
  **/
  prepareListeEvents(){
    log.info('-> PrevNext::prepareListeEvents')
    var i = 0, len = this.a.events.length ;
    for(;i<len;++i) {
      var e = this.a.events[i]
      e.__index = parseInt(i,10)
      e.__next  = this.a.events[i+1]
      e.__prev  = this.a.events[i-1]
    }
    log.info('<- PrevNext::prepareListeEvents')
  }
})
