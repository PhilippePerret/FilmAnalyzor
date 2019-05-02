'use strict'
Object.assign(HandTests,{
AppElements(){
  if(undefined===this._AppElements){
    this._AppElements = {
        'event':      {hname: 'event',      countMethod: 'FAEvent.count.bind(FAEvent)',         getMethod:FAEvent.get.bind(FAEvent)}
      , 'brin':       {hname: 'brin',       countMethod: 'FABrin.count.bind(FABrin)',           getMethod: FABrin.get.bind(FABrin)}
      , 'document':   {hname: 'document',   countMethod: FADocument.count.bind(FADocument),     getMethod: FADocument.get.bind(FADocument)}
      , 'personnage': {hname: 'personnage', countMethod: FAPersonnage.count.bind(FAPersonnage), getMethod: FAPersonnage.get.bind(FAPersonnage)}
    }
  }
  return this._AppElements
}
/**
  Méthodes qui doivent retourner le nombre d'éléments
**/
, getCount(element){
    let method = this.AppElements[element].countMethod
    if('string' === typeof method) method = eval(method)
    return method()
  }
})
