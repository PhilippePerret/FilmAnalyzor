'use strict'


class FAEstt extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres
static get OWN_PROPS(){return [ ['sttID', 'sttType'], 'idx_pfa' ]}

// Instance KWindow qui permet d'afficher les noeuds dramatiques (absolus et
// relatifs) pour pouvoir s'y rendre.
static get klisting(){return this._klisting || defP(this,'_klisting', this.defineKListing())}
// Construction de la KWindow
static defineKListing(){
  // Préparation des items
  var items = [], ter
  this.a.pfa1.forEachAbsNode( node => {
    ter = [node.id, node.hname]
    if ( node.isDefined ) ter.push('RELATIF')
    items.push(ter)
  })

  // Instanciation de la KWindow
  return new KWindow(this,{
      id: 'noeud-stt-list'
    , title: 'Se rendre au nœud…'
    , onChoose: this.goToSttNodeByEventId.bind(this)
    , items: items
  })
}

/**
  Méthode, utilisée pour le moment exclusivement par la KWindow, pour se
  rendre au noeud dramatique dont l'event a l'identifiant +evid+
**/
static goToSttNodeByEventId(nid, rel){
  this.a.pfa1.node(nid).goToAndMarkCursor(rel)
}
// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
}

get isValid(){
  var errors = []
  if ( isUndefined(this.sttID) ) {
    errors.push({msg:T('stt-id-structurel-required'), prop: 'sttType'})
    // Note : normalement, si on se sert du formulaire, ça ne devrait jamais arriver
  } else if ( isUndefined(this.idx_pfa) ) {
    errors.push({msg:T('stt-index-pfa-required'), prop:'idx_pfa'})
  } else {
    // On ne peut pas créer une propriété qui existe déjà
    var nstt = this.pfa.node(this.sttID)
    if (nstt.event_id && nstt.event_id != this.id){
      errors.push({msg:T('stt-noeud-already-exists', {name:nstt.hname, at:nstt.event.horloge, link:nstt.event.link})})
    } else {
      // Définir ici les validités
      // En fait, pour les noeuds STT, on ne demande rien d'autre que le
      // paradigme et le noeud.
    }
  }

  // console.log("<- isValid")
  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get sttNode(){return this._sttNode || defP(this,'_sttNode',this.pfa.node(this.sttID))}

// Retourne l'instance PFA du noeud
get pfa(){ return this._pfa || defP(this,'_pfa',this.a.PFA.get(this.idx_pfa))}

get idx_pfa(){return this._idx_pfa || defP(this,'_idx_pfa',1/* par défaut*/)}
set idx_pfa(v){this._idx_pfa = parseInt(v,10)}

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

} // /class FAEstt
