'use strict'

global.remember = async function(id, evaluateMethod, expected){
  let rememberer = await Rememberer.create(id, evaluateMethod, expected)
  return rememberer
}
global.compare = async function(id, difference){
  let rememberer = Rememberer.get(id)
  await rememberer.compareWith(difference)
}

class Rememberer {
  static async create(id, evaluateMethod, expected){
    if ( undefined === this._rememberers ) this._rememberers = new Map()
    this._rememberers.set(id, new Rememberer(id, evaluateMethod, expected))
    let rememberer = this._rememberers.get(id)
    if ( undefined !== expected ) await rememberer.firstCheck()
    else await rememberer.defineFirstValue()
    return rememberer
  }
  static get(id) { return this._rememberers.get(id) }

  constructor(id, evaluateMethod, expected){
    this.id         = id
    this.evaluateMethod = evaluateMethod
    this.firstValueExpected = expected
  }
  /**
    Retourne la valeur actuelle, en utilisant la méthode d'évaluation
  **/
  async getValue(){
    // return await this.evaluateMethod.call()
    return this.evaluateMethod.call()
  }
  async defineFirstValue(){
    this.firstValue = await this.getValue()
  }
  /**
    Le premier check
    Il teste la valeur `this.firstValue` qui doit absolument être vraie
    Sinon, produit un échec.
  **/
  async firstCheck(){
    await this.defineFirstValue()
    if ( this.firstValueExpected === this.firstValue ) return // rien à faire
    // Console.failure(this.firstFailureMessage)
    assert(false, null, this.firstFailureMessage)
  }
  async compareWith(diffExpected){
    this.lastValue = await this.getValue()
    this.diffExpected = diffExpected
    if ( typeof this.diffExpected === 'string' ) this.diffExpected = diffExpected.replace(/ /g,'')
    assert(this.diff(), this.lastSuccessMessage, this.lastFailureMessage)
  }
  diff(){
    switch (this.diffExpected) {
      case '+1':    return this.lastValue === this.firstValue + 1
      case '-1':    return this.lastValue === this.firstValue - 1
      case false:   return this.lastValue === false
      case true:    return this.lastValue === true
      case 'inverse': return this.lastValue === !this.firstValue
      case 'same':    return this.lastValue === this.firstValue
      default:
        return false
    }
  }
  get firstFailureMessage(){
    return `La valeur de ${this.id} devrait être vraie. Elle est fausse.`
  }
  get lastFailureMessage(){
    return `La valeur de ${this.id} devrait être ${this.firstValue} ${this.diffExpected}. Elle vaut ${this.lastValue}.`
  }
  get lastSuccessMessage(){
    return `La valeur de ${this.id} est correcte (${this.firstValue} ${this.diffExpected}).`
  }
}
