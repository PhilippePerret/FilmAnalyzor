'use strict'

global.FITEventProc = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventProc(data)
}

/**
  Retourne un type de procédé pour le procédé
**/
static getAProcType(){
  if ( undefined === this.procTypes ) {
    this.dataProcTypes = YAML.safeLoad(fs.readFileSync('./app/js/data/data_proc.yaml','utf8'))
    this.procTypes = []
    for ( var rubrique in this.dataProcTypes ){
      var dataRubrique = this.dataProcTypes[rubrique]
      for ( var categorie in dataRubrique.items ) {
        var dataCategorie = dataRubrique.items[categorie]
        for ( var procede in dataCategorie.items ) {
          this.procTypes.push(procede)
        }
      }
    }
  }
  if ( undefined === this.unusedProcTypes || this.unusedProcTypes.length === 0){
    this.unusedProcTypes = Array.shuffle(this.procTypes)
  }
  // console.log("this.unusedProcTypes =", this.unusedProcTypes)
  return this.unusedProcTypes.shift()
}


// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'proc'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
      type: 'proc'
    , procType: this.constructor.getAProcType()
  })
}


}
