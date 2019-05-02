'use strict'


class FAEstt extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres
static get OWN_PROPS(){return [ ['sttID', 'sttType'] ]}


static get dataType(){
  return {
      hname: 'Nœud structurel'
    , short_hname: 'Nœud Stt'
    , type: 'stt'
  }
}


static get dataType(){
  if(undefined === this._dataType){
    this._dataType ={
      type: 'stt'
    , genre: 'M'
    , article:{
        indefini: {sing: 'un', plur: 'des'}
      , defini: {sing: 'le', plur: 'les'}
      }
    , name: {
        plain: {
          cap: {sing: 'Nœud structurel', plur: 'Nœud structurels'}
        , min: {sing: 'nœud structurel', plur: 'nœud structurels'}
        , maj: {sing: 'NŒUD STRUCTUREL', plur: 'NŒUDS STRUCTURELS'}
        }
      , short:{
          cap: {sing: 'Nœud Stt', plur: 'Nœuds Stt'}
        , min: {sing: 'Nœud Stt', plur: 'Nœuds Stt'}
        , maj: {sing: 'Nœud STT', plur: 'Nœuds STT'}
        }
      , tiny: {
          cap: {sing: 'N.Stt', plur: 'N.Stt'}
        , min: {sing: 'n.stt', plur: 'n.stt'}
        , maj: {sing: 'N.STT', plur: 'N.STT'}
        }
      }
    }
  }
  return this._dataType
}


// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []
  // console.log("-> isValid")
  if(!this.sttID){
    errors.push({msg: "L'ID structurel est indispensable et doit être choisi avec soin.", prop: 'sttType'})
  } else {
    // On ne peut pas créer une propriété qui existe déjà
    var nstt = this.analyse.PFA.node(this.sttID)
    if (nstt.event_id && nstt.event_id != this.id){
      errors.push({msg: `Il existe déjà un nœud structurel « ${nstt.hname} » défini à ${nstt.event.horloge} (${nstt.event.link})`})
    } else {
      // Définir ici les validité
      this.content || errors.push({msg: "La description du nœud structurel est indispensable.", prop: 'longtext1'})
    }
  }

  // console.log("<- isValid")
  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get sttNode(){return this._sttNode || defP(this,'_sttNode',this.analyse.PFA.node(this.sttID))}

// Mise en forme du contenu propre à ce type d'event
formateContenu(){
  var str
  str = `<div>===== ${this.sttNode.hname} =====</div>`
  str += `<div class="small">${this.content}</div>`
  if(this.note) str += `<div class="small">${this.note}</div>`
  // TODO Mettre des liens pour voir dans la structure ? (ou ça doit être fait
  // de façon générale pour tout event)
  return this.fatexte.formate(str)
}

/**
 * Méthode appelée à la création de l'event
 * Il faut le lier à son nœud structurel
 */
onCreate(){
  // On associe l'evenement à son noeud structurel
  this.sttNode.event = this
}
}
