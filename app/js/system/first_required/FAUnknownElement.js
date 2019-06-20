'use strict'
/**
  Class FAUnknownElement
  ----------------------
  Classe spéciale permettant d'intercepter les éléments manquants, notamment
  lors des associations.

  C'est elle, notamment, qui est retournée par FAnalyse.instanceOfElement
  lorsque l'élément n'existe pas.

**/
class FAUnknownElement {
// ---------------------------------------------------------------------
//  CLASS

// ---------------------------------------------------------------------
//  INSTANCE
constructor(ref){
  this.id   = ref.id
  this.type = ref.type
}

as ( format, flag, options){
  options = options || {}
  let div = DCreate(DIV,{class:'warning', append:[
      DCreate(SPAN,{inner:`&lt;&lt;&lt;ELEMENT INCONNU @type=${this.type} @id=${this.id}&gt;&gt;&gt;`})
    , this.dissociateLink(options)
  ]})
  if ( options.as === STRstring ) return div.outerHTML
  else return div
}


/**
  Retourne un lien DOM pour supprimer le lien entre l'élément args.owner
  et cet élément inconnu.

  Noter qu'avec cet lien, il n'y a rien d'autre à faire, tout est embeddé pour
  traiter la dissociation en appelant la méthode `FAnalyse#dissocier`, demander
  confirmation et procéder à la suppression.

  Contrairement à la méthode originale normale, cette méthode ne passe pas par
  la confirmation, elle détruit directement l'association.

**/
dissociateLink(args){
    args.owner || raise("Le propriétaire (owner) doit être défini pour construire un lien de dissociation.")
    // return DCreate(A, {class:'lktool lkdisso', inner:'dissocier', attrs:{onclick:`current_analyse.dissocier({type:'${args.owner.metaType||args.owner.type}',id:'${args.owner.id}'}, {type:'${this.metaType||this.type}', id:'${this.id}'})`}})
    var onclick = `current_analyse.instanceOfElement({type:'${args.owner.metaType||args.owner.type}',id:'${args.owner.id}'}).dissocier({type:'${this.metaType||this.type}',id:'${this.id}'})`
    return DCreate(A, {class:'lktool lkdisso', inner:'dissocier', attrs:{onclick:onclick}})
  }

}// /class

module.exports = FAUnknownElement
