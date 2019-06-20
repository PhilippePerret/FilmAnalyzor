'use strict'

describe("Création d'un event", function(){

  // On crée une nouvelle analyse vierge
  this.before(async () => {
    this.ca = FITAnalyse.create(EMPTY)
    await this.ca.load()
  })

  this.case("Création d'une idée au temps voulu", async () => {


    // ---------------------------------------------------------------------
    // ÉTAT PRÉLIMINAIRE DE L'ANALYSE

    // 'inica' pour "init state of Current Analyse"
    const inica = AnalyseState

    // ---------------------------------------------------------------------
    //  OPÉRATION

    await action("On se rend à 32 secondes et on presse « n » puis « i »", async () => {
      goToTime(32)
      await wait(500)
      keyPress('n')
      await wait(500)
      keyPress('i')
      await wait(500)
    })

    // Le formulaire d'event est bien la fenêtre courante
    expect(FrontFWindow).is_event_form()
    expect(FrontFWindow).not.is_porte_documents()

    const frontForm = FrontEventForm
    expect(frontForm).complies_with({
      type: 'idee', isNew: true, time:32
    })

    // ID du nouvel event qui va être créé
    const new_event_id = frontForm.eventId
    // console.log("frontForm",frontForm)

    await action("On presse la touche tabulation pour entrer dans le titre", () => {
      keyPress('Tab')
    })
    expect(UI.currentShortcutsName, 'La combinaison shortcuts courante').is('TEXT FIELD')

    const nev_titre = `Un titre ${new Date().getTime()}`
    const description = `La description du titre ${nev_titre} est ${new Date()}.`

    await action("On choisit le type « Majeure »", async()=>{
      frontForm.set({ideeType: 'major'})
    })
    await action(`On écrit le titre « ${nev_titre} »`, async () => {
      frontForm.set({titre:nev_titre})
    })
    await action(`On écrit la description « ${description.substring(0,40)} […] »`, async() => {
      frontForm.set({description:description})
    })

    await action("On soumet le formulaire", async () => {
      frontForm.setModified()
      // await wait(2000)
      keyPress('Enter',{metaKey:true})
    })

    // ---------------------------------------------------------------------
    // Vérifications

    // On prend l'état
    const curca /* contre inica */ = AnalyseState

    // // Il doit y avoir un event de plus
    // TODO : faire plutôt un sujet complexe de l'analyse courante
    expect(curca.eventsCount,'Le nombre d’events').is(inica.eventsCount + 1)

    // Il ne doit pas y avoir de scènes en plus
    expect(curca.scenesCount,{subject:'Le nombre de scènes'}).is(inica.scenesCount)

    // L'event possède le bon ID et la bonne classe
    const new_event = current_analyse.ids[new_event_id]
    expect(new_event).is_instanceof(FAEidee)
    // L'event possède les bonnes données
    expect(new_event.id).is(new_event_id)
    expect(new_event.titre,'Le titre de l’event').is(nev_titre)
    expect(new_event.description, 'La description de l’event').is(description)
    expect(new_event.installation, 'L’installation').is_undefined()

    // L'event a été ajouté dans la Timeline
    expect(FITTimeline).contains(new_event, {top: 20})

    // L'event a été ajouté dans le reader
    expect(FITReader).contains(new_event, {shown:true})

    await waitFor(()=>{return current_analyse.modified == false}, {
        message: "J'attends que l'analyse (modifiée) soit enregistrée."
      , failure: "L'application n'a pas été enregistrée, apparemment (son modified reste à true)"
    })

    // L'event a bien été enregistré
    expect(EventsFile).contains({id:new_event.id, titre:nev_titre, content:description})


  })

  // this.case('On peut créer un procédé', async () => {
  //   pending()
  //   // await action("On presse «n» puis «p»", async () => {
  //   //   keyPress('n')
  //   //   await wait(200)
  //   //   keyPress('p')
  //   //   await wait(200)
  //   // })
  // })
  //
  // this.case('On peut créer un noeud structurel', async()=>{
  //   tester("La création du noeud dramatique")
  // })
})
