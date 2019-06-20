'use strict'
/**
  Usine à fabriquer des scènes
**/

global.FITEventScene = class extends FITEvent {
constructor(pdata){
  super(pdata)
}
get data(){
  var [decor, sdecor, lieu, effet] = this.c.newDecorAndAll()
  return Object.assign(super.defaultData,{
      numero:     this.pData.numero     || this.c.getANumero()
    , titre:      this.pData.titre      || this.c.getAPitch()
    , decor:      this.pData.decor      || decor
    , sous_decor: this.pData.sous_decor || sdecor
    , effet:      this.pData.effet      || effet
    , lieu:       this.pData.lieu       || lieu
  })
}
// ---------------------------------------------------------------------
//  CLASS FITEventScene

static getANumero(){
  this.usedNumeros || this.resetNumeros()
  if ( this.usedNumeros.size === 119) this.resetNumeros()
  let numero
  do {
    numero = Math.rand(120)
  } while ( this.usedNumeros.has(numero) )
  this.usedNumeros.set(numero, true)
  return numero
}
static resetNumeros(){this.usedNumeros = new Map()}
// Pitch
static getAPitch(){
  this.restPitches            || this.resetPitches()
  this.restPitches.length > 0 || this.resetPitches()
  return this.restPitches.splice(Math.rand(this.restPitches.length),1)[0]
}
static resetPitches(){ this.restPitches = [...this.pitches] }
// Retourne une liste contenant un décor, un sous-décor, un lieu et un effet
static get EFFETS(){
  if ( undefined === this._EFFETS) this._EFFETS = ['jour', 'nuit', 'matin', 'soir']
  return this._EFFETS
}
static newDecorAndAll(){
  let [decor, sous_decors] = this.newDecor()
  let [sdecor, lieu] = sous_decors[Math.rand(sous_decors.length)].split(':')
  let effet   = this.EFFETS[Math.rand(4)]
  return [decor, sdecor, lieu, effet]
}
static newDecor(){
  this.decorKeys    || ( this.decorKeys   = Object.keys(this.decors))
  this.decorLen     || ( this.decorLen    = this.decorKeys.length )
  this.decorValues  || ( this.decorValues = Object.values(this.decors) )
  this.decor = this.decorKeys[Math.rand(this.decorLen)]
  return [this.decor, this.decors[this.decor]]
}
static get decors(){
  if (undefined === this._decors){
    this._decors = {
        'Maison':       ['Chambre:int', 'Salon:int', 'Garage:int', 'Jardin:ext', 'rue:ext', 'Cuisine:int', 'Terrasse:ext']
      , 'Entreprise':   ['Entrepôt:int', 'Accueil:int', 'Bureaux:int', 'Open-space:int']
      , 'Hôpital':      ['Accueil:int', 'Parking:ext', 'Chambre:int', 'Couloir:int', 'Parc:ext']
    }
  }
  return this._decors
}
static get pitches(){
  if (undefined === this._pitches){
    this._pitches = [
        'Il attend qu’elle appelle'
      , 'Il la guette en se cachant'
      , 'Il réfléchit, sombre.'
      , 'Il s’effondre en se tenant le ventre'
      , 'Il appelle un copain pour tout lui raconter'
      , 'Il répare l’objet, comme il peut'
      , 'Il s’habille, le plus sobrement possible'
      , 'Elle tourne en rond en attendant son coup de fil'
      , 'Elle l’aperçoit et se cache'
      , 'Elle appelle une copine pour toute lui raconter'
      , 'Elle cherche à cacher l’objet quelque part, en vain'
      , 'Ils se disputent'
      , 'Ils font l’amour'
      , 'Ils recherchent des preuves'
      , 'Ils se chamaillent gentiment'
      , 'Ils se retrouvent pour manger ensemble'
    ]
  }
  return this._pitches
}
static addDecors(hdecors){Object.assign(this.decors, hdecors)}
}
