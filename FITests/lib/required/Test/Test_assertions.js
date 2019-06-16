'use strict'

module.exports = {

  addSuccess(assertion){
    this.successes.push(assertion)
  }

, addFailure(assertion){
    this.failures.push(assertion)
  }
}
