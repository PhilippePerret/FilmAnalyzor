'use strict'
/**
  Usine pour les events
**/

class FITEvent {
  static newId(){
    if ( undefined === this.lastId ) this.lastId = 0
    return ++ this.lastId
  }
  static random(max){
    let ran = Math.floor(Math.random() * Math.floor(max))
    console.log(`random(${max}) = ${ran}`)
    return ran
    // return Math.floor(Math.random() * Math.floor(max))
  }
  // Retourne un content aléatoire de longueur +len+
  static newContent(len){
    len = len || this.random(2000)
    const frCar = this.random(1000)
    return this.LoremIpsum.substring(frCar, frCar + len).trim()
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
    , content:  this.pData.content  || this.pData.description || this.c.newContent(100)
    , titre:    this.pData.titre    || this.c.newTitre()
    }
  }
  return this._defdata
}
get c(){return this.constructor}
get a(){return this.c.a }
}

// ---------------------------------------------------------------------
//  FITEventScene --- Factory à scènes

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
    numero = this.random(120)
  } while ( this.usedNumeros.has(numero) )
  this.usedNumeros.set(numero, true)
  return numero
}
static resetNumeros(){this.usedNumeros = new Map()}
// Pitch
static getAPitch(){
  this.restPitches            || this.resetPitches()
  this.restPitches.length > 0 || this.resetPitches()
  return this.restPitches.splice(this.random(this.restPitches.length),1)[0]
}
static resetPitches(){ this.restPitches = [...this.pitches] }
// Retourne une liste contenant un décor, un sous-décor, un lieu et un effet
static get EFFETS(){
  if ( undefined === this._EFFETS) this._EFFETS = ['jour', 'nuit', 'matin', 'soir']
  return this._EFFETS
}
static newDecorAndAll(){
  let [decor, sous_decors] = this.newDecor()
  let [sdecor, lieu] = sous_decors[this.random(sous_decors.length)].split(':')
  let effet   = this.EFFETS[this.random(4)]
  return [decor, sdecor, lieu, effet]
}
static newDecor(){
  this.decorKeys    || ( this.decorKeys   = Object.keys(this.decors))
  this.decorLen     || ( this.decorLen    = this.decorKeys.length )
  this.decorValues  || ( this.decorValues = Object.values(this.decors) )
  this.decor = this.decorKeys[this.random(this.decorLen)]
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


global.FITEventNote = class extends FITEvent {
  constructor(data){
    super(data)
  }
}


Object.defineProperties(FITEvent,{
  LoremIpsum:{get(){
    return `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean bibendum dolor sed mi mattis, eu porttitor purus venenatis. Proin posuere odio non eleifend molestie. Nullam eget est tempus metus sodales tincidunt et ac lectus. Nam lacinia urna sed leo eleifend egestas id ac nisi. Praesent scelerisque risus nec aliquet sollicitudin. Curabitur ut vehicula neque. Nullam sem sapien, ullamcorper sit amet ex vitae, vehicula semper nisl. Vivamus id orci tempor, accumsan enim quis, efficitur nulla. Pellentesque diam libero, pretium sit amet eros eu, pellentesque vulputate quam.

    Mauris gravida aliquet erat vel commodo. Curabitur id bibendum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lacus purus, vulputate non eros a, viverra accumsan nisi. Aenean sit amet mi in ligula ullamcorper facilisis. In fermentum efficitur molestie. Aliquam porta pharetra diam, nec lacinia nunc interdum a. Etiam consectetur, turpis sed congue viverra, arcu nulla vestibulum libero, eget aliquet turpis ex et nibh. Sed vitae velit et risus commodo cursus.

    Mauris eros leo, luctus sed luctus dignissim, rhoncus vitae nisi. Nulla massa ex, semper ac augue ut, pharetra consectetur dolor. In sagittis felis id velit mollis ornare. Duis aliquam tempor feugiat. Phasellus sit amet diam neque. Mauris fermentum efficitur risus, quis vehicula augue vulputate pellentesque. Maecenas urna erat, fringilla sagittis lobortis at, congue vel dolor. Donec purus ipsum, sollicitudin eu dolor et, mollis faucibus libero. Morbi eget dolor odio.

    Nulla sit amet gravida lectus. Integer malesuada condimentum lectus ut dignissim. Etiam sagittis sodales mi vitae accumsan. Nam libero urna, vestibulum sed tortor eu, venenatis finibus quam. Ut id lorem laoreet, porta justo at, cursus diam. In condimentum fringilla ante ac ullamcorper. Suspendisse sit amet dui libero. Vestibulum nec felis rhoncus, faucibus tellus id, ornare risus. Nullam in nibh at augue elementum cursus vitae ut nisi. Praesent quis elit porta, aliquet libero eget, aliquam orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum pulvinar quam, pulvinar lobortis nisl tincidunt vel. Morbi vitae est vel sapien varius ornare vitae sit amet dui. Integer volutpat diam quis velit porttitor, ac sollicitudin mi blandit. Duis turpis est, condimentum eget felis nec, iaculis aliquet quam. Quisque et ante at dolor dictum imperdiet.

    Phasellus sit amet lorem in purus viverra ultricies. Cras mollis faucibus urna, sed faucibus massa maximus in. Phasellus auctor sapien arcu, nec finibus quam pretium id. Nulla quis nibh sit amet tortor sodales blandit. Aenean et nunc velit. Nam purus erat, gravida et quam sed, molestie semper diam. Cras blandit efficitur velit vitae convallis. Suspendisse sit amet tempor nisi, vel tempus justo.

    Suspendisse porta eros ac malesuada sagittis. Cras mattis ipsum aliquet consectetur consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae neque semper, posuere neque nec, finibus tortor. Curabitur fermentum tincidunt nulla vel tempus. In non purus eleifend, congue lorem ut, egestas odio. Nullam in pulvinar dolor, quis sagittis nunc. Quisque pretium felis sit amet lorem dapibus suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque commodo lobortis ligula pharetra ornare. Cras malesuada enim molestie pellentesque eleifend.
    `
  }}
})
