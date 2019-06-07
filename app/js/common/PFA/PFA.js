'use strict'

const {
  DATA_STT_NODES
, MAIN_STT_NODES
, SUB_STT_NODES
} = require('./data_PFA')

const PFA_Calque = tryRequire('PFA-calque',__dirname)


class PFA {
/**
  Instanciation d'un paradigme de Field
**/
constructor(index){
  this.index = index

  this.inited = false
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
  isDefined(this.nodes) || ( this.nodes = new Map() )
  this.nodes.has(nid) || this.nodes.set(nid, new SttNode(nid, DATA_STT_NODES[nid]))
  return this.nodes.get(nid)
}

/**
  Boucle sur tous les noeuds structurels de ce PFA
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
save(){
  var my = this
  fs.writeFileSync(this.path, JSON.stringify(my.data), 'utf8')
  this.modified = false
}

get path(){return this._path || defP(this,'_path',this.a.pathOf(`pfa-${this.index}.json`))}
get iofile(){return this._iofile || defP(this,'_iofile', new IOFile(this))}
}

Object.assign(PFA.prototype, require('./PFA-calculs'))

Object.assign(PFA, {

// ---------------------------------------------------------------------
// Méthodes d'affichage
 toggle(){
    this.fwindow.toggle()
}
/**
  Afficher masquer le calque du PFA
**/
, toggleCalc(){ this.calque.toggle() }

, show(){
    this.fwindow.show()
  }
, hide(){
    this.fwindow.hide()
}
, update(){
    this.fwindow.update()
    if(this.fwindow.visible) this.show()
}

// ---------------------------------------------------------------------
//  Méthodes de construction

/**
 * Méthode principale de construction des PFA du film.
 */
, build(){
    return require('./PFA_building.js').bind(this)()
  }
// ---------------------------------------------------------------------
//  Méthodes de calculs

, observe(){
    // On colle un FATimeline
    var ca  = this.a
    var jqo = this.fwindow.jqObj
    var tml = new FATimeline(jqo[0])
    tml.init({height: 40, cursorHeight:262, cursorTop: -222, only_slider_sensible: true})
    // Dans le paradigme, on observe tous les events relatifs
    // pour pouvoir 1) les dragguer pour les placer dans d'autres
    // éléments et 2) les éditer en les cliquant.
    jqo.find('.event')
      .draggable({
        containment:STRdocument
      , helper: 'clone'
      , revert: true
      })
      .on(STRclick, function(e){
        var event_id = parseInt($(this).attr(STRdata_id),10)
        FAEvent.edit.bind(ca, event_id)()
        stopEvent(e)//sinon le pfa est remis au premier plan
      })
}
})
Object.defineProperties(PFA,{
  // Le 24ème de la durée du film, sert pour différentes
  // opérations.
  ieme24:{
    get(){
      return this._ieme24 || defP(this,'_ieme24', this.a.duree / 24)
    }
  }
, a:{
    get(){return this.analyse || current_analyse}
  }
, fwindow:{
    get(){return this._fwindow || defP(this,'_fwindow', new FWindow(this, {id: 'pfas'}))}
  }
, jqObj:{
    get(){return this._jqObj||defP(this,'_jqObj',$('#pfas'))}
  }
, modified:{
    get(){return this._modified}
  , set(v){this._modified = v}
}
, data:{
    get() { return this._data }
  , set(v){
      this._data = v
      // Il faut les dispatcher dans la donnée générale
      for(var kstt in v){
        DATA_STT_NODES[kstt].event_id = v[kstt].event_id
      }
    }
}
})


module.exports = PFA
