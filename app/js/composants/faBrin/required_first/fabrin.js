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

  // --- Associés ---
  this.events     = this.events || []
  this.documents  = this.documents || []
  this.brins      = this.brins || []
  this.times      = this.times || []
}

reset(){
  delete this._scenes
}

}// /fin de FABrin
