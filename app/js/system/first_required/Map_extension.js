'use strict'

// Profill de la méthode filter
/**
  @param {Function} fn  La fonction de filtrage, qui reçoit en premier argument
                        l'élément de la Map.
  @return {Array} Liste des éléments filtrés
**/
Map.prototype.filter = function(fn) {
  var arr = []
  this.forEach(e => { if( isTrue( fn(e)) ) arr.push(e) })
  return arr
}
