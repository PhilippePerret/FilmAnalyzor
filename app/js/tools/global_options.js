'use strict'
/**
  * Pour définir une option générale
  */


let setGlobalOption = function(opt_id, opt_value){
  // console.log("Je vais mettre la valeur de… à…", opt_id, opt_value)
  var data = {}
  data[opt_id] = opt_value
  Prefs.set(data)
  data = null
}
let toggleGlobalOption = function(opt_id){
  var data = {}
  data[opt_id] = !Prefs.get(opt_id)
  Prefs.set(data)
  data = null
}

module.exports = {
    setGlobalOption:    setGlobalOption
  , toggleGlobalOption: toggleGlobalOption
}
