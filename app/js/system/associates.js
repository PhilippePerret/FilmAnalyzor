'use strict'
/**
  Des méthodes/constantes communes à tous les éléments
**/


/**
  Données communes pour dropper les events, documents et times
  @usage
    <set jquery>.droppable(
      Object.assign({drop: function(i,o){...}},DATA_DROPPABLE)
    )
**/
const DATA_DROPPABLE = {
  what: 'Donnée drop pour un élément qui peut recevoir des associables'
, accept: '.event, .doc, .dropped-time, .brin, .personnage'
, tolerance: 'intersect'
, drop:(e, ui) => {
    let target = $(e.target)
      , helper = ui.helper
      , owner = {type: target.attr('data-type'), id: target.attr('data-id')}
      , owned = {type: helper.attr('data-type'), id:helper.attr('data-id')}
    current_analyse.associer(owner, owned)
  }
, classes: {'ui-droppable-hover': 'survoled'}
}

const DATA_ASSOCIATES_DRAGGABLE = {
      what:'Données drag pour un élément associable'
      // revert: true
    , helper: () => {return this.dragHelper()}
    , cursorAt:{left:40, top:20}
  ,
  }

/**
  Méthodes communes qui permettent de gérer tous les éléments associés de
  n'importe quel élément.
  Pour l'implémenter, il suffit de faire :

      Object.assign(CLASSE.prototype, ASSOCIATES_COMMON_METHODS)

**/
let ASSOCIATES_COMMON_METHODS = {
  /**
    Liste des types d'éléments associables.
    Permet de faire :
      ASSOCIATES_COMMON_METHODS.types.map(typ => ...)

    À partir de cette liste, on construit toutes les listes des types,
    personnages:[], brins:[] etc.
  **/
  types_associates: ['event','personnage', 'document', 'time', 'brin']


// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

, dragHelper(){
    return `<div class="${this.type}" data-type="${this.type}" data-id="${this.id}">${this.toString()}</div>`
  }


/**
  Retourne un lien DOM pour supprimer le lien entre cet élément options.owner
  Si options.owner n'est pas défini, on produit une erreur

  Noter qu'avec cet lien, il n'y a rien d'autre à faire, tout est embeddé pour
  traiter la dissociation en appelant la méthode `FAnalyse#dissocier`, demander
  confirmation et procéder à la suppression.

**/
, dissociateLink(options){
    options.owner || raise("Le propriétaire (owner) doit être défini pour construire un lien de dissociation.")
    return DCreate('A', {class:'lktool lkdisso', inner:'dissocier', attrs:{onclick:`current_analyse.dissocier({type:'${options.owner.type}',id:'${options.owner.id}'}, {type:'${this.type}', id:'${this.id}'})`}})
  }

/**
  Retourne les divs des éléments associés, s'il y en a
  @param {Object|Undefined} options   Table d'options
              as:     'dom'/'string'(default)
              title:  true/false/string. Si true ou string, le titre donné ou
                      « Éléments associés » sera ajouté, dans un H3 au début des
                      divs.
  @return {DOMElement|String} en fonction des options, contenant tous les
                              éléments associés.
**/
, divsAssociates(options){
    if(undefined === options) options = {}
    if(undefined === options.as) options.as = 'string'
    if(Object.keys(this.associates).length == 0) return options.as == 'string' ? '' : undefined
    var divs = []
    if(this.associatesCounter){
      for(var assoType in this.associates){
        this.associates[assoType].map(assid => {
          divs.push(this.a.instanceOfElement({type:assoType,id:assid}).as('associate', DISSOCIABLE|LABELLED, {owner: this, as:'dom'}))
        })
      }
    } else {
      divs.push(DCreate('DIV',{class:'italic small indent2', inner:'(Aucun élément associé)'}))
    }

    if(options.title) divs.unshift(DCreate('H3',{inner:(options.title||'Éléments associés')}))

    // On retourne le résultat
    switch (options.as) {
      case 'string': return DCreate('DIV',{append:divs}).innerHTML
      default: return divs // liste des divs
    }
  }

// ---------------------------------------------------------------------
// MÉTHODES D'ASSOCIATION

, associer(element){
    this.addToAssoList(element.type, element.id)
    ++ this.associatesCounter
  }
/**
  @param {Instance} element Contrairement à `associer`, ici, la méthode reçoit
                            l'instance de l'élément — qui existe forcément —
                            pour pouvoir notamment demander confirmation.
**/
, dissocier(element){
    this.remToAssoList(element.type, element.id)
    -- this.associatesCounter
  }

/**
  Méthode générique pour ajouter une association
**/
, addToAssoList(list_id, asso_id){
    // Modification peut-être nécessaire de l'id
    asso_id = this.realAssoId(list_id, asso_id)
    if(undefined === this.associates[list_id]) this.associates[list_id] = []
    if(this.associates[list_id].indexOf(asso_id) < 0){
      log.info(`   Ajout id #${asso_id} à liste ${list_id} de ${this.toString()}`)
      this.associates[list_id].push(asso_id)
      this.modified = true // la méthode modified doit appeler onUpdate
      return true
    } else {
      F.notify(`Les deux éléments sont déjà liés.`)
      return false
    }
  }
/**
  Méthode générique pour casser une association
**/
, remToAssoList(list_id, asso_id){
    asso_id = this.realAssoId(list_id, asso_id)
    var idx
    if(undefined === this.associates[list_id]) this.associates[list_id] = []
    if((idx = this.associates[list_id].indexOf(asso_id)) > -1){
      log.info(`   Retrait de id #${asso_id} à liste ${list_id} de ${this.toString()}`)
      this.associates[list_id].splice(idx,1)
      this.modified = true
      return true
    } else {
      // Pas associés
      F.notify(`Les deux éléments ne sont pas liés…`)
      return false
    }
  }

, realAssoId(list_id, id){
    switch (list_id) {
      case 'time':   return id instanceof(OTime) ? id.seconds : id ;
      case 'event':  return parseInt(id,10)
      default: return id
    }
  }

// ---------------------------------------------------------------------
//  AUTRES MÉTHODES

/**
  Retourne les données des associés à sauver (épurés des listes vides)
**/
, associatesEpured(){
    var h = {}
    for(var atype in this.associates){
      if(this.associates[atype].length) h[atype] = this.associates[atype]
    }
    if(Object.keys(h).length == 0) return undefined
    return h
  }

, hasAssociates(){return this.associatesCounter > 0}

}//assign

let ASSOCIATES_COMMON_PROPERTIES = {
  /**
    Tables des associés telle qu'elle est enregistrée dans la donnée

    Mais dans la donnée, seules les listes contenant des éléments sont
    enregistrées. Donc on peut se retrouver avec une valeur pour associates
    qui est donnée, mais une clé inexistante (par exemple la clé 'brin')

    Au premier appel de `associates`, il faut donc s'assurer que toutes les
    listes d'associés soit préparées.

  **/
  associates:{
    get(){
      if (undefined === this._associates) {
        this._associates = {}
        ASSOCIATES_COMMON_METHODS.types_associates.map(typ => {
          this._associates[typ] = []
        })
      } else if (undefined === this._associates_inited){
        ASSOCIATES_COMMON_METHODS.types_associates.map(typ => {
          if(undefined === this._associates[typ]) this._associates[typ] = []
        })
        this._associates_inited = true
      }
      return this._associates
    }
  }

/**
  Retourne ou définit le nombre d'associés.
**/
, associatesCounter:{
    get(){
      if(undefined === this._associatesCounter){
        this._associatesCounter = 0
        for(var atype in this.associates){
          this._associatesCounter += this.associates[atype].length
        }
      }
      return this._associatesCounter
    }
  , set(v){this._associatesCounter = v}
}
}

// On essaie d'ajouter les propriétés plurielles, c'est-à-dire `documents` qui
// retourne la liste des documents, `events` qui retourne la liste des events,
// etc.
ASSOCIATES_COMMON_METHODS.types_associates.map(atype => {
  var prop_plur = `${atype}s`
  var p_inst_plur_tir = `_instances_${prop_plur}`
  ASSOCIATES_COMMON_PROPERTIES[prop_plur] = {
    get(){return this.associates[atype] || []}
  }
  ASSOCIATES_COMMON_PROPERTIES[`instances_${prop_plur}`] = {
    get(){
      if(undefined === this[p_inst_plur_tir]){
        var classe = eval(`FA${atype.titleize()}`)
        this[p_inst_plur_tir] = this.associates[atype].map(eid => classe.get(eid))
      }
      return this[p_inst_plur_tir]
    }
  }
})


// console.log("ASSOCIATES_COMMON_PROPERTIES:", ASSOCIATES_COMMON_PROPERTIES)


module.exports = {
  ASSOCIATES_COMMON_PROPERTIES: ASSOCIATES_COMMON_PROPERTIES
, ASSOCIATES_COMMON_METHODS: ASSOCIATES_COMMON_METHODS
, DATA_ASSOCIATES_DRAGGABLE: DATA_ASSOCIATES_DRAGGABLE
, DATA_DROPPABLE: DATA_DROPPABLE
}
