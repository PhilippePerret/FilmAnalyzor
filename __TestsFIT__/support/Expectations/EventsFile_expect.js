'use strict'
/**
  Définition du sujet complexe FITReader
**/

class FITEventsFile extends FITSubject {
constructor(analyse){
  super('EventsFile')
  this.a = this.analyse = analyse
  // this.assertions   = FITEventsFileAssertions
  this.assertions = {
    contains: this.contains.bind(this)
  }
  // this.assertions.i = this
}
getData(){
  return JSON.parse(fs.readFileSync(this.a.eventsFilePath,'utf8'))
}

contains(data, options){
  options = options || {}
  let resultat = new FITResultat(this, {
      sujet: 'Le fichier des events'
    , verbe: 'contient'
    , objet: `${JSON.stringify(data)}`
    , options: options
  })

  const inFile = this.getData()
  console.log("inFile:",inFile)


  assert(resultat)
}

}

//
// const FITEventsFileAssertions = {
// /**
//   Assertion qui vérifie que le reader contienne bien l'item +item+
//
//   @param {Object} options
//
// **/
//   contains(data, options){
//     options = options || {}
//     let resultat = new FITResultat(this, {
//         sujet: 'Le fichier des events'
//       , verbe: 'contient'
//       , objet: `${JSON.stringify(data)}`
//       , options: options
//     })
//
//     const inFile = this.i.getData()
//     console.log("inFile:",inFile)
//
//
//     assert(resultat)
//   }
//
// }
//
// Object.assign(FITEventsFile.prototype, FITEventsFileAssertions)

Object.defineProperties(global,{
  EventsFile:{get(){ return new FITEventsFile(current_analyse) }}
})
