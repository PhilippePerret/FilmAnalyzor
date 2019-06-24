'use strict'

require(path.join(Tests.appPath,'app/js/common/PFA/data_PFA.js')) //=> DATA_STT_NODES

global.FITEventStt = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventStt(data)
}
/**
  Return un ID de noeud structurel

  Note : contrairement aux autres valeurs, on donne celles-ci dans l'ordre,
  même si les éléments peuvent être créés dans le désordre (si aucun temps
  n'est fourni)
**/
static getASttId(){
  isDefined(this._sttIds) || ( this._sttIds = Object.keys(DATA_STT_NODES) )
  return this._sttIds.shift()
}
static getAIdxPfa(){
  if ( isUndefined(this._lastIdxPfa) ) {
    this._lastIdxPfa = 1
  } else {
    if ( this._sttIds && this._sttIds.length == 0 ){
      // Si le last idx est défini mais qu'on a récupéré tous les
      // noeud structurels, il faut passer à l'index suivant
      // Note : cela permet d'avoir 4 x 18 (types sttNode) possibilités
      // pour les events de type stt, donc 7é
      ++ this._lastIdxPfa
      this._sttIds = Object.keys(DATA_STT_NODES)
    }
  }
  return this._lastIdxPfa
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'stt'
  super(data)
  this.pData = data
  this.pData.idx_pfa  || ( this.pData.idx_pfa = this.constructor.getAIdxPfa() )
  this.pData.sttID    || ( this.pData.sttID = this.constructor.getASttId())
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
      type:     'stt'
    , idx_pfa:  this.pData.idx_pfa
    , sttID:    this.pData.sttID
  })
}


}
