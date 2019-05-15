'use strict'

Object.assign(FAnalyse.prototype,{
// --- FONCTIONS D'ASSOCIATION ---------------------------------------------

/**
  Retourne l'instance désignée par +ref+

  Pour pouvoir fonctionner, l'élément doit avoir une classe qui se trouve
  par `FA<type titleisé>` et cette classe doit posséder une méthode de classe
  `get` qui reçoit en premier argument l'identifiant de l'élément et retourne
  l'instance de l'élément.

  @param {Object} ref   Instance d'un élément quelconque de l'analyse
                        ref doit définir :type (personnage, brin, event, etc.)
                        et :id (identifiant de l'élément)

  @return {<any element classe>|FAUnknownElement} Soit l'instance de l'élément
      voulu, soit, s'il n'existe pas, une instance FAUnknownElement qui répond
      aux méthodes classiques mais en renvoyant un message d'erreur.
**/
  instanceOfElement(ref){
    return eval(`FA${ref.type.titleize()}`).get(ref.type == 'event' ? parseInt(ref.id,10) : ref.id) || (new FAUnknownElement(ref))
  }

  /**
	  Méthodes qui fonctionnent avec le `drop` général de DATA_ASSOCIATES_DROPPABLE pour
	  associer des éléments quelconques (event, personnage, document, brin, etc.)
	**/
, associer(owner_ref, owned_ref){
	  (this.instanceOfElement(owner_ref)).associer(owned_ref)
	}

, dissocier(owner_ref, owned_ref){
	  let owner = this.instanceOfElement(owner_ref)
	    , owned = this.instanceOfElement(owned_ref)
	  if(!confirm(`Dois-je vraiment dissocier ${owned.toString()} de ${owner.toString()} ?`)) return
	  owner.dissocier(owned_ref)
	}

})// /assign
