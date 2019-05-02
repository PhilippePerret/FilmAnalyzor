'use strict'
/*

assert_equal(expected, actual, options)
  Produit un succès si l'expression actual est égale à l'expression expected

*/

window.assert_equal = function(expected, actual, options){
  if ('object' === typeof expected){
    if (Array.isArray(expected)) throw("Pour tester l'égalité d'une liste Array, il faut utiliser l'assertion `assert_match`.")
    else throw("Pour tester l'égalité d'un Object, il faut utiliser l'assertion `assert_match`.")
  }
  assert(
      actual === expected
    , `${actual} is equal to ${expected}`
    , `${actual} should equal ${expected}`
    , options
  )
}

/**
 * Produit un succès si les deux premiers arguments correspondent.
 *
 * +options+
 *  :strict   Si true, c'est une égalité parfaite. Dans le cas contraire,
 *            par exemple pour une table, il faut simplement que les clés
 *            définies dans +expected+ se retrouvent avec les mêmes valeurs
 *            dans la table +actual+ (mais +actual+ peut avoir d'autres clés)
 *  :values_strict    Si true, et que +expected+ est une table, les valeurs
 *            doivent être strictement égales. Cela permet de vérifier que
 *            "1" n'est pas égal à 1
 */
window.assert_match = function(
      expected
    , actual
    , options
  ){
  if (undefined === options) options = {}

  var errs = [], ok, sok

  if (options.strict){
    ok = expected === actual
    if (!ok) errs = ['Les deux choses sont strictement différentes']
  } else {
    switch (typeof expected) {
      case 'object':
        if(expected instanceof Object){
          var hstrict = options.values_strict ? 'strictement ' : ''
          for(var k in expected){
            if(undefined === actual[k]){
              errs.push(`La clé ${k} est inconnu dans le tableau`)
            } else {
              if (options.values_strict){
                sok = expected[k] === actual[k]
              } else {
                sok = expected[k] == actual[k]
              }
              if (sok == false){
                errs.push(`${k} devrait valoir ${hstrict}${expected[k]}, elle vaut ${actual[k]}`)
              }
            }
          }
          ok = errs.length === 0
        } else {
          // Pour une table
          expected == actual
        }
        break;
      default:
        expected == actual
    }
  }

  if (!ok && options && options.failure){
    options.failure += ` : ${errs.join(', ')}`
  }
  if (!ok){
    console.log("Non correspondance trouvée :", {expected:expected, actual:actual})
  }
  assert(
      ok
    , `OK, ${actual} correspond bien à ${expected}`
    , `Hum… ${actual} ne correspond pas à ${expected} : ${errs.join(', ')}`
    , options
  )
}
