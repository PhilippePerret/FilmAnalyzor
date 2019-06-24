'use strict'
/**
  Sujet complexe n pour les nombres
**/

class n_Subject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(n(...)).is(expected, options)
  @description Produit un succès si la valeur sujet nombre [n(...)](#n_subject) est égal à +expected+.
  @provided
    :expected {Number} La valeur de comparaison.
    :options {Object} [Options classiques des assertions](#options_assertions)
  @usage n(12).is(12) // => succès
 */
is(expected, options){
  this.checkValiditySujet()
  let resultat = this.newResultat({
    verbe:'est', comp_verbe:'égal à', objet: `${expected}`
    , options:options
  })
  if ( this.objetValid(expected) ) {
    resultat.validIf(this.actualValue === expected)
  } else {
    resultat.validIf(!this.positive)
    resultat.detailFailure = `La valeur attendue doit être impérativement un nombre (c'est un ${typeof(expected)})`
  }
  return assert(resultat)
}

/*
  @method expect(n(...)).is([min,max], options)
  @description Produit un succès si la valeur sujet nombre [n(...)](#n_subject) est comprise entre +min+ et +max+, strictement ou non suivant la valeur de options.strict.
  @provided
    :min {Array} La valeur inférieure ou supérieure de comparaison.
    :maj {Array} La valeur supérieure ou inférieure de comparaison.
    :options {Object} [Options classiques des assertions](#options_assertions) + options.strict pour une comparaison stricte.
  @usage n(12).is_between([13,10]) // => succès
 */
is_between(arr, options){
  this.checkValiditySujet()
  let pass
    , resultat = this.newResultat({
        verbe:'est', comp_verbe:`${options && options.strict?'strictement ':''}compris entre`
        , options:options
      })
  if ( Array.isArray(arr) ){
    resultat.objet = `${arr[0]} et ${arr[1]}`
    arr.sort()
    let [inf,sup] = arr
    let ok = this.objetValid(inf)
    ok = ok && this.objetValid(sup)
    if ( ok ) {
      if ( options && options.strict ) {
        pass = this.actualValue > inf && this.actualValue < sup
      } else {
        pass = this.actualValue >= inf && this.actualValue <= sup
      }
    } else {
      resultat.objet = `${arr}`
      pass = !this.positive
      resultat.detailFailure = "L'argument attendu doit être un array contenant le nombre minimum et le nombre maximum."
    }
  } else {
    // Le premier argument doit être un array
    resultat.objet = `${arr}:${typeof arr}`
    pass = !this.positive
    resultat.detailFailure = "L'argument attendu doit être un array avec les deux nombres."
  }
  resultat.validIf(pass)
  return assert(resultat)
}

is_greater_or_less_than(compValue, options, checkSup){
  this.checkValiditySujet()
  let pass
    , resultat = this.newResultat({
        verbe:'est', comp_verbe:`${options&&options.strict?'strictement ':''}plus ${checkSup?'grand':'petit'} que`
        , objet: `${compValue}`, options:options
      })
  if ( this.objetValid(compValue) ) {
    if (options && options.strict){
      if ( checkSup ) {
        pass = this.actualValue > compValue
      } else {
        pass = this.actualValue < compValue
      }
    } else {
      if ( checkSup ) {
        pass = this.actualValue >= compValue
      } else {
        pass = this.actualValue <= compValue
      }
    }
  } else {
    pass = !this.positive
    resultat.detailFailure = `La valeur à comparer devrait être un nombre (${typeof compValue})`
  }
  resultat.validIf(pass)
  return assert(resultat)
}

/*
  @method expect(n(...)).is_greater_than(compValue, options)
  @description Produit un succès si la valeur sujet nombre [n(...)](#n_subject) est supérieure à +compValue+, strictement ou non suivant la valeur de +options.strict+.
  @provided
    :compValue {Number} La valeur de comparaison.
    :options {Object} [Options classiques des assertions](#options_assertions) + options.strict
  @usage n(12).is_greater_than(12) // => succès car strict n'est pas true
 */
is_greater_than(compValue, options){
  return this.is_greater_or_less_than(compValue,options,true)
}
/*
  @method expect(n(...)).is_less_than(compValue, options)
  @description Produit un succès si la valeur sujet nombre [n(...)](#n_subject) est inférieure à +compValue+, strictement ou non suivant la valeur de +options.strict+.
  @provided
    :compValue {Number} La valeur de comparaison.
    :options {Object} [Options classiques des assertions](#options_assertions) + options.strict
  @usage n(12).is_less_than(12) // => succès car strict n'est pas true
 */
is_less_than(compValue, options){
  return this.is_greater_or_less_than(compValue,options,false)
}

/*
  @method expect(n(...)).is_close_to(compValue, tolerance, options)
  @description Produit un succès si la valeur du sujet number [n(...)](#n_subject) est à + ou - +tolerance+ du nombre +compValue+.
  @provided
    :compValue {Number} Nombre référence
    :tolerance {Number} Tolérance de proximité.
    :options {Object} [Options classique des assertions](#options_assertions)
  @usage expect(n(12)).is_close_to(10,5) // => produit un succès
 */
is_close_to(compValue, tolerance, options){
  this.checkValiditySujet()
  let pass
    , resultat = this.newResultat({
      verbe:'est', comp_verbe:'proche de', objet:`${compValue} avec une tolérance${options&&options.strict?' stricte':''} de ${tolerance}.`
      , options:options
    })
  if (this.objetValid(compValue) && this.objetValid(tolerance) ){
    const compValSup = compValue + tolerance
        , compValInf = compValue - tolerance
    if ( options && options.strict ){
      pass = this.actualValue > compValInf && this.actualValue < compValSup
    } else {
      pass = this.actualValue >= compValInf && this.actualValue <= compValSup
    }
  } else {
    pass = !this.positive // pour toujours produire un échec
    resultat.detailFailure = `Les deux premiers arguments doivent être la valeur de comparaison et la tolérance, deux nombres. Le premier est ${typeof compValue}, le second est ${typeof tolerance}.`
  }
  resultat.validIf(pass)
  return assert(resultat)
}

//  /Assertions
// ---------------------------------------------------------------------
constructor(value, hsujet){
  super(`${hsujet||value}`)
  this.actualValue = value
  this.sujet = hsujet || `${value}`
  Object.assign(this.assertions,{
      is: this.is.bind(this)
    , equals: this.is.bind(this)
    , is_between: this.is_between.bind(this)
    , is_greater_than: this.is_greater_than.bind(this)
    , is_less_than: this.is_less_than.bind(this)
    , is_close_to: this.is_close_to.bind(this)
  })
}

checkValiditySujet(){
  if ( 'number' === typeof this.actualValue ) return true
  else throw new Error('not-a-number')
}
objetValid(obj){
  return 'number' === typeof obj
}

}

/*
  @method expect(n(number))
  @id n_subject
  @description Sujet complexe pour tester les nombres.
  @provided
    :number {Number} Le nombre à tester. Les tests produisent un échec si un autre type est fourni.
  @usage expect(n(12)).is_greater_than(10)
 */
 global.n = function(value, hsujet){ return new n_Subject(value, hsujet)}
