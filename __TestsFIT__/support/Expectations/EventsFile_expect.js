'use strict'
/**
  Définition du sujet complexe FITReader
**/

class FITEventsFile extends FITSubject {
constructor(analyse){
  super('EventsFile')
  this.a = this.analyse = analyse
  this.sujet = "Le fichier des events"
  // this.assertions   = FITEventsFileAssertions
  this.assertions = {
    contains: this.contains.bind(this)
  }
  // this.assertions.i = this
}
getData(){
  return JSON.parse(fs.readFileSync(this.a.eventsFilePath,'utf8'))
}

contains(reqData, options){
  options = options || {}
  let resultat = this.newResultat({
      verbe: 'contient'
    , objet: `${JSON.stringify(reqData)}`
    , options: options
  })
  const inFile = this.getData()
  var pass = false
  for ( var h of inFile ){
    if ( hashCompliesWith(h, reqData) ) {
      pass = true
      break
    }
  }
  resultat.validIf(pass)
  if ( resultat.invalid ){
    resultat.detailFailure = `Le contenu du fichier est : ${JSON.stringify(inFile,null,2)}`
  }
  assert(resultat)
}

// ---------------------------------------------------------------------
//  MÉTHODES UTILES
}

global.hashCompliesWith = function(actual, expected){
  for ( var k in expected ){
    if ( undefined === actual[k] ) return false
    if ( ! Object.is(expected[k], actual[k]) ) return false
  }
  return true
}


Object.defineProperties(global,{
  EventsFile:{get(){ return new FITEventsFile(current_analyse) }}
})
