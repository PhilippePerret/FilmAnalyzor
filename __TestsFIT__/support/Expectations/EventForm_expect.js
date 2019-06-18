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
        const msgs = this.assertise('est','conforme à', this.subject, expe)
        assert(pass, ...msgs, options)
      }
    }
  }
  // Le titre pour les messages
  get subject_message(){return 'Le formulaire d’event courant'}
  get options(){ return {noRef:true} }

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

// Object.assign(FrontEventForm, EventFormExpectations)
// FITExpectation.add(EventFormExpectations)
