'use strict'

var t = new Test("Test de la classe FATexte")
var rawtexte, ifat, expected, actual

t.beforeTest(FITAnalyse.load.bind(FITAnalyse, 'with-dims'))

t.case("Elle répond aux méthodes attendues", ()=>{
  var ifat = new FATexte('un string')
  assert_function('deDim', FATexte)
  assert_function('deDim', ifat)
  assert_function('deEventTags', ifat)
  assert_function('deSceneTags', ifat)
})

t.case('Un texte contenant des diminutifs est traité correctement', ()=>{
  rawtexte  = "@T n’est pas @TE mais @T!"
  ifat      = new FATexte(rawtexte)
  expected  = 'Théodore n’est pas @TE mais Théodore!'
  actual    = ifat.deDim()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `Les diminutifs n'ont pas été bien remplacés. Attendu : "${expected}, obtenu: ${actual}"`
    }
  )
})


t.case("Un texte avec des balises events ({{event:...}}) est bien traité", ()=>{

  rawtexte = '{{event:12}}'
  given("Une balise seule : " + rawtexte)
  ifat = new FATexte(rawtexte)
  expected = '<a class="link-to-event" onclick="showEvent(12)">titre de l’event 12</a>'
  actual = ifat.deEventTags()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `${rawtexte} aurait dû être transformé en :\n“${expected}”\nil vaut :\n“${actual}”.`
    }
  )

  rawtexte = '{{event:12}} et {{event: 13| ce texte plutôt }}.'
  given('Un texte avec deux balises event et un texte alternatif : ' + rawtexte)
  ifat = new FATexte(rawtexte)
  expected = '<a class="link-to-event" onclick="showEvent(12)">titre de l’event 12</a>'
    + ' et <a class="link-to-event" onclick="showEvent(13)">ce texte plutôt</a>.'
  actual = ifat.deEventTags()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `${rawtexte} aurait dû être transformé en :\n“${expected}”\nil vaut :\n“${actual}”.`
    }
  )

})

t.case('Remplacement des balises {{scene:...}} dans les textes (avec FATexte)', ()=>{

  rawtexte = '{{scene:13}}'
  given('Une balise scène est correctement remplacée : ' + rawtexte)
  ifat = new FATexte(rawtexte)
  expected  = '<a class="link-to-scene" onclick="showScene(13)">Scène de l’event 13</a>'
  actual    = ifat.deSceneTags()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `${rawtexte} aurait dû être transformé en :\n“${expected}”\nil vaut :\n“${actual}”.`
    }
  )

  rawtexte = '{{scene:13 | un autre résumé}} et {{event: 12| plutôt ce texte }}.'
  // rawtexte = '{{scene:13}} et {{event: 12| plutôt ce texte }}.'
  given('Un texte avec balise event et scène et texte alternatif : ' + rawtexte)
  ifat = new FATexte(rawtexte)
  expected = '<a class="link-to-scene" onclick="showScene(13)">un autre résumé</a>'
    + ' et <a class="link-to-event" onclick="showEvent(12)">plutôt ce texte</a>.'
  actual = ifat.formate()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `${rawtexte} aurait dû être transformé en :\n“${expected}”\nil vaut :\n“${actual}”.`
    }
  )

  rawtexte = '{{scene: 13 | quand @T rentre chez lui}}'
  given('Un texte alternatif avec diminutif : ' + rawtexte)
  ifat = new FATexte(rawtexte)
  expected  = '<a class="link-to-scene" onclick="showScene(13)">quand Théodore rentre chez lui</a>'
  actual    = ifat.formate()
  assert_equal(
    expected, actual,
    {
      success: `${rawtexte} a bien été transformé en “${actual}”`,
      failure: `${rawtexte} aurait dû être transformé en :\n“${expected}”\nil vaut :\n“${actual}”.`
    }
  )

})
