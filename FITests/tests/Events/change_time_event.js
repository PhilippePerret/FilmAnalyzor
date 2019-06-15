'use strict'
/**
 * Test permettant de savoir si l'event a bien été déplacé dans FAnalyse.events
 * lorsque son temps a changé
 *i
 */

var t = new Test("Changement du temps d'un event")



t.beforeTest(loadAnalyse('tests/simple3scenes',{displayAllEvents:true}))

t.case('Une modification de l’event sans changement de temps le laisse en place', () => {
  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  current_analyse.updateEvent(ev3, {initTime: ev3.time})
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    idx_init, idx_new,
    {success: `L'event est toujours en ${idx_init + 1}e position`,
    failure: `L'event devrait être toujours en ${idx_init+1}e position… Il est en ${idx_new+1}e position`}
  )
  var ordre_ids = FITReader.get('order-ids')
  assert_match(
    [1,3,4], ordre_ids,
    {
      success: "L'event reste bien placé dans le reader",
      failure: `L'ordre des events ne devrait pas avoir changé dans le reader (expected: [1,3,4], actuel: ${ordre_ids})`}
    )

  var newTimeInTags = parseFloat($('*[data-time][data-id="3"]').attr('data-time'))
  assert_equal(
    ev3.time, newTimeInTags,
    {
      success: "Le temps de l'event n'a pas changé.",
      failure: `Le temps de l'event ne devrait pas avoir changé (expected: ${ev3.time}, actual:${newTimeInTags})`
    }
  )

  // TODO Son horloge n'a pas changé

})
t.case('Une modification du temps de l’event, mais pas assez consistante, le laisse en place', () => {
  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  var initTime  = ev3.time
  var newTime   = ev3.time - 20
  ev3.time = newTime
  current_analyse.updateEvent(ev3, {initTime: initTime})
  assert(
    current_analyse.modified,
    "L'analyse a été marquée modifiée", "L'analyse aurait dû être marquée modifiée"
  )
  // Prendre le nouvel index
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    idx_init, idx_new,
    {
      success: `L'event est toujours en ${idx_init + 1}e position`,
      failure: `L'event devrait être toujours en ${idx_init+1}e position… Il est en ${idx_new+1}e position`
    }
  )
  assert_equal(
    2, ev3.numero,
    {
      success: "L'event a toujours le numéro de scène 2",
      failure: `L'event devrait avoir le numéro de scène 2, il a le numéro ${ev3.numero}`
    }
  )
  var ordre_ids = FITReader.get('order-ids')
  assert_match(
    [1,3,4], ordre_ids,
    {
      success: "L'event reste bien placé dans le reader",
      failure: `L'ordre des events ne devrait pas avoir changé dans le reader (expected: [1,3,4], actuel: ${ordre_ids})`}
    )

  var newTimeInTags = parseFloat($('*[data-time][data-id="3"]').attr('data-time'))
  assert_equal(
    newTime, newTimeInTags,
    {
      success: "Le temps de l'event a bien été changé dans les balises DOM.",
      failure: `Le temps de l'event devrait avoir changé (expected: ${newTime}, actual:${newTimeInTags})`
    }
  )

  var actual_horloge    = $(`.horloge-event[data-id="${ev3.id}"]`).html()
  var expected_horloge  = new OTime(newTime).horloge
  assert_equal(
    expected_horloge, actual_horloge,
    {
      success: "Ses horloges ont été actualisées dans l'interface",
      failure: `Ses horloges auraient dû être mises à ${expected_horloge}, elles valent : ${actual_horloge}`
    }
  )
})



t.case("Une modification conséquente du temps de l'event le déplace", ()=>{

  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  var initTime = ev3.time
  var newTime = 100
  ev3.time = newTime
  current_analyse.updateEvent(ev3, {initTime: initTime})
  assert(
    current_analyse.modified,
    "L'analyse a été marquée modifiée", "L'analyse aurait dû être marquée modifiée"
  )
  // Prendre le nouvel index
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    2, idx_new,
    {
      success: `L'event est maintenant en ${idx_new + 1}e position`,
      failure: `L'event devrait être maintenant en 3e position… Il est en ${idx_new+1}e position`
    }
  )
  assert_equal(
    3, ev3.numero,
    {
      success: "L'event a maintenant le numéro de scène 3",
      failure: `L'event devrait avoir le numéro de scène 3, il a le numéro ${ev3.numero}`
    }
  )

  var ordre_ids = FITReader.get('order-ids')
  assert_match(
    [1,4,3], ordre_ids,
    {
      success: "L'event a été déplacé dans le reader",
      failure: `L'ordre des events devrait avoir changé dans le reader (expected: [1,4,3], actuel: ${ordre_ids})`}
    )

  var newTimeInTags = parseFloat($('*[data-time][data-id="3"]').attr('data-time'))
  assert_equal(
    newTime, newTimeInTags,
    {
      success: "Le temps de l'event a bien été changé dans les balises DOM.",
      failure: `Le temps de l'event devrait avoir changé (expected: ${newTime}, actual:${newTimeInTags})`
    }
  )

  var actual_horloge    = $(`.horloge-event[data-id="${ev3.id}"]`).html()
  var expected_horloge  = new OTime(newTime).horloge
  assert_equal(
    expected_horloge, actual_horloge,
    {
      success: "Ses horloges ont été actualisées dans l'interface",
      failure: `Ses horloges auraient dû être mises à ${expected_horloge}, elles valent : ${actual_horloge}`
    }
  )

})
