'use strict'

const MAX_TIMEOUT = 5000 // 5 secondes


const DOMTEST = {
    MAX_TIMEOUT: 10000
  , exists: function(domId){
      // console.log(DGet(domId))
      return null !== this.DGet(domId)
    }
  , DGet: function(domId){
      return document.querySelector(domId)
      // return document.getElementById(domId)
    }
}

/**
 *
 * @asynchrone
 */
window.assert_DomExists = function(domId, options){
  var waitingTime = 0
  var timerInterval
  if (undefined === options) options = {}

  var endFunction = function(res, options){
    clearInterval(timerInterval)
    assert(
        res
      , `L'élément DOM ${domId} existe`
      , `L'élément DOM ${domId} est introuvable.`
      , options
    )
  }
  return new Promise((ok,ko) => {
    timerInterval = setInterval(function(){
      // console.log("-> Je test l'existence de ", domId)
      // console.log("DOMTEST.DGet", domId, DOMTEST.DGet(domId))
      // console.log("DOMTEST.exists(domId):", DOMTEST.exists(domId))
      if (DOMTEST.exists(domId)) {
        endFunction(true, options)
        ok() // pour poursuivre
      } else {
        // On poursuit la boucle
        waitingTime += 300
        if ( waitingTime > DOMTEST.MAX_TIMEOUT){
          endFunction(false, options)
          ko()
        }
      }
    }, 300)
  })
}

/**
 * @asynchrone
 */
window.assert_not_DomExists = function(domId, options){
  var waitingTime = 0
  var timerInterval
  if (undefined === options) options = {}

  var endFunction = function(res, options){
    clearInterval(timerInterval)
    assert(
        res
      , `OK, il n'y a pas/plus d'élément ${domId} dans la page`
      , `Hum… il ne devrait pas/plus y avoir d'élément ${domId} dans la page`
      , options
    )
  }
  return new Promise((ok,ko) => {
    timerInterval = setInterval(function(){
      // console.log("-> Je test l'existence de ", domId)
      // console.log("DOMTEST.DGet", domId, DOMTEST.DGet(domId))
      // console.log("DOMTEST.exists(domId):", DOMTEST.exists(domId))
      if (DOMTEST.exists(domId) == false) {
        endFunction(true, options)
        ok() // pour poursuivre
      } else {
        // On poursuit la boucle
        waitingTime += 300
        if ( waitingTime > DOMTEST.MAX_TIMEOUT){
          endFunction(false, options)
          ko()
        }
      }
    }, 300)
  })
}


window.assert_text = function(nodes, expected, strict){
  if(undefined == nodes[0]){nodes = [nodes]}
  var nod, len, i = 0, txt, rg_expect ;
  if(!strict){
    rg_expect = new RegExp(RegExp.escape(expected),'i');
  }
  for(i,len=nodes.length;i<len;++i){
    nod     = nodes[i];
    actual  = nod.innerHTML;
    if(strict){
      condition = expected == actual;
    } else {
      condition = !!actual.match(rg_expect);
    }
    assert(
      condition,
      `Le nœud #${nod.id} contient bien « ${expected} »`,
      `Le nœud #${nod.id} devrait contenir « ${expected} » (il contient « ${actual} »)`
    );
  }
};
// Pour vérifier que des éléments DOM sont bien positionnés
//
// +hposition+ doit contenir {x:, y: h:, w:} au choix
//
const TEST_XPROP_TO_REAL_PROP = {
'x': 'left', 'y': 'top', 'h': 'height', 'w': 'width'
}
window.assert_position = function(nodes, hposition, tolerance){
  if(undefined == tolerance){ tolerance = 0};
  if(undefined == nodes[0]){nodes = [nodes]}
  var node, i = 0, errs, valNode ;
  var asserted = false ; // mis à true si effectivement on teste
  for(i,len=nodes.length;i<len;++i){
    node = nodes[i];
    // Pour savoir si on va devoir dire juste "positionné" (1) ou "dimensionné" (2) ou
    // les deux (3)
    var bittest = 0 ;
    errs = new Array();
    for(var prop in hposition){
      expect  = hposition[prop];
      prop    = TEST_XPROP_TO_REAL_PROP[prop] || prop ;
      if(['left','top'].includes(prop)){bittest = bittest | 1};
      if(['width','height'].includes(prop)){bittest = bittest | 2};
      [valNode, unit] = valueAndUnitOf(node.style[prop]);
      if(tolerance > 0){
        if(valNode >= (expect - tolerance) && valNode <= (expect + tolerance)){continue};
      } else if (node.style[prop] == expect){
        continue;
      } else if(valNode >= expect && valNode <= expect){
        continue;
      };
      errs.push(`le ${prop} de #${node.id} devrait être "${expect}", il vaut "${node.style[prop]}"`);
    }
    if(bittest == 3){msg = 'positionné et dimensionné'}
    else{msg = bittest & 1 ? 'positionné' : 'dimensionné' }
    assert(
      errs.length == 0,
      `le node #${node.id} est bien ${msg}`,
      errs.join(', ')
    );
    asserted = true ;
  }//fin de boucle sur les nodes
  if (!asserted){
    console.error('LE TEST NE S’EST PAS FAIT : aucun node trouvé sans doute.');
    Tests.nombre_failures ++ ;
  }
};
// Inverse de la précédente
window.assert_not_position = function(nodes, hposition, tolerance){
if(undefined == tolerance){ tolerance = 0};
if(undefined == nodes[0]){nodes = [nodes]};
var i = 0, errs, valNode ;
var asserted = false ; // mis à true si effectivement on teste
for(i,len=nodes.length;i<len;++i){
  node = nodes[i];
  errs = new Array();
  toutes_identiques = true ; // on suppose qu'il est à la position testée
  for(var prop in hposition){
    expect  = hposition[prop];
    prop    = TEST_XPROP_TO_REAL_PROP[prop] || prop ;
    valNode = parseInt(node.style[prop].replace(/[a-z]/g,''));
    if(valNode < (expect - tolerance) && valNode > (expect + tolerance)){
      toutes_identiques = false;
      break;
    };
  }
  if (toutes_identiques) {
    errs.push()
  }
  assert(
    toutes_identiques == false,
    `le node #${node.id} est bien positionné hors des coordonnées fournies`,
    `le node #${node.id} est situé dans les coordonnées transmises`
  );
  asserted = true ;
}//fin de boucle sur les nodes
if (!asserted){
  console.error('LE TEST NE S’EST PAS FAIT : aucun node trouvé sans doute.');
  Tests.nombre_failures ++ ;
}
};

window.assert_visible = function(domId){
assert(
  $(`${domId}`).is(':visible') == true,
  `Le champ ${domId} est bien visible`,
  `Le champ ${domId} devrait être visible`
);
};
window.assert_notVisible = function(domId, options){
  assert(
      $(`${domId}`).is(':visible') == false
    , `Le champ ${domId} n’est pas visible`
    , `Le champ ${domId} ne devrait pas être visible`
    , options
  );
}
