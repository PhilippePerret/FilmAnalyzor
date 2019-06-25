'use strict'
/**
  Usine pour les events
**/

global.FITEvent = class {

static create(data){
  data = data || {}
  this.a = this.analyse = data.analyse || {}
  // Si le type n'est pas défini, on prend un type au hasard
  if ( !data.type ) {
    data.type = this.getAEventType()
  }
  // console.log("data.type = ", data.type)
  let className = `FITEvent${data.type.titleize()}`
  // console.log("Class name pour la création de l'event : ", className)
  let classe = window[className]
  return classe.create(data)
}

  static newId(){
    if ( undefined === this.lastId ) this.lastId = 0
    return ++ this.lastId
  }
  static getAEventType(){
    if ( undefined === this._eventTypes || this._eventTypes.length === 0 ){
      this._eventTypes = ['scene','dyna','note','idee','info','stt','proc','action','dialog']
      Array.shuffle(this._eventTypes)
    }
    return this._eventTypes.shift()
  }
  // Retourne un content aléatoire de longueur +len+
  static newContent(len){
    len = len || Math.rand(255)
    const frCar = Math.rand(1000)
    return String.LoremIpsum.substring(frCar, frCar + len).trim()
  }

  static getAssociates(analyse){
    return {} // pour le moment
    // TODO Implémenter
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
      id:         this.pData.id       || FITEvent.newId()
    , type:       this.type
    , time:       this.pData.time     || Math.rand(60*10)
    , titre:      this.pData.titre    || this.newTitre()
    , content:    this.pData.content  || this.c.newContent(100)
    , associates: this.associates
    }
  }
  return this._defdata
}

newTitre(len){
  var tit = `${(this.type||'Event').titleize()} à ${new Date().getTime()}`
  if (len && tit.length > len ) tit = tit.substring(0, len)
  return tit
}

get type(){return this.pData.type}
get associates(){return this.pData.associates || ( this.pData.associates = this.c.getAssociates(this.a))}
get c(){return this.constructor}
get a(){return this.c.a }
}
