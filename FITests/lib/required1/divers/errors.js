'use strict'

/**
  Exception normale levée en cas d'assertion négative
**/
global.ExpectationError = class extends Error {
  constructor(message){
    super(message)
    this.type     = 'ExpectationError'
    this.name     = 'ExpectationError'
    this.message  = message
  }
}

/**
  Exception levée lorsque l'on fait la relève des tests et qu'un fichier test
  n'exporte aucun test.
**/
global.TestExportationError = class extends Error {
  constructor(path){
    super(path)
    this.type = 'TestExportationError'
    this.path = path
    this.message = this.buildMessage()
  }
  buildMessage() {
    if ( undefined === this._message ) {
      this._message = `\nFile "${this.path}" exports no tests.\nAdd "module.exports = [test1, test2...]" at the bottom of this file.\n`
    }
    return this._message
  }
}
