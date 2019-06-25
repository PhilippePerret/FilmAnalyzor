'use strict'
/**
  Test de l'édition d'un event dans son formulaire
  Pour voir si les menus se règlent bien et si les champs se remplissent bien
**/
describe("Édition d'un event dans son formulaire", function(){

  this.before(async()=>{
    // Créer une analyse avec 10 events
    this.ca = await FITAnalyse.createAndLoad({
        personnages:0, brins:0, documents:0, scenes:4
      , events:10 // pour avoir tous les types
    })
  })
  this.case("Une édition de note s'affiche bien", async()=>{
    pending()
    // On cherche la note
    const eNote = current_analyse.events.filter(ev => ev.type === 'note')[0]
    expect(eNote).is_defined({onlyFailure:"Impossible de trouver un event note de l'analyse."})
    // console.log("eNote:", eNote)
    const eCANote = CurrentAnalyse.getEvent(eNote.id)
    expect(eCANote).is_defined({onlyFailure:"Impossible de trouver le CurrentAnalyseEvent note pour les tests."})
    // console.log("eCANote:", eCANote)
    await action("On clique sur le bouton d'édition de la note pour l'éditer", async () => {
      await goToTime(eNote.time)
      eCANote.clickEditButton()
    })

    // On s'assure que le formulaire d'édition des events est bien la fenêtre
    // au premier plan.
    expect(FrontFWindow).is_event_form()
    // Le titre (facile)
    expect(t(eNote.titre)).not.is_empty({onlyFailure:"Le titre de la note devrait être défini."})
    expect(t(eNote.content)).not.is_empty({onlyFailure:"La description de la note devrait être définie."})
    expect(eNote.noteType, 'eNote.noteType').is_defined()
    expect(t(eNote.noteType)).not.is_empty({onlyFailure:"Le type (noteType) de la note devrait être défini."})
    expect(FrontEventForm).has_values({
        id: eNote.id
      , titre:eNote.titre
      , is_new: '0'
      , type: 'note'
      , time: eNote.time // attribut "value"
      , duree: eNote.duree // attribut "value"
      , noteType: eNote.noteType // select
      , content: eNote.content
      , curimage: eNote.curimage // checkbox
      , parent: eNote.parent // hidden
    })

    // la descrition (content - facile)
    // le temps (facile)
    // la durée (facile)
    // Le menu de type de note
  })
  this.case("Une édition de scène s'affiche bien", async()=>{
    pending()
    // Le numéro
    // Le décor et sous-décor
    // L'effet et le lieu
  })
  this.case("Une édition de procédé s'affiche bien", async () => {
    pending()
    // Le menu du type de procédé
  })

})
