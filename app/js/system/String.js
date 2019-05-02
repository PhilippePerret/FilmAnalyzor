'use strict'
/**
 * Extension de la classe String
 */
String.prototype.titleize = function(){
  var str = this.valueOf()
  var len = str.length
  return str.substring(0,1).toUpperCase() + str.substring(1, len).toLowerCase()
}

// Transforme "ma donnÉe DONnée" => "MaDonnéeDonnée"
// Et 'ma_donnee_data' => 'MaDonneeData'
String.prototype.camelize = function(){
  var str = this.valueOf()
  return str.split(/[_ ]/).map(m => m.titleize()).join('')
}


RegExp.escape = function(str){
  str = str.replace(/\?/, '\\?')
  str = str.replace(/\[/, '\\[')
  str = str.replace(/\]/, '\\]')
  str = str.replace(/\{/, '\\{')
  str = str.replace(/\}/, '\\}')
  return str
}
