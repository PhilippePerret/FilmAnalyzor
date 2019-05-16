'use strict'
Object.assign(HandTests,{
AppElements(){
  if(undefined===this._AppElements){
    this._AppElements = {}
    this._AppElements[STRevent] = {hname: STRevent,      countMethod: 'FAEvent.count.bind(FAEvent)',         getMethod:FAEvent.get.bind(FAEvent)}
    this._AppElements[STRbrin]  = {hname: STRbrin,       countMethod: 'FABrin.count.bind(FABrin)',           getMethod: FABrin.get.bind(FABrin)}
    this._AppElements[STRdocument]  = {hname: STRdocument,   countMethod: FADocument.count.bind(FADocument),     getMethod: FADocument.get.bind(FADocument)}
    this._AppElements[STRpersonnage]  = {hname: STRpersonnage, countMethod: FAPersonnage.count.bind(FAPersonnage), getMethod: FAPersonnage.get.bind(FAPersonnage)}
  }
  return this._AppElements
}
/**
  Méthodes qui doivent retourner le nombre d'éléments
**/
, getCount(element){
    let method = this.AppElements[element].countMethod
    if(isString(method)) method = eval(method)
    return method()
  }
})
