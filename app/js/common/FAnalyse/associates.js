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
    let classe
    // let classe   = window[`FA${ref.type.titleize()}`]
    try {
      classe = eval(`FA${ref.type.titleize()}`)
    } catch (e) {
      log.error(`Impossible d'obtenir la classe de l'élément à partir de la référence :`, ref)
      log.error(e)
      return new FAUnknownElement(ref)
    }
    if(isDefined(classe)){
      return classe.get(ref.type == STRevent ? parseInt(ref.id,10) : ref.id) || (new FAUnknownElement(ref))
    } else {
      let msgerr = `La classe "FA${ref.type.titleize()}" n'existe pas. Impossible de retourner l'event défini par ${JSON.stringify(ref)}`
      log.error(msgerr)
      F.error(msgerr)
      return new FAUnknownElement(ref)
    }
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
      , dataConf = {
          message: `Dois-je vraiment dissocier ${owned.toString()} de ${owner.toString()} ?`
        , buttons:['Renoncer', 'Dissocier']
        , defaultButtonIndex: 1
        , okButtonIndex: 1, cancelButtonIndex: 0
        , methodOnOK: owner.dissocier.bind(owner)(owned_ref)
      }
	  confirm(dataConf)
	}

})// /assign
