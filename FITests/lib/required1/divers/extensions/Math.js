'use strict'
/**
  Extension de Math
**/

Object.assign(Math,{
  rand(max){
    let ran = Math.floor(Math.random() * Math.floor(max))
    // console.log(`random(${max}) = ${ran}`)
    return ran
  }
})
