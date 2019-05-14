'use strict'
/**
  Des méthodes/constantes communes à tous les éléments pour les associations
**/



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
  types_associates: ['event','personnage', 'document', 'time', 'brin', 'image']

  /**

    Répète la méthode +fn+ sur tous les éléments associés de
    type +type+ (le nom du type au singulier)

    @param {String} type  Soit 'event', 'document', 'time', etc.

  **/
, forEachAssociate(type, fn){
    if(type === 'time'){
      for(var assoEvent of this[`${type}s`]){
        if(false === fn(new OTime(assoEvent))) break;
      }
    } else {
      for(var iAsso of this[`instances_${type}s`]){
        if(false === fn(iAsso)) break;
      }
    }
  }

, acceptableTypes(){
    return this.types_associates.map(t => `.${t}`).join(', ')
  }

// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

, dragHelper(){
    return `<div class="${this.metaType||this.type} draghelper" data-type="${this.metaType||this.type}" data-id="${this.id}">${this.toString()}</div>`
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
    return DCreate('A', {class:'lktool lkdisso', inner:'dissocier', attrs:{onclick:`current_analyse.dissocier({type:'${options.owner.metaType||options.owner.type}',id:'${options.owner.id}'}, {type:'${this.metaType||this.type}', id:'${this.id}'})`}})
  }

/**
  Retourne les divs des éléments associés, s'il y en a
  @param {Object|Undefined} options   Table d'options
              as:     'dom'/'string'(default)
              title:  true/false/string. Si true ou string, le titre donné ou
                      « Éléments associés » sera ajouté, dans un H3 au début des
                      divs.
              inDiv     Si true, on retourne les associés dans un div.associates

  @return {DOMElement|String} en fonction des options, contenant tous les
                              éléments associés.
**/
, divsAssociates(options){
    if(undefined === options) options = {}
    if(undefined === options.as) options.as = 'string'
    if(Object.keys(this.associates).length == 0) return options.as == 'string' ? '' : undefined

    var divs = []

    if(options.title){
      if(true === options.title) options.title = 'Éléments associés'
      divs.push(DCreate(H3,{inner:options.title}))
    }
    if(this.associatesCounter){
      let assOpts = Object.assign({}, options)
      assOpts.as = 'dom'
      assOpts.owner = this
      let flag = LABELLED
      if(!options.forBook) flag = flag | DISSOCIABLE
      for(var assoType in this.associates){
        this.associates[assoType].map(assid => {
          divs.push(this.a.instanceOfElement({type:assoType,id:assid}).as('associate', flag, assOpts))
        })
      }
    } else {
      divs.push(DCreate(DIV,{class:'italic small indent2', inner:'(Aucun élément associé)'}))
    }

    if (options.as == 'string' || options.inDiv){
      divs = DCreate(DIV,{class:`associates ${this.domId}-associates`, append:divs})
    }

    // On retourne le résultat
    switch (options.as) {
      case 'string':
        return divs.innerHTML
      default:
        return divs // liste des divs ou le div
    }
  }

// ---------------------------------------------------------------------
// MÉTHODES D'ASSOCIATION

, associer(element){
    if (this.addToAssoList(element.type, element.id)){
      ++ this.associatesCounter
      this.updateInReader()
    }
  }
/**
  @param {Instance} element Contrairement à `associer`, ici, la méthode reçoit
                            l'instance de l'élément — qui existe forcément —
                            pour pouvoir notamment demander confirmation.
**/
, dissocier(element){
    if (this.remToAssoList(element.type, element.id)){
      -- this.associatesCounter
      this.updateInReader()
    }
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
      case 'time':   return id instanceof(OTime) ? id.seconds : parseFloat(id) ;
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
    if(Object.keys(h).length == 0) return
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
  , set(v){this._associates = v} // par exemple pour les events
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


/**
  Données communes pour dropper les events, documents et times
  @usage
    <set jquery>.droppable(
      Object.assign({drop: function(i,o){...}},DATA_ASSOCIATES_DROPPABLE)
    )
**/
const DATA_ASSOCIATES_DROPPABLE = {
  what: 'Donnée drop pour un élément qui peut recevoir des associables'
// , accept: ASSOCIATES_COMMON_METHODS.acceptableTypes()
, accept:(e)=>{return FADrop.acceptClass.bind(FADrop)(e)}
, tolerance: 'intersect'
, drop:(e, ui) => {
    let target = $(e.target)
      , helper = ui.helper
      , owner = {type: target.attr('data-type'), id: target.attr('data-id')}
      , owned = {type: helper.attr('data-type'), id:helper.attr('data-id')}
    current_analyse.associer(owner, owned)
    return stopEvent(e)
  }
, out:(e)=>{FADrop.busy = false}
, over:(e,ui)=>{
    if(FADrop.isBusy()){
      console.log("Le drop est déjà occupé")
      return stopEvent(e)
    } else {
      FADrop.busy = true
    }
    console.log("ici je poursuis l'event")
  }
, classes: {'ui-droppable-hover': 'survoled'}
, greedy: false
}

const DATA_ASSOCIATES_DRAGGABLE = {
    what:'Données drag pour un élément associable'
    // revert: true
  , helper: (e) => {
      if(isFunction(this.dragHelper)){
        return this.dragHelper()
      } else {
        var t = $(e.currentTarget)
          , i = current_analyse.instanceOfElement({type:t.attr('data-type'), id:t.attr('data-id')})
        return i.dragHelper()
      }
    }
  , cursorAt:{left:40, top:20}
  , start: e => {
      let container = $(e.target).parent()
      if(container){
        container.old_overflow = container.css('overflow')
        container.css('overflow','visible')
      }
    }
  , stop: e => {
      let container = $(e.target).parent()
      if(container){container.css('overflow', container.old_overflow)}
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


/**
  Cette constante est le mixin qui doit apporter toutes les
  méthode de drag&drop sur un champ de texte, qui doit donc permettre
  d'inscrire une balise quand on glisse l'élément sur le champ de texte
**/
const TEXTFIELD_ASSOCIATES_METHS = {
  what:'Methodes d’association pour les champs de texte'
/**
  Méthode pour rendre tous les champs de texte de +container+ sensibles
  au drag d'éléments associables

  Si +owner+ est défini, c'est un élément qui répond à 'type' et à 'id',
  qui permettra de le retrouver/connaitre lorsqu'on droppera un élément sur
  le champ. Mais en règle générale, il est inutile de le connaitre puisque
  c'est juste dans le champ qu'on va coller la balise de l'élément
**/
, setTextFieldsAssociableIn(container, owner){
    let jqSet = $(container).find('TEXTAREA, INPUT[type="text"]')
    // console.log("this.dataDroppableTF:", this.dataDroppableTF)
    jqSet.droppable(this.dataDroppableTF)
    if(undefined !== owner){
      jqSet
        .attr('data-type', owner.type)
        .attr('data-id', owner.id)
    }
  }

/**
  Méthode appelée au drop sur le champ de texte qui a été préparé grâce
  à la méthode `setTextFieldsAssociable` ou qui a été rendu droppable grâce
  à la table `this.dataDroppableTF`
**/
, onDropAssociableElement(e, ui){
    let helper  = $(ui.helper)
      , [eltype, elid]  = [helper.attr('data-type'), helper.attr('data-id')]
      , textAdded = '|texte/légende|style'
      , balise = `{{${eltype}:${elid}${textAdded}}}`

    $(e.target).insertAtCaret(balise)
    let selector = new Selector(e.target)
      , curOffset = selector.startOffset
    selector.startOffset  = curOffset - 2 - textAdded.length
    selector.endOffset    = curOffset - 2
    return stopEvent(e)
  }

}
const TEXTFIELD_ASSOCIATES_PROPS = {
  what:{get(){'Propriétés propres aux associations pour les drops dans les champs de texte'}}
  /**
    Définition des propriétés et méthode pour les champs de texte
    qui doivent répondre au droppable des éléments de l'analyse.
  **/
, dataDroppableTF:{get(){
    return {
      // accept: ASSOCIATES_COMMON_METHODS.acceptableTypes()
      accept:(e)=>{return FADrop.acceptClass.bind(FADrop)(e)}
    , drop: this.onDropAssociableElement.bind(this)
    , tolerance: 'intersect'
    , classes: {'ui-droppable-hover': 'survoled'}
    , greedy: false
    , out:(e)=>{FADrop.busy = false}
    , over:(e,ui)=> {
        if(FADrop.isBusy()){
          console.log("Le drop est déjà occupé")
          return stopEvent(e)
        } else {
          FADrop.busy = true
        }
        console.log("ici je poursuis l'event")
      }
    }
  }}
}


// console.log("ASSOCIATES_COMMON_PROPERTIES:", ASSOCIATES_COMMON_PROPERTIES)


module.exports = {
  ASSOCIATES_COMMON_PROPERTIES: ASSOCIATES_COMMON_PROPERTIES
, ASSOCIATES_COMMON_METHODS: ASSOCIATES_COMMON_METHODS
, DATA_ASSOCIATES_DRAGGABLE: DATA_ASSOCIATES_DRAGGABLE
, DATA_ASSOCIATES_DROPPABLE: DATA_ASSOCIATES_DROPPABLE
, TEXTFIELD_ASSOCIATES_METHS: TEXTFIELD_ASSOCIATES_METHS
, TEXTFIELD_ASSOCIATES_PROPS: TEXTFIELD_ASSOCIATES_PROPS
}

/**

  Does javascript create a new instance each time we create a string litteral?
**/
