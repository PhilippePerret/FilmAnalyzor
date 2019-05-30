'use strict'

Object.assign(Marker,{
  // Retourne un nouvel ID unique pour un marqueur
  newId(){
    isDefined(this.lastId) || ( this.lastId = 0 )
    return ++ this.lastId
  }
  
})
