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

    action("On clique sur le bouton d'édition dans le reader", async()=>{

    })

  })
})
