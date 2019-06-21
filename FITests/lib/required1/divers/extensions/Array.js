'use strict'

// http://stackoverflow.com/a/2450976/1037948
Array.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
  Return true if array arr1 and array +arr2+ are equals
**/
Array.is = function(arr1, arr2){
  var item1, item2
  try {
    Array.isArray(arr1) || raise('not-a-array')
    Array.isArray(arr2) || raise('not-a-array')
    arr1.length === arr2.length || raise('not-same-length')
    // On peut vraiment comparer les valeurs
    while ( item1 = arr1.shift() ) {
      item2 = arr2.shift()
      if ( typeof(item1) != typeof(item2) ) raise('not-item-same-type')
      if ( item1 instanceof Array && item2 instanceof Array ){
        if ( !Array.is(item1,item2) ) raise('not-item-same-array')
      } else if ('object' === typeof(item1) ) {
        if ( !Object.is(item1,item2) ) raise('not-item-same-object')
      } else {
        if ( item1 !== item2 ) raise('not-item-same-value')
      }
    }
    return true
  } catch (e) {
    Array.lastError = e
    return false
  }
}
// console.log("Chargement de l'extension Array")
