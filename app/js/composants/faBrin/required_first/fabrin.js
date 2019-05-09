'use strict'

class FABrin extends FAElement {

static get PROPS(){
  if(undefined === this._props){
    this._props = ['id','title', 'description','bType','associates']
  }
  return this._props
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
  this.type   = 'brin' // pour FAElement et les associations

}

reset(){
  delete this._scenes
}

}// /fin de FABrin
