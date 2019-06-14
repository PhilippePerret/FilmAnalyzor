'use strict'

// Pour construire un message d'erreur de type :
//  La valeur de truc devrait être à machin, elle vaut bidule
//
window.msg_failure = function(sujet, expected, actual){
  if('string' == typeof(expected) && !expected.match(/^[0-9]+$/)){expected = `"${expected}"`}
  if('string' == typeof(actual) && !actual.match(/^[0-9]+$/)){actual = `"${actual}"`}
  var msg = `la valeur de ${sujet} devrait être ${expected}, elle vaut ${actual}`;
  msg = msg.replace(/de le/g, 'du').replace(/de les/g, 'des');
  return msg;
};
// Pour construire un message d'erreur avec la méthode ci-dessus, mais en
// le mettant dans la liste (Array) +in+
window.push_failure = function(arr, sujet, expected, actual){
  arr.push(msg_failure(sujet, expected, actual));
};


window.wait = function(wTime, wMsg){
  if(undefined !== wMsg) Tests.log(wMsg)
  return new Promise(ok => {setTimeout(ok, wTime)})
}

Tests.testIfTrue = function(condition){
  var my = Tests
  // console.log("-> testIfTrue", this.optionsWaitFor)
  let evaluation = eval(condition)
  if (evaluation){
    my.stopTimerWaitFor()
    return my.okWaitFor()
  } else if (my.optionsWaitFor.duree > my.optionsWaitFor.timeout) {
    my.stopTimerWaitFor()
    return my.koWaitFor('Attente déçue…')
  } else {
    my.optionsWaitFor.duree += 100
  }
}
Tests.stopTimerWaitFor = function(){
  clearInterval(this.waitForTimer)
  delete this.waitForTimer
}
Tests.waitFor = function(condition, options){
  var my = Tests
  return new Promise((ok, ko) => {
    my.okWaitFor      = ok
    my.koWaitFor      = ko
    options.duree  = 0
    if (undefined === options.timeout) options.timeout = Tests.TIMEOUT
    my.optionsWaitFor = options
    if (my.testIfTrue.bind(my)(condition)) return true
    else {
      my.waitForTimer = setInterval(Tests.testIfTrue.bind(Tests, condition), 100)
    }
  })
}

window.waitFor = function(condition, options){
  if(undefined === options) options = {duree: 0}
  return Tests.waitFor(condition, options)
}
