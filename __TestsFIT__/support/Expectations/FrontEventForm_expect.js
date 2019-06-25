'use strict'

// On crée une nouvelle instance sujet qui permettra de déterminer plus
// facilement les choses
class EventFormSubject extends FITSubject {
// ---------------------------------------------------------------------
//  ASSERTIONS

/*
  @method expect(FrontEventForm).has_value(expected, fieldProp, options)
  @description Produit un succès si le champ de la propriété +fieldProp+ contient la valeur +expected+
  @provided
    :expected {String} Valeur attendue.
    :expected {Object} Un hash contenant en clé la propriété et en valeur la valeur attendue. Dans ce cas, fieldProp n'est pas fourni
    :fieldProp {String} Propriété du champ, par exemple 'longtext1'. Attention, ça ne correspond pas forcément à la propriété de l'event. Voir la construction du formulaire pour trouver la correspondance ou regarder dans la définition des propriétés de l'instance. Si c'est un array à deux valeurs, la seconde est l'affixe du champ.
    :fieldProp {None} Pas fourni si +expected+ est un hash. Le second argument est alors les options.
    :options {Object} Les [options classiques des assertions](#options_assertions)
  @returned Un succès si la valeur correspond.
  @usage expect(EventForm).has_value('Mon titre', 'shortext1')
 */
has_value(expected, propField, options){
  if ( Object.isObject(expected) ) {
    options = propField
  } else {
    expected = {[propField]: expected}
  }
  var pass
    , bads = []
  let resultat = this.newResultat({
      verbe:'contient', objet: "les attributs attendus (cf. ci-dessous)"
    , options:options
  })
  resultat.detailObjet = `${JSON.stringify(expected)}`
  for ( var prop in expected ) {
    // console.log("ID du champ : ", this.fieldId(prop))
    var field = $(this.fieldId(prop))
    // console.log("Champ : ", field)
    var dFieldValue = DOM.getValueOfField(this.fieldId(prop))
    // console.log("dFieldValue = ", dFieldValue)
    if ( dFieldValue && dFieldValue.value == expected[prop] ) {
      // OK
    } else {
      bads.push(`La propriété "${prop}" devrait avoir la valeur "${expected[prop]}". Elle vaut "${dFieldValue.value}"`)
    }
  }
  pass = bads.length === 0
  pass || ( resultat.detailFailure = bads.join(RC) )
  return assert(resultat.validIf(pass))
}
/*
  @method expect(FrontEventForm).complies_with(expected, options)
  @description Produit un succès si les propriétés du formulaire courant correspondent à +expected+
  @provided
    :expected {Object} Hash des prop/value attendues
    :options {Object} Les [options classiques des assertions](#options_assertions)
  @usage expect(EventForm).complies_with({isNew:true})
 */
complies_with(expected, options){
  let resultat = this.newResultat({
      verbe:      'est'
    , comp_verbe: 'conforme à'
    , objet:      JSON.stringify(expected)
    , options:    options
  })

  // C'est cette méthode qui utilise le resultat.validIf
  this.eventFormCompliesWith(expected, resultat)
  assert(resultat)
}

// /ASSERTIONS
// ---------------------------------------------------------------------


constructor(name){
  super("Le formulaire d'event courant")
  // La valeur (value) pour les assertions
  this.currentForm  = EventForm.current
  this.sujet = "Le formulaire d'event courant"
  // Les assertions
  Object.assign(this.assertions,{
      complies_with: this.complies_with.bind(this)
    , has_value: this.has_value.bind(this)
    , has_values: this.has_value.bind(this)
  })
}

// Le titre pour les messages
get subject_message(){return 'Le formulaire d’event courant'}
get options(){ return {noRef:true} }

/**
  Méthode pour définir les valeurs du formulaire
**/
set(hash){
  for ( var prop in hash ){
    this.jqObj.find(this.fieldId(prop)).val(hash[prop])
  }
}

// Pour mettre le formulaire courant comme modifié
setModified(){this.eventForm.modified = true}

// Retourne l'id DOM du champ contenant la propriété +prop+
fieldId(prop){
  switch (prop) {
    case 'content': prop = 'longtext1'; break
  }
  return `#event-${this.eventId}-${prop}`
}

get eventId(){return this.eventForm.id }
get jqObj(){return this.eventForm.jqObj}
// Juste pour la clarté
get eventForm(){return this.currentForm}


// Pour évaluer le formulaire
eventFormCompliesWith(hexp, resultat){
  const iform = this.eventForm
  const oform = this.jqObj
  var goods = []
  var bads  = []
  for ( var prop in hexp ) {
    var expected = hexp[prop]
    var actual = ((p) => {
      switch (prop) {
        case 'type'     : return iform.type
        case 'isNew'    : return iform.isNew
        case 'time'     : return iform.time
        case 'id'       : return iform.id
        case 'event'    : return iform.event
      }
    })(prop)

    if ( actual == expected ) {
      goods.push(prop)
    } else {
      // bads.push({prop:prop, expected:expected, actual:actual})
      bads.push(`${prop} : ${expected} attendu, ${actual} trouvé`)
    }
  }
  resultat.validIf(bads.length === 0)
  resultat.detailFailure = bads.join(', ')
}


}


Object.defineProperties(global,{
  FrontEventForm:{get(){return new EventFormSubject()}}
})
