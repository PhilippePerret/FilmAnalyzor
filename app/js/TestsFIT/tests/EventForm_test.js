'use strict'

var t = new Test("Test du formulaire d'édition de l'event")//, document.currentScript.src

t.beforeTest(loadAnalyse('tests/simple', {remove_events: true}))

t.case("Création, enregistrement et modification d'un event de type note", function(){

  // On récupère le dernier identifiant pour trouver le prochain
  // identifiant d'un nouvel event
  var newEventId = 1 + EventForm.lastId
  var domId = `form-edit-event-${newEventId}`
  var jqFormId = `#${domId}`

  assert(
      $(jqFormId).length == 0
    , "Pas de formulaire pour le nouvel évènement"
    , "Le formulaire d'édition de l'event ne devrait pas exister"
  )

  var cliqueBoutonNewNote = action.bind(null, 'On clique sur le bouton pour un nouvel event de type note', () => {
    $('#btn-new-note').click()
  })

  action("On se rend au temps voulu où mettre une note", ()=>{
    current_analyse.locator.setTime(300)
  })
  cliqueBoutonNewNote()
  return assert_DomExists(jqFormId, {failure: "Le formulaire devrait exister", success: "Le formulaire de création de l'event est affiché"})
  .then(() => {

    action('Je remplis le formulaire avec les données de la note', ()=>{
      var data = {
          titre:    "Le titre de la note"
        , content:  "Contenu de la note"
        , note:     "La note subsidiaire de la note"
      }
      fillEventFormWith(newEventId, data)
    })

    assert_equal(0, current_analyse.events.length,
      {success:"L'analyse n'a pas d'évènements", failure:"L'analyse ne devrait avoir aucun évènement"}
    )

    action("Je crée la note en cliquant le bouton « Créer »", ()=>{
      $(`${jqFormId} .btn-form-submit`).click()
    })

    assert_equal(1, current_analyse.events.length, {success:"L'analyse possède maintenant 1 event", failure:"L'analyse devrait maintenant posséder un event"})

    // NOTE : Ne pas tester la disparition du formulaire, car il est encore
    // dans le code, mais masqué (pour pouvoir le ré-éditer plus facilement)
    assert_notVisible(jqFormId, {success: 'Le formulaire n’est plus visible'})

    var e = current_analyse.events[0]
    var expected = {
        time: 300
      , id:       0
      , titre:    "Le titre de la note"
      , content:  "Contenu de la note"
      , note:     "La note subsidiaire de la note"
      , type:     'note'
      , duree: null
    }
    let data_note = expected // pour plus bas
    assert_match(expected, e, {values_strict: true, success: 'Les données de l’event sont valides', failure: 'Les données de l’event sont invalides'})

    return assert_DomExists('#reader #revent-0.event.note', {success: "La note est affichée dans le reader."})
    .then(()=>{

      // Vérification de l'affichage de l'event
      var n = document.querySelector('#reader #revent-0.event.note .content')
      assert(
          n.innerHTML.match(/Contenu de la note/) !== null
        , "OK, le texte de la note est affiché correctement"
        , "Hum… le texte de la note n'est pas affiché correctement"
      )

      // Réglage de l'horloge
      n = document.querySelector('#reader #revent-0.event.note .e-tools span.horloge')
      var h = n.innerHTML
      assert(
          n.innerHTML.match(/0\:05\:00\.00/) !== null
        , 'OK, l’horloge de l’event est bien réglée'
        , `Hum… L'horloge de l'event n'est pas bien réglée… Elle devrait être "0:05:00.00" elle est réglée à "${h}"`
      )

      return FITAnalyse.save()
        .then(()=>{
          assert_fileExists(FITAnalyse.analyse.eventsFilePath)
          // Noter qu'il existe toujours, maintenant

          // var contenu = fs.readFileSync(FITAnalyse.analyse.eventsFilePath, 'utf8')
          var contenu = require(FITAnalyse.analyse.eventsFilePath)
          assert_isArray(contenu, {success: "Le fichier des events contient bien une liste."})
          assert(
              contenu.length === 1
            , "La liste des event contient un seul event"
            , `La liste ne devrait contenir qu'un seul event, elle en contient ${contenu.length}…`
          )
          var firste = contenu[0]
          assert_isObject(firste, {success: "Le premier élément est bien une table"})
          delete data_note.duree // car null donc pas enregistré
          assert_match(data_note, firste, {values_strict: true, success: "L'event sauvé contient les bonnes valeurs", failure:"L'event sauvé ne contient pas les bonnes valeurs…"})


          // ---------------------------------------------------------------------
          given("On peut modifier l'event enregistré")

          action("On clique sur le bouton d'édition de l'event dans le reader", ()=>{
            $('#reader #revent-0.event.note .e-tools .btn-edit').click()
          })

          assert_visible(jqFormId, {success: "Le formulaire d'édition est à nouveau visible."})

          // Il ne doit y avoir qu'un seul formulaire (bug existant)
          assert(
              $('form.form-edit-event').length === 1
            , `Il y a un seul formulaire d'event '.form-edit-event' dans le DOM`
            , `Hum… il ne devrait y avoir qu'un seul formulaire '.form-edit-event' dans le DOM. Il y en a ${$('form.form-edit-event').length}…`
          )

          var new_data = {
              titre:    "Le NOUVEAU titre de la note"
            , content:  "Nouveau contenu de la note"
            , note:     ""
          }
          action('Je modifie la donnée de la note et je soumets le formulaire', ()=>{
            fillEventFormWith(newEventId, new_data, {submit: true})
          })

          // La donnée doit avoir changée
          assert(
              current_analyse.modified === true
            , "L'analyse courante a été marquée modifiée"
            , "L'analyse courante devrait être marquée modifiée"
          )

          assert(
              current_analyse.events.length === 1
            , "L'analyse a toujours un seul event"
            , `L'analyse devrait avoir un seul event. Elle en a ${current_analyse.events.length}…`
          )

          delete new_data.note
          assert_match(new_data, current_analyse.ids[0].data,
            {success:"Les données de l'event #0 ont été correctement modifiées"}
          )
          assert(
              current_analyse.ids[0].note === null
            , "L'event n'a plus de note."
            , `L'event ne devrait plus avoir de note… (note vaut ${current_analyse.ids[0].note})`
          )

          var n = document.querySelector('#reader #revent-0.event.note .content')
          assert(
              n.innerHTML.match(/Nouveau contenu de la note/) !== null
            , "OK, le texte de la note a été actualisé dans le reader"
            , "Hum… le texte de la note n'a pas été actualisé…"
          )

          return action("On sauve à nouveau l'analyse courante avec succès", ()=>{

            return FITAnalyse.save()
              .then(()=>{
                assert(
                    current_analyse.modified === false
                  , "L'analyse n'est plus marquée modifiée"
                  , "Hum… L'analyse ne devrait plus être marquée modifiée…"
                )
                assert_fileExists(FITAnalyse.analyse.eventsFilePath)
                // Si on le require à nouveau, il ne sera pas actualisé, on doit
                // le lire, cette fois
                var contenu = JSON.parse(fs.readFileSync(FITAnalyse.analyse.eventsFilePath, 'utf8'))
                assert_isArray(contenu, {success: "Le fichier des events contient bien une liste."})
                assert(
                    contenu.length === 1
                  , "La liste des event contient toujours un seul event"
                  , `La liste ne devrait contenir qu'un seul event, elle en contient ${contenu.length}…`
                )
                var firste = contenu[0]
                assert_isObject(firste, {success: "Le premier élément est bien une table"})
                var new_data = {
                    id:       0
                  , time:     300
                  , titre:    "Le NOUVEAU titre de la note"
                  , content:  "Nouveau contenu de la note"
                }
                assert_match(new_data, firste, {values_strict: true, success: "L'event sauvé contient les nouvelles valeurs", failure:"L'event sauvé ne contient pas les nouvelles valeurs…"})
            })//then
          })//then
      }) // then
    }) // then
  })
})
