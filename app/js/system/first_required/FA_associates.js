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
  types_associates: [STRevent, STRpersonnage, STRdocument, STRtime, STRbrin, STRimage]

  /**

    Répète la méthode +fn+ sur tous les éléments associés de
    type +type+ (le nom du type au singulier)

    @param {String} type  Soit STRevent, STRdocument, STRtime, etc.

  **/
, forEachAssociate(type, fn){
    if(type === STRtime){
      for(var assoEvent of this[`${type}s`]){
        if ( isFalse(fn(new OTime(assoEvent))) ) break;
      }
    } else {
      for(var iAsso of this[`instances_${type}s`]){
        if ( isFalse(fn(iAsso)) ) break;
      }
    }
  }

, acceptableTypes(){
    isDefined(this._acceptabletypes) || (
      this._acceptabletypes = this.types_associates.map(t => `.${t}`).join(', ')
    )
    return this._acceptabletypes
  }

// ---------------------------------------------------------------------
//  MÉTHODES D'HELPER

, dragHelper(){
    let div = `<div id="draghelper" style="z-index:5000;" class="${this.metaType||this.type} draghelper" data-type="${this.metaType||this.type}" data-id="${this.id}">${this.toString()}</div>`
    $(document.body).append($(div))
    return $('#draghelper')
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
    return DCreate(A, {class:'lktool lkdisso', inner:'dissocier', attrs:{onclick:`current_analyse.dissocier({type:'${options.owner.metaType||options.owner.type}',id:'${options.owner.id}'}, {type:'${this.metaType||this.type}', id:'${this.id}'})`}})
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
    options = options || {}
    isDefined(options.as) || ( options.as = STRstring )
    if ( isEmpty(this.associates) ) return options.as == STRstring ? '' : undefined

    var divs = []

    if(options.title){
      isTrue(options.title) && ( options.title = 'Éléments associés' )
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
            try {
              divs.push(this.a.instanceOfElement({type:assoType,id:assid}).as(STRassociate, flag, assOpts))
            } catch (e) {
              log.error(`ERREUR AVEC ${this}
                Méthode : divsAssociates
                Arguments : ${options}
                Propriétaire : ${this}
                Type d'associé : ${assoType}
                ID associé : ${assid}
                ERROR:
                `)
              log.error(e)
              log.error("Donnée complète des associés : ", this.associates)
            }
          })
      }
    } else {
      divs.push(DCreate(DIV,{class:'italic small indent2', inner:'(Aucun élément associé)'}))
    }

    if ( options.as == STRstring || options.inDiv ) {
      divs = DCreate(DIV,{class:`associates ${this.domId}-associates`, append:divs})
    }

    // On retourne le résultat
    switch (options.as) {
      case STRstring:
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
      isFunction(this.updateInReader) && this.updateInReader()
    }
  }
/**
  @param {Instance} element Contrairement à `associer`, ici, la méthode reçoit
                            l'instance de l'élément (*)
                            pour pouvoir notamment demander confirmation.
                            (*) qui peut être un FAUnknownElement
**/
, dissocier(element){
    if (this.remToAssoList(element.type, element.id)){
      -- this.associatesCounter
      isFunction(this.updateInReader) && this.updateInReader()
    }
  }

/**
  Méthode générique pour ajouter une association
**/
, addToAssoList(list_id, asso_id){
    // Modification peut-être nécessaire de l'id
    asso_id = this.realAssoId(list_id, asso_id)
    isDefined(this.associates[list_id]) || ( this.associates[list_id] = [] )
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
    isDefined(this.associates[list_id]) || ( this.associates[list_id] = [] )
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
      case STRtime:   return id instanceof(OTime) ? id.seconds : parseFloat(id) ;
      case STRevent:  return parseInt(id,10)
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
    if ( isEmpty(h) ) return
    return h
  }

, hasAssociates(){return this.associatesCounter > 0}

}//assign

let ASSOCIATES_COMMON_PROPERTIES = {
  /**
    Tables des associés telle qu'elle est enregistrée dans la donnée

    Mais dans la donnée, seules les listes contenant des éléments sont
    enregistrées. Donc on peut se retrouver avec une valeur pour associates
    qui est donnée, mais une clé inexistante (par exemple la clé STRbrin)

    Au premier appel de `associates`, il faut donc s'assurer que toutes les
    listes d'associés soit préparées.

  **/
  associates:{
    get(){
      if ( isUndefined(this._associates) ) {
        this._associates = {}
        ASSOCIATES_COMMON_METHODS.types_associates.map(typ => {
          this._associates[typ] = []
        })
      } else if ( isUndefined(this._associates_inited) ){
        ASSOCIATES_COMMON_METHODS.types_associates.map(typ => {
          isDefined(this._associates[typ]) || ( this._associates[typ] = [] )
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
      if( isUndefined(this._associatesCounter) ){
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
, drop:(e, ui) => {
    if (FADrop.isNotCurrentDropped(e.target)) return stopEvent(e)
    let target = $(e.target)
      , helper = ui.helper
      , owner = {type: target.attr(STRdata_type), id: target.attr(STRdata_id)}
      , owned = {type: helper.attr(STRdata_type), id:helper.attr(STRdata_id)}
    current_analyse.associer(owner, owned)
    return stopEvent(e)
  }
, accept:   ASSOCIATES_COMMON_METHODS.acceptableTypes()
, out:      FADrop.out.bind(FADrop)
, over:     FADrop.over.bind(FADrop)
, tolerance: 'intersect'
, classes: {'ui-droppable-hover': 'survoled'}
, greedy: true
}

const DATA_ASSOCIATES_DRAGGABLE = {
    what:'Données drag pour un élément associable'
    // revert: true
  , helper: (e) => {
      if(isFunction(this.dragHelper)){
        return this.dragHelper()
      } else {
        var t = $(e.currentTarget)
          , i = current_analyse.instanceOfElement({type:t.attr(STRdata_type), id:t.attr(STRdata_id)})
        return i.dragHelper()
      }
    }
  , cursorAt:{left:40, top:20}
  , start: e => {
      let container = $(e.target).parent()
      if ( container ) {
        container.old_overflow = container.css('overflow')
        container.css('overflow',STRvisible)
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
    let jqSet = $(container).find(TEXT_TAGNAMES)
    // console.log("this.dataDroppableTF:", this.dataDroppableTF)
    jqSet.droppable(this.dataDroppableTF)
    if( isDefined(owner) ){
      jqSet
        .attr(STRdata_type, owner.type)
        .attr(STRdata_id, owner.id)
    }
  }

/**
  Méthode appelée au drop sur le champ de texte qui a été préparé grâce
  à la méthode `setTextFieldsAssociable` ou qui a été rendu droppable grâce
  à la table `this.dataDroppableTF`

  Attention : deux types de champs peuvent être droppés ici : les textareas
  et les input-text. Lorsque ce sont les premiers, il faut coller une balise
  sans sourciller.
  Lorsque ce sont les seconds, il faut regarder si c'est un temps qui est
  transmis et voir si le champ attend un temps. Par exemple, le champ de la
  propriété `tps_reponse`, dans l'EventForm, attend une horloge, pas une
  balise.

**/
, onDropAssociableElement(e, ui){
    if (FADrop.isNotCurrentDropped(e.target)) return stopEvent(e)
    let helper  = $(ui.helper)
      , target  = $(e.target)
      , [eltype, elid]  = [helper.attr(STRdata_type), helper.attr(STRdata_id)]

    if (this.droppedAndReceiverAreSameElement(target, helper)) return

    let isHorloge = eltype == STRtime && target.hasClass(STRhorloge)

    var balise, textAdded

    if(isHorloge){
      balise = (new OTime(elid)).horloge
    } else {
      // Un textarea ou un input-text
      textAdded = '|texte/légende|style'
      balise = `{{${eltype}:${elid}${textAdded}}}`
    }

    target.insertAtCaret(balise)

    // if (isTextarea(target)){
    if (!isHorloge){
      let selector = new Selector(e.target)
      , curOffset = selector.startOffset
      selector.startOffset  = curOffset - 2 - textAdded.length
      selector.endOffset    = curOffset - 2
    }

    delete FADrop.current
    return stopEvent(e)
  }

/**
  Méthode qui retourne true si les DOMElements(jQset) +receiver+ et +dropped+
  sont les mêmes éléments (data-type et data-id identiques). La méthode doit
  empêcher de placer une balise pour élément dans un texte de cet élément.

  @param {DOMElement|jqSet} receiver  Élément DOM qui reçoit l'élément droppé
  @param {DOMElement|jqSet} dropped   Élément DOM droppé

  @return {Boolean} true si égalité

**/
, droppedAndReceiverAreSameElement(receiver, dropped){
    let r_type  = isDOMElementWithAttribute($(receiver),  STRdata_type)
      , r_id    = isDOMElementWithAttribute($(receiver),  STRdata_id)
      , d_type  = isDOMElementWithAttribute($(dropped),   STRdata_type)
      , d_id    = isDOMElementWithAttribute($(dropped),   STRdata_id)

    return (r_type == d_type) && (r_id) == (d_id)
  }

} // /const TEXTFIELD_ASSOCIATES_METHS

const TEXTFIELD_ASSOCIATES_PROPS = {
  what:{get(){'Propriétés propres aux associations pour les drops dans les champs de texte'}}
  /**
    Définition des propriétés et méthode pour les champs de texte
    qui doivent répondre au droppable des éléments de l'analyse.
  **/
, dataDroppableTF:{get(){
    return {
      accept: ASSOCIATES_COMMON_METHODS.acceptableTypes()
    , drop: this.onDropAssociableElement.bind(this)
    , tolerance: 'intersect'
    , classes: {'ui-droppable-hover': 'survoled'}
    , greedy: true
    , out:  FADrop.out.bind(FADrop)
    , over: FADrop.over.bind(FADrop)
    }
  }}
}

module.exports = {
  ASSOCIATES_COMMON_PROPERTIES: ASSOCIATES_COMMON_PROPERTIES
, ASSOCIATES_COMMON_METHODS: ASSOCIATES_COMMON_METHODS
, DATA_ASSOCIATES_DRAGGABLE: DATA_ASSOCIATES_DRAGGABLE
, DATA_ASSOCIATES_DROPPABLE: DATA_ASSOCIATES_DROPPABLE
, TEXTFIELD_ASSOCIATES_METHS: TEXTFIELD_ASSOCIATES_METHS
, TEXTFIELD_ASSOCIATES_PROPS: TEXTFIELD_ASSOCIATES_PROPS
}
