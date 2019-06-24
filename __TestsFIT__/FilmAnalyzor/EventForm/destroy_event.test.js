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
  })

  this.case("Le formulaire permet de détruire un event", async () => {
    expect(n(current_analyse.events.length),'Le nombre d’events dans FAnalyse#events').is(10)
    expect(n(Object.keys(current_analyse.ids).length),'Le nombre d’events dans FAnalyse#ids').is(10)

    // On prend le premier event
    const e = current_analyse.events[0]
        , event_id = parseInt(e.id,10)

    // CONTRE VÉRIFICATIONS
    // Les contre vérifications qui seront faites plus tard
    expect(CurrentAnalyse).not.is_modified()
    var arr = current_analyse.events.map(e => event_id)
    expect(a(arr),"La liste current_analyse.events (ids)").contains(event_id)
    expect(current_analyse.ids[event_id],`current_analyse.ids[${event_id}]`).is_defined()
    expect(d(`#banctime-tape #banctime-event-${event_id}`)).exists()
    expect(d(`#reader #reader-event-${event_id}`)).exists()
    // On prend le nombre actuel d'item sur la rangée de l'event dans la timeline
    const btelement_row = e.btelement.row
        , init_nombre_on_row = BancTimeline.map[btelement_row].length

    // On édite le premier event
    // console.log("e:", e)
    EventForm.editEvent(e)
    // Le formulaire d'event doit être au premier plan
    expect(FrontFWindow).is_event_form({onlyFailure:true})
    // On clique sur le bouton "Détruire"
    const btnDestroyJPath = `#form-edit-event-${event_id} button#event-${event_id}-destroy`
    await action("On clique sur le bouton « Détruire »", async () => {
      click(btnDestroyJPath)
    })
    // Une fenêtre de confirmation doit être ouverte
    await expect(d(`#mbox-confirm-destroy-event-${event_id}`), 'La fenêtre de confirmation').is_visible()
    const btnAnnulerDestroy = `#mbox-confirm-destroy-event-${event_id} .button-0`
    await action("On renonce à la destruction en cliquant sur le bouton Annuler", async()=>{
      click(btnAnnulerDestroy)
    })
    await expect(d(`#mbox-confirm-destroy-event-${event_id}`), 'La fenêtre de confirmation').not.exists()

    await action("On clique à nouveau sur le bouton « Détruire » du formulaire", async () => {
      click(btnDestroyJPath)
    })
    await expect(d(`#mbox-confirm-destroy-event-${event_id}`), 'La fenêtre de confirmation').is_visible()
    const btnConfirmDestroy = `#mbox-confirm-destroy-event-${event_id} .button-1`
    await action("On confirme la destruction en cliquant le bouton « Détruire »", async()=>{
      click(btnConfirmDestroy)
    })

    // ---------------------------------------------------------------------
    // TOUTES LES VÉRIFICATIONS

    // L'analyse a été marquée modifiée
    // TODO : cette vérification devrait être dans le support
    expect(CurrentAnalyse).is_modified()

    await expect(d(`#mbox-confirm-destroy-event-${event_id}`), 'La fenêtre de confirmation').not.exists()
    // Ne doit plus exister dans ca.events
    var arr = current_analyse.events.map(et => et.id)
    expect(a(arr),'La liste des events').not.contains(event_id)
    // Ne doit plus exister dans ca.ids
    expect(current_analyse.ids[event_id],`current_analyse.ids[${event_id}]`).is_undefined()
    // L'event a dû être retiré de la TimeMap générale
    // TODO
    // Ne doit plus exister dans la Timeline
    await expect(d(`#banctime-tape #banctime-event-${event_id}`), 'L’item Timeline').not.exists()
    // L'event a dû être retiré de la map de la timeline
    expect(n(BancTimeline.map[btelement_row].length),'Le nombre d’éléments sur la rangée timeline').is(init_nombre_on_row - 1)
    // Ne doit plus exister dans le reader
    await expect(d(`#reader #reader-event-${event_id}`), 'L’item Reader').not.exists()
    // L'event ne doit plus exister dans le fichier event.json
    await waitFor(() => {return current_analyse.modified === false}, "J'attends que l'analyse soit sauvegardée.")
    // TODO
    expect(CurrentAnalyse).not.contains_in_events_file({id:event_id})

    // Le formulaire doit avoir été fermé et détruit
    await expect(FrontFWindow).not.is_event_form({onlyFailure:true})
    await expect(d(`#form-edit-event-${event_id}`)).not.exists()


  })

  this.case("La destruction d'une scène produit plus de travail", async ()=>{
    // TODO Le numéro des scènes doit avoir été corrigé
  })
})
