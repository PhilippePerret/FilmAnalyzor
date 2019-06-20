'use strict'

// http://stackoverflow.com/a/2450976/1037948
// Array.shuffle = function(arr){
// 	var temp, j, i = arr.length + 1;
// 	while (--i) {
// 		j = ~~(Math.random() * i);
// 		temp = arr[i];
// 		arr[i] = arr[j];
// 		arr[j] = temp;
// 	}
// 	return arr;
// }
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
