'use strict'

// On crée une nouvelle instance sujet qui permettra de déterminer plus
// facilement les choses
class EventFormSubject extends FITSubject {
  constructor(name){
    super(name)

    // La valeur (value) pour les assertions
    this.subject_value   = EventForm.current

    // Les assertions
    this.assertions = {
      complies_with(expected, options){
        const res = EventFormCompliesWith(this, expected)
        const pass = res.ok === this.positive
        var expe = JSON.stringify(expected)
        if ( !res.ok ) expe += `\n\t${res.bads.join(', ')}`
        const msgs = this.assertise(this.subject, 'est','conforme à', expe)
        assert(pass, ...msgs, options)
      }
    }
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
    case 'description': prop = 'longtext1'; break
  }
  return `#event-${this.eventId}-${prop}`
}

get eventId(){return this.eventForm.id }
get jqObj(){return this.eventForm.jqObj}
// Juste pour la clarté
get eventForm(){return this.subject_value}
}

// Pour évaluer le formulaire
function EventFormCompliesWith(owner, hexp){
  const iform = owner.value
  const oform = iform.jqObj
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
  return {ok: bads.length === 0, goods:goods, bads:bads}
}

Object.defineProperties(global,{
  FrontEventForm:{get(){return new EventFormSubject()}}
})
