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
  })


  this.case("Une édition de scène s'affiche bien", async()=>{

    const eScene    = current_analyse.events.filter(ev => ev.type === 'scene')[0]
    expect(eScene).is_defined({onlyFailure:"Impossible de trouver un event scène de l'analyse."})
    const caeScene  = CurrentAnalyse.getEvent(eScene.id)
    expect(caeScene).is_defined({onlyFailure:"Impossible de trouver le CurrentAnalyseEvent scène pour les tests."})

    await action("On clique sur le bouton d'édition de la note pour l'éditer", async () => {
      await goToTime(eScene.time)
      caeScene.clickEditButton()
    })

    // On s'assure que le formulaire d'édition des events est bien la fenêtre
    // au premier plan.
    expect(FrontFWindow).is_event_form()

    // On s'assure que certains valeurs obligatoires de la scène soient définies
    expect(t(eScene.titre)).not.is_empty({onlyFailure:"Le titre de la scène (pitch) devrait être défini."})
    expect(eScene.numero).is_defined({onlyFailure:"Le numéro de la scène devrait être défini"})
    expect(eScene.decor).is_defined({onlyFailure:"Le décor de la scène devrait être défini"})
    expect(eScene.sous_decor).is_defined({onlyFailure:"Le sous-décor de la scène devrait être défini"})
    expect(eScene.effet).is_defined({onlyFailure:"L'effet de la scène devrait être défini"})
    expect(eScene.lieu).is_defined({onlyFailure:"Le lieu de la scène devrait être défini"})
    expect(FrontEventForm).has_values({
      id: eScene.id, titre: eScene.titre, is_new:'0', type:'scene', time:eScene.time,
      duree:eScene.duree, content:eScene.content, curimage:eScene.curimage,
      // Les propriétés propres
      numero:eScene.numero,
      shorttext1:eScene.decor, shorttext2:eScene.sous_decor, lieu:eScene.lieu, effet:eScene.effet,
      sceneType:eScene.sceneType||'n/d'
    })
  })

  this.case("Une édition de procédé s'affiche bien", async () => {
    const eProc = current_analyse.events.filter(ev => ev.type === 'proc')[0]
    expect(eProc).is_defined({onlyFailure:"Impossible de trouver un procédé dans l'analyse courante."})
    const caeProc = CurrentAnalyse.getEvent(eProc.id)
    expect(caeProc).is_defined({onlyFailure:"Impossible de récupérer le procédé de test dans l'analyse courante."})

    await action("On se rend au procédé et on clique sur le bouton d'édition du procédé pour l'éditer", async () => {
      await goToTime(eProc.time)
      caeProc.clickEditButton()
    })

    // On s'assure que le formulaire d'édition des events est bien la fenêtre
    // au premier plan.
    expect(FrontFWindow).is_event_form()

    // Les valeurs qui doivent impérativement être définies pour le test
    expect(t(eProc.titre)).not.is_empty({onlyFailure:"Le titre du procédé devrait être défini."})
    expect(t(eProc.content)).not.is_empty({onlyFailure:"La description du procédé devrait être définie."})
    expect(eProc.setup).is_defined({onlyFailure:"L'installation du procédé devrait être définie."})
    expect(t(eProc.setup)).not.is_empty({onlyFailure:"L'installation du procédé ne devrait pas être vide."})
    expect(eProc.exploit).is_defined({onlyFailure:"L'exploitation du procédé devrait être définie."})
    expect(t(eProc.exploit)).not.is_empty({onlyFailure:"L'exploitation du procédé ne devrait pas être vide."})
    expect(eProc.payoff).is_defined({onlyFailure:"La résolution du procédé devrait être définie."})
    expect(t(eProc.payoff)).not.is_empty({onlyFailure:"La résolution du procédé ne devrait pas être vide."})
    expect(eProc.procType, 'eProc.procType').is_defined()
    expect(t(eProc.procType)).not.is_empty({onlyFailure:"Le type (procType) du procédé devrait être défini."})

    expect(FrontEventForm).has_values({
      id: eProc.id, titre: eProc.titre, is_new:'0', type:'proc', time:eProc.time,
      duree:eProc.duree, content:eProc.content, curimage:eProc.curimage,
      // Les propriétés propres
      procType:eProc.procType,
      longtext2:eProc.setup, longtext3:eProc.exploit, longtext4:eProc.payoff
    })
  })

})
