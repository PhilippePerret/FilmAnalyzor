'use strict'

// On crée une nouvelle instance sujet qui permettra de déterminer plus
// facilement les choses
const fef = new FITSubject('FrontEventForm')

// La valeur pour les assertions
fef.subject_value   = EventForm.current

// Le titre pour les messages
fef.subject_message = 'Le formulaire d’event courant'

// Les assertions
fef.assertions = {
  complies_with(expected, options){
    const pass = true
    const expe = JSON.stringify(expected)
    const msgs = this.assertise('est','conforme à', this.subject, expe)
    assert(pass, ...msgs, options)
  }
}

global.FrontEventForm = fef

// Object.assign(FrontEventForm, EventFormExpectations)
// FITExpectation.add(EventFormExpectations)
