'use strict'

global.FITEventNote = class extends FITEvent {
// ---------------------------------------------------------------------
// CLASSE
static create(data){
  this.a = data.analyse
  return new FITEventNote(data)
}

/**
  Retourne un type de note pour la note
**/
static getANoteType(){
  if ( undefined === this.noteTypes ) {
    this.dataNoteTypes = YAML.safeLoad(fs.readFileSync('./app/js/data/data_note.yaml','utf8'))
    this.noteTypes = Object.keys(this.dataNoteTypes.types)
  }
  if ( undefined === this.unusedNoteTypes || this.unusedNoteTypes.length === 0){
    this.unusedNoteTypes = Array.shuffle(this.noteTypes)
  }
  return this.unusedNoteTypes.shift()
}

// ---------------------------------------------------------------------
// INSTANCE
constructor(data){
  data.type = 'note'
  super(data)
}

/**
  Les données qui seront enregistrées dans events.json
**/
get data(){
  return Object.assign({}, super.defaultData, {
      type: 'note'
    , noteType: this.constructor.getANoteType()
  })
}


}
