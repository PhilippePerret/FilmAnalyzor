'use strict'


const Hash = {

/**
  Reçoit une table est la retourne en supprimant toutes les valeurs non
  définies.
  Une valeur non définie est :
  - une valeur null
  - une valeur undefined
  - une liste vide
  - une table sans clé

**/
  compact(h){
    var newH = {}, v
    for(var k in h){
      v = h[k]
      if(undefined === v || null === v) continue
      if(Array.isArray(v) && v.length == 0) continue
      if('object'===typeof(v) && Object.keys(v).length === 0) continue
      // Sinon, on peut prendre la valeur
      newH[k] = v
    }
    return newH
  }
}


module.exports = Hash
