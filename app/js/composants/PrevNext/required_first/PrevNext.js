'use strict'
/**
  Object qui permet de faciliter le déplacement d'éléments précédents
  en éléments suivant, en les consignant.
**/
class PrevNext {
static init(){
    PrevNext.goto = PrevNext.goto.bind(PrevNext)
    this.items = {}
  }
  /**
    Méthode principale qui permet de rejoindre l'élément +eDir+ ('prev'/'next')
    de type +eType+ (p.e. 'event', 'stt')
  **/
static goto( eType, eDir ) {
    return this[eDir](eType)
  }

static next(eType){
  this.items[eType] || new PrevNext(eType)
  this.items[eType].goToNext()
}

static prev(eType){
  F.notify("Rejoindre l'élément précédent de type "+eType)
}

static get a(){return current_analyse}

constructor(eType){
  this.type = eType
  PrevNext.items[this.type] = this
}

}

PrevNext.init()
