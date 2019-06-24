'use strict'

Object.isObject = function(sujet){
  return  typeof(sujet) === 'object'
          && 'undefined' !== typeof(Object.keys(sujet))
          && 'undefined' !== typeof(Object.values(sujet))
          && !Array.isArray(sujet)
}
