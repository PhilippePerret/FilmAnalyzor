'use strict'
/**
WARNINGS
-------
[1] Attention, avec ces méthodes, on ne peut pas faire :
      4.between(x, y) ou 4.pages
    Il faut forcément passer par un variable :
      x = 4
      x.pages
    C'est à cela que servent les constantes ci-dessous.
**/

const PAGE_LENGTH = 1500 // pour faire X*PAGES

const one   = 1
const one_n_half = 1.5
const two   = 2
const two_n_half = 2.5
const tree  = 3
const tree_n_half = 3.5
const four  = 4
const four_n_half = 4.5
const five  = 5
const five_n_half = 5.5
const six   = 6
const six_n_half = 6.5
const seven = 7
const seven_n_half = 7.5
const height = 8
const height_n_half = 8.5
const nine  = 9
const nine_n_half = 9.5
const ten   = 10
const ten_n_half = 10.5
const fifth = 15
const fifth_n_half = 15.5

/**
  Retourne true si le nombre est entre +min+ et +max+
  Si +strict+ est true, le nombre ne doit pas être égal
  à ces valeurs, il doit se trouver strictement *entre*
  ces valeurs.

  cf. WARNING [1] ci-dessus
**/
Number.prototype.between = function(min, max, strict){
  var v = this.valueOf()
  if(strict){
    return v > min && v < max
  } else {
    return v >= min && v <= max
  }
}

/**
  Retourne true si le numbre est près du nombre +ref+
  avec une tolérance de +tolerance+

  cf. WARNING [1] ci-dessus

  var x = 8
  x.isCloseTo(10, 1) =>   false car 8 n'est pas entre 9 et 11
  x.isCloseTo(10, 3) =>   true car 8 est entre 7 (10 - 3) et
                          13 (10 + 3)
**/
Number.prototype.isCloseTo = function(ref, tolerance){
  return this.between(ref - tolerance, ref + tolerance)
}

/**
  Retourne la valeur arrondie à +decimales+ décimales.
  +decimales+ (2 par défaut) ne peut pas être 0

**/
Number.prototype.round = function(decimales){
  var pow = Math.pow(10, decimales || 2)
  return Math.round(pow * this.valueOf()) / pow
}

/**
  var x = 4

  x.pages => 6000

cf. WARNING [1] ci-dessus

**/
Object.defineProperties(Number.prototype,{
  pages:{
    get(){return this.valueOf() * PAGE_LENGTH}
  }
})
// Object.defineProperties(Float.prototype,{
//   pages:{
//     get(){return Math.round(this.valueOf() * PAGE_LENGTH)}
//   }
// })
