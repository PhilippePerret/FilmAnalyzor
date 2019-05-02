'use strict'

const PFA = require('./PFA-mini')
Object.assign(PFA, require('./PFA-calculs'))
Object.assign(PFA, {
  class: 'PFA'
, inited: false

, init(){
    var my = this
    this.load()
    this.forEachNode(node => {
      if(node.next) {
        my.node(node.next)._previous = node.id
        this.DATA_STT_NODES[node.next]._previous = node.id
      }
      if(node.first){
        my.node(node.first)._last = node.id
        this.DATA_STT_NODES[node.first]._last = node.id
      }
    })
    // console.log("DATA APRES:", Object.assign({}, this.DATA_STT_NODES))
    this.inited = true
    my = null
}
// ---------------------------------------------------------------------
//  Méthodes de données

  // /**
  //  * Retourne l'instance SttNode du noeud d'identifiant +nid+
  //  *
  //  * Note : +nid+ est une des clés de DATA_STT_NODES (cf. ci-dessus)
  //  */
, node(nid){
    if(undefined === this.nodes) this.nodes = {}
    if(undefined === this.nodes[nid]){
      this.nodes[nid] = new SttNode(nid, this.DATA_STT_NODES[nid])
    }
    return this.nodes[nid]
  }

  /**
  * Boucle sur tous les nœuds structurels
  *
  * On peut interrompre la boucle en renvoyant false (et très exactement
  * false)
  **/
, forEachNode(method){
    var kstt
    for(kstt in this.DATA_STT_NODES){ if (false === method(this.node(kstt))) break}
}

// ---------------------------------------------------------------------
//  Méthodes d'entrée sorties
, saveIfModified(){
    this.modified && this.save()
  }

, save(){
    var my = this
    fs.writeFileSync(this.a.pfaFilePath, JSON.stringify(my.data), 'utf8')
    this.modified = false
  }
, load(){
    if(fs.existsSync(this.a.pfaFilePath)){
      this.data = require(this.a.pfaFilePath)
      // console.log("data PFA:", this.data)
    } else {
      this.getDataInEvents()
    }
}

// ---------------------------------------------------------------------
// Méthodes d'affichage
, toggle(){
    this.fwindow.toggle()
}
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
 * Méthode principale de construction du PFA du film.
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
        containment:'document'
      , helper: 'clone'
      , revert: true
      })
      .on('click', function(e){
        var event_id = parseInt($(this).attr('data-id'),10)
        ca.editEvent.bind(ca, event_id)()
        stopEvent(e)//sinon le pfa est remis au premier plan
      })
}

, getDataInEvents(){
    // console.log("-> PFA.getDataInEvents")
    var my = this
      , corrected = false
      , data = {}
    this.a.forEachEvent( ev => {
      // console.log("Traitement de l'ev", ev.id)
      if(ev.type === 'stt'){
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
        this.DATA_STT_NODES[kstt].event_id = v[kstt].event_id
      }
    }
}
})


module.exports = PFA
