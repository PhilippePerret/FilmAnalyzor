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

// Retourne une installation pour le procédé
static getASetUp(){
  const from = Math.rand(1000)
  return String.LoremIpsum.substring(from, from + Math.rand(200))
}
// Retourne une exploitation pour le procédé en particulier
// Note : on a besoin de son temps et de sa durée
static getAExploit(proc){
  let from = Math.rand(500)
      , str = String.LoremIpsum.substring(from, from + Math.rand(500))
      , reg = new RegExp(RC,'g')
  str = str.replace(reg,' ')
  let time = proc.time
    , duree = proc.duree
    , tiers_duree = parseInt(duree / 3,10)
  let len = str.length / 3
    , str1 = `{{${time + 2}|${(new OTime()).s2h(time + 2,{no_frames:true})}}} ${str.substring(0, len)}`
    , str2 = `{{${time + tiers_duree}|${(new OTime()).s2h(time + tiers_duree,{no_frames:true})}}} ${str.substring(len, 2*len)}`
    , str3 = `{{${time + 2*tiers_duree}|${(new OTime()).s2h(time + 2*tiers_duree,{no_frames:true})}}} ${str.substring(2*len, 3*len)}`
  return str1 + RC + str2 + RC + str3
}
// Retourne une exploitation pour le procédé en particulier
// Note : on a besoin de son temps et de sa durée
static getAPayOff(proc){
  var time = proc.time + proc.duree - 5
    , from = Math.rand(500)
    , str = String.LoremIpsum.substring(from, from + Math.rand(500))
  return `{{${time}||${new OTime().s2h(time,{no_frames:true})}}} ${str}`
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
    , setup: this.constructor.getASetUp()
    , exploit: this.constructor.getAExploit(this)
    , payoff: this.constructor.getAPayOff(this)
  })
}


}
