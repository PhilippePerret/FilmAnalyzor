'use strict'

Object.assign(PrevNext.prototype,{
  goToNext(){
    // log.info("[PrevNext] Rejoindre l'élément suivant de type "+this.type)
    console.log("this.next:", this.next)
    this.next && this.a.locator.setTime(this.next.otime)
  }
, goToPrev(){
    // log.info("[PrevNext] Rejoindre l'élément précédent de type "+this.type)
    this.prev && this.a.locator.setTime(this.prev.otime)
  }

, searchNext(){
    // S'il y a un courant, il suffit de prendre son __next, sinon, il faut
    // le chercher par le temps.
    if (this.current) {
      return this.current.__next
    } else {
      return this.searchNextOfType(this.type)
    }
  }
, searchPrev(){
    // S'il y a un courant, il suffit de prendre son __prev, sinon, il faut
    // le chercher par le temps.
    if ( this.current ) {
      return this.current._prev
    } else {
      return this.searchPrevOfType(this.type)
    }
  }
})

Object.defineProperties(PrevNext.prototype,{
  current:{
    /**
      Définition de l'élément courant
    **/
    get(){
      isDefined(this._current) || this.constructor.searchCurrent(this.type)
      return this._current
    }
  , set(v){this._current = v}
  }
, next:{
    // Retourne l'élément suivant
    get(){
      return this._next || defP(this,'_next', this.current && this.current.__next)
    }
    // Définit l'élément suivant
  , set(v){ this._next = v}
  }
, prev:{
    // Retourne l'élément précédent
    get(){
      return this._prev || defP(this,'_prev', this.current && this.current.__prev)
    }
    // Définit l'élément précédent
  , set(v){ this._prev = v}
  }
, a:{get(){ return current_analyse }}
})
