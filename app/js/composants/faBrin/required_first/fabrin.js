'use strict'

class FABrin {
/**
  Instancie un nouveau brin

  @param {Object} dBrin   Les données du brin telles que récoltées dans le
                          fichier `dbrins.yaml` s'il existe.
**/
constructor(dbrin){
  this.a = current_analyse
  this.data   = dbrin
  this.numero = FABrin.newNumero()
  this.type   = 'brin' // cohérence avec event, document et times
  this.bType  = dbrin.bType // type de brin

  // --- Associés ---
  this.events     = this.events     || []
  this.documents  = this.documents  || []
  this.brins      = this.brins      || []
  this.times      = this.times      || []
}

dataEpured(){
  var h = {}
  for(var k in this.data){
    var v = this.data[k]
    if(v === null || v === undefined || (Array.isArray(v) && v.length == 0) || ('object' === typeof(v) && Object.keys(v).length == 0)) continue
    h[k] = v
  }
  return h
}

reset(){
  delete this._scenes
}

}// /fin de FABrin
