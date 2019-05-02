'use strict'

var t = new Test("Jouer une scène par les boutons du reader")

t.beforeTest(loadAnalyse('tests/simple3scenes'))

t.case("On peut mettre en route depuis le reader", () => {

  return FITAnalyse.loadComponant('faEventer')
  .then(() => {
    let eventer = current_analyse.createNewEventer()
    console.log("eventer:",eventer)
    let id = eventer.id // FAEventer.lastId

    let btn = $(`div#${eventer.domId} #revent-1 button.btnplay-1`)
    btn.focus()
    btn.focus()
    btn.trigger('click')
    // ça doit jouer
    let img = $(`div#${eventer.domId} #revent-1 button.btnplay-1 img`)[0]
    assert_equal(
      'btn-stop.png', path.basename(img.src)
      , {success: 'Le bouton est bien réglé (stop)', failure: `Le bouton STOP devrait être appliqué. C'est le bouton ${img.src} qui est utilisé.`}
    )
    return wait(3000)
    .then(() => {
      btn.trigger('click')
      assert_equal(
        'btn-play.png', path.basename(img.src)
        , {success: 'Le bouton est bien réglé (PLAY)', failure: `Le bouton PLAY devrait être appliqué. C'est le bouton ${img.src} qui est utilisé.`}
      )
    })
  })
})
