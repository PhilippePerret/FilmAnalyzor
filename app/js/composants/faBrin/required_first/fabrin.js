'use strict'

class FABrin extends FAElement {

static get TEXT_PROPERTIES(){return ['title', 'description']}
static get PROPS(){
  if(undefined === this._props){
    this._props = ['id','title', 'description','bType','associates']
  }
  return this._props
}

static edit(brin_id, e){
  if(e) stopEvent(e) // cf. note N0001
  if(NONE === typeof(DataEditor)) return this.a.loadDataEditor(this.edit.bind(this,brin_id))
  DataEditor.open(this, brin_id)
}

/**
  Instancie un nouveau brin

  @param {Object} dBrin   Les données du brin telles que récoltées dans le
                          fichier `dbrins.yaml` s'il existe.
**/
constructor(dbrin){
  super(dbrin)
  this.a = current_analyse
  this.data   = dbrin
  this.numero = FABrin.newNumero()
  this.type   = STRbrin // pour FAElement et les associations

}

reset(){
  delete this._scenes
}

}// /fin de FABrin
