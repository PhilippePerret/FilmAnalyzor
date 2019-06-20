'use strict'

// On crée une nouvelle instance sujet qui permettra de déterminer plus
// facilement les choses
class EventFormSubject extends FITSubject {
  constructor(name){
    super(name)

    // La valeur (value) pour les assertions
    this.currentForm  = EventForm.current
    this.sujet = "Le formulaire d'event courant"

    // Les assertions
    this.assertions = {
      complies_with: this.complies_with.bind(this)
    }
  }

// ---------------------------------------------------------------------
//  ASSERTIONS

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
    case 'description': prop = 'longtext1'; break
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
