'use strict'
/**
  Test de la destruction d'un event par le biais du formulaire
  d'édition des events
**/
describe("Destruction d'un event à l'aide du formulaire d'édition", async function(){

  this.before(async()=>{
    // Créer une analyse avec 10 events
    this.ca = await FITAnalyse.createAndLoad({
        personnages:0, brins:0, documents:0, scenes:0
      , events:10
    })
    console.log("J'ai créé l'analyse pour le test")
  })

  this.case("Le formulaire permet de détruire un event", async () => {
    expect(n(current_analyse.events.length),'Le nombre d’events dans FAnalyse#events').is(10)
    expect(n(Object.keys(current_analyse.ids).length),'Le nombre d’events dans FAnalyse#ids').is(10)

    // On prend le premier event
    const e = current_analyse.events[0]

    // CONTRE VÉRIFICATIONS
    // Les contre vérifications qui seront faites plus tard
    var arr = current_analyse.events.map(e => e.id)
    expect(a(arr)).contains(e.id)
    expect(current_analyse.ids[e.id]).is_defined()
    expect(d(`#banctime-tape #banctime-event-${e.id}`)).exists()
    expect(d(`#reader #reader-event-${e.id}`)).exists()

    // On édite le premier event
    // console.log("e:", e)
    EventForm.editEvent(e)
    // Le formulaire d'event doit être au premier plan
    expect(FrontFWindow).is_event_form({onlyFailure:true})
    // On clique sur le bouton "Détruire"
    const btnDestroyJPath = `#form-edit-event-${e.id} button#event-${e.id}-destroy`
    await action("On clique sur le bouton « Détruire »", async () => {
      click(btnDestroyJPath)
    })
    // Une fenêtre de confirmation doit être ouverte
    await expect(d(`#mbox-confirm-destroy-event-${e.id}`), 'La fenêtre de confirmation').is_visible()
    const btnAnnulerDestroy = `#mbox-confirm-destroy-event-${e.id} .button-0`
    await action("On renonce à la destruction en cliquant sur le bouton Annuler", async()=>{
      click(btnAnnulerDestroy)
    })
    await expect(d(`#mbox-confirm-destroy-event-${e.id}`), 'La fenêtre de confirmation').not.exists()

    await action("On clique à nouveau sur le bouton « Détruire » du formulaire", async () => {
      click(btnDestroyJPath)
    })
    await expect(d(`#mbox-confirm-destroy-event-${e.id}`), 'La fenêtre de confirmation').is_visible()
    const btnConfirmDestroy = `#mbox-confirm-destroy-event-${e.id} .button-1`
    await action("On confirme la destruction en cliquant le bouton « Détruire »", async()=>{
      click(btnConfirmDestroy)
    })
    await expect(d(`#mbox-confirm-destroy-event-${e.id}`), 'La fenêtre de confirmation').not.exists()

    // ---------------------------------------------------------------------
    // TOUTES LES VÉRIFICATIONS

    // TODO Ne doit plus exister dans ca.events
    var arr = current_analyse.events.map(et => et.id)
    expect(a(arr),'La liste des events').not.contains(e.id)
    // TODO Ne doit plus exister dans ca.ids
    expect(current_analyse.ids[e.id]).is_undefined()
    // TODO Ne doit plus exister dans la Timeline
    expect(d(`#banctime-tape #banctime-event-${e.id}`)).not.exists()
    // TODO Ne doit plus exister dans le reader
    expect(d(`#reader #reader-event-${e.id}`)).not.exists()
    // TODO L'event ne doit plus exister dans le fichier event.json

    // Le formulaire doit avoir été fermé et détruit
    expect(FrontFWindow).is_event_form({onlyFailure:true})
    expect(d(`#form-edit-event-${e.id}`)).not.exists()


  })

  this.case("La destruction d'une scène produit plus de travail", async ()=>{
    // TODO Le numéro des scènes doit avoir été corrigé
  })
})
