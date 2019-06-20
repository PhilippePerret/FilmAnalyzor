'use strict'

describe("Modification d'un event", function(){

  // On crée une nouvelle analyse vierge avec trois events
  this.before(async()=>{
    var events = []
    events.push(FITEventIdee.create({time:30, duree:20}))
    events.push(FITEventNote.create({time:70, duree:20}))
    events.push(FITEventScene.create({time:60, duree:30}))
    // console.log("events:", events)
    this.ca = await FITAnalyse.createAndLoad({
        personnages:0, brins:0, documents:0, scenes:0
      , events: events
    })
  })

  this.case("On peut modifier les events", async () => {

    sumarize(`
      - on peut éditer un event en cliquant son bouton dans le reader
      - on peut éditer un event en cliquant son élément dans la timeline

      `)

    await wait(4000)
    await waitFor(()=>{return !isNaN(UI.video.duration)})

    var e1 = this.ca.events[0]
    action("On clique sur le bouton d'édition dans le reader", async()=>{
      // On prend le premier event de l'analyse
      // console.log("e1= ", e1)
      // On se rend à son temps
      goToTime(e1.time)
      // await wait(1000) // le temps d'afficher l'élément
      const btnEdit = `#reader #reader-event-${e1.id} .e-tools .btn-edit`
      await waitFor(()=>{return DOM.exists(btnEdit)})
      click(btnEdit)
    })

    // Le formulaire d'édition doit être ouvert et correctement rempli
    await expect(FITDom(`form#form-edit-event-${e1.id}`)).exists()

    // await expect(FrontFWindow).is_event_form()
    const frontForm = FrontEventForm
    console.log("frontForm:", frontForm)
    expect(frontForm).complies_with({
      type: e1.type, isNew: true, time:e1.time,
      titre:e1.titre, longtext1:e1.content
    })


  })
})
