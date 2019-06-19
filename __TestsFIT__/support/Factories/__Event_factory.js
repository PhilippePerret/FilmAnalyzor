'use strict'
/**
  Usine pour les events
**/

global.FITEvent = class {

  static create(analyse, data){
    this.a = this.analyse = analyse
    data = data || {}
    // Si le type n'est pas défini, on prend un type au hasard
    if ( !data.type ) {
      data.type = this.getAEventType()
    }
    let className = `FITEvent${data.type.titleize()}`
    console.log("Class name pour la création de l'event : ", className)
    let classe = window[className]
    Object.assign(data, {analyse:analyse})
    return classe.create(data)
  }

  static newId(){
    if ( undefined === this.lastId ) this.lastId = 0
    return ++ this.lastId
  }
  static getAEventType(){
    if ( undefined === this._eventTypes ) this._eventTypes = ['scene','dyna','note','idee','info','stt','procede','action','dialog']
    if ( undefined === this._nombreeventtypes) this._nombreeventtypes = this._eventTypes.length
    return this._eventTypes[Math.rand(this._nombreeventtypes)]
  }
  // Retourne un content aléatoire de longueur +len+
  static newContent(len){
    len = len || Math.rand(255)
    const frCar = Math.rand(1000)
    return String.LoremIpsum.substring(frCar, frCar + len).trim()
  }
  static newTitre(len){
    const tit = `Event à ${new Date().getTime()}`
    if (len && tit.length > len ) tit = tit.substring(0, len)
    return tit
  }
// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  this.pData = data || {} // pData pour "Provided Data"
}
// Les données telles qu'elles sont enregistrées dans le fichier
get data(){ return this.defaultData }
get defaultData(){
  if (undefined === this._defdata) {
    this._defdata = {
      id:       this.pData.id       || this.c.newId()
    , time:     this.pData.time     || this.c.random(60*10)
    , titre:    this.pData.titre    || this.c.newTitre()
    , content:  this.pData.content  || this.pData.description || this.c.newContent(100)
    , associates: this.pData.associates || null
    }
  }
  return this._defdata
}
get c(){return this.constructor}
get a(){return this.c.a }
}
