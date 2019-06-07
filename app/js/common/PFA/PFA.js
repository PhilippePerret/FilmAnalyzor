'use strict'

// const {
//   DATA_STT_NODES
// , MAIN_STT_NODES
// , SUB_STT_NODES
// } =
tryRequire('data_PFA', __dirname)

class PFA {
/**
  Instanciation d'un paradigme de Field
**/
constructor(index){
  this.index = index
  this.shown  = false // pas affiché
  this.inited = false // pas initié
}

/**
  Initialisation du PFA
**/
init(){
  var my = this
  this.load()
  this.forEachNode(node => {
    if(node.next) {
      my.node(node.next)._previous = node.id
      DATA_STT_NODES[node.next]._previous = node.id
    }
    if(node.first){
      my.node(node.first)._last = node.id
      DATA_STT_NODES[node.first]._last = node.id
    }
  })
  // console.log("DATA APRES:", Object.assign({}, this.DATA_STT_NODES))
  this.inited = true
  my = null
}

/**
  Retourne l'instance SttNode du nœud d'identifiant +nid+
  @param {String} nid   Clé dans DATA_STT_NODES
**/
node(nid){
  let my = this
  isDefined(this.nodes) || ( this.nodes = new Map() )
  this.nodes.has(nid) || this.nodes.set(nid, new SttNode(nid, my))
  return this.nodes.get(nid)
}

/**
  Boucle sur tous les noeuds structurels de ce PFA
  Attention, il faut tenir compte du fait qu'il n'est peut être pas défini.
**/
forEachNode(fn){
  var kstt
  for(kstt in DATA_STT_NODES){
    if (isFalse(fn(this.node(kstt)))) break // pour pouvoir interrompre
  }
}

/**
  Chargement des données PFA du paradigme courant

  Si on ne trouve pas les données dans le fichier `pfa-<index>.json` (si le
  fichier n'existe pas), on va les récupérer éventuellement dans les events
  de type `stt` définis grâce à la méthode `getDataInEvents`.

**/
load(){
  if(fs.existsSync(this.path)){
    this.data = require(this.path)
  } else {
    this.getDataInEvents()
  }
}

/**
  On récupère les données PFA dans les events de type `stt`
**/
getDataInEvents(){
  // console.log("-> PFA.getDataInEvents")
  var my = this
    , corrected = false
    , data = {}
  this.a.forEachEvent( ev => {
    // console.log("Traitement de l'ev", ev.id)
    if(ev.type === STRstt && ev.idx_pfa === this.index ){
      // <= Un event de type structure a été trouvé
      // => Il faut le prendre en compte
      corrected = true
      data[ev.sttID] = {event_id: ev.id, stt_id: ev.sttID}
    }
  })
  this.data = data
  corrected && this.save()
  // console.log("data relevées : ", data)
  return data
}

saveIfModified(){ this.modified && this.save() }
save(forcer){
  if ( isNotTrue(forcer) && this.a.locked ) return F.notify(T('analyse-locked-no-save'))
  var my = this
  fs.writeFileSync(this.path, JSON.stringify(my.data), 'utf8')
  this.modified = false
}

get path(){return this._path || defP(this,'_path',this.a.pathOf(`pfa-${this.index}.json`))}
// get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
}

Object.assign(PFA.prototype, tryRequire('PFA-calculs', __dirname))
Object.assign(PFA.prototype, tryRequire('PFA-display', __dirname))

Object.defineProperties(PFA.prototype,{
  // Le 24ème de la durée du film, sert pour différentes
  // opérations.
  ieme24:{
    get(){ return this._ieme24 || defP(this,'_ieme24', this.a.duree / 24)}
  }
, a:{ get(){return this.analyse || current_analyse} }
, jqObj:{ get(){return this._jqObj||defP(this,'_jqObj',$(`#${this.domId}`))} }
, domId:{get(){return this._domid || defP(this,'_domid', `pfa-${this.index}`)}}
, modified:{
    get(){return this._modified}
  , set(v){this._modified = v}
}
, data:{
    get() {
      isUndefined(this._data) && isFalse(this.inited) && this.init()
      return this._data
    }
  , set(v){ this._data = v }
}
})

module.exports = PFA
