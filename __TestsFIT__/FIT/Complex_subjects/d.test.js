'use strict'

var suj, res

describe("Sujet complexe `d` (DOM)", function(){

  this.case("produit une erreur si le sujet n'est pas « DOMisable »", () => {
    expect(d(12), 'd(12)').raises('not-a-domisable')
  })
  this.case("ne produit pas d'erreur si on envoie une sorte de xpath", () => {
    expect(d('div#pourvoir'), "d('div#pourvoir')").not.raises()
  })
  this.case("produit une erreur si on envoie un DOMElement inexistant", () => {
    expect(d(document.querySelector('body #divinexistant')),
    "d(document.querySelector('body #divinexistant'))").raises('not-a-domisable')
  })
  this.case("ne produit pas d'erreur si on envoie un DOMElement existant", () => {
    expect(d(document.querySelector('body')),"d(document.querySelector('body'))").not.raises()
  })
  this.case("ne produit pas d'erreur si on envoie un set jQuery inexistant", () => {
    expect(d($('div#mondivpourvoir')),"d($('div#mondivpourvoir'))").not.raises()
  })

  this.case("la méthode `exists`", async() => {
    expect(d('Le sujet `d`'), "d(...)").responds_to('exists')
    await expect(
       x(async ()=>{return await expect(d($(document))).exists({onlyReturn:true})})
       , {sujet: 'd($(document)).exists()'}
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(d($('body'))).exists({onlyReturn:true})})
      , "expect(d($('body'))).exists()"
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(d($('unfoundtag'))).exists({onlyReturn:true})})
      , "expect(d($('unfoundtag'))).exists()"
    ).fails()
    await expect(
      x(async ()=>{return await expect(d($('badbal#unfoundtag'))).exists({onlyReturn:true})})
      , "expect(d($('badbal#unfoundtag'))).exists()"
    ).fails()
  })

  // this.case("la méthode `is_visible`", async() => {
  //   expect(d('Le sujet `d`')).responds_to('is_visible')
  // })
  //
  // this.case("la méthode `contains`", async() => {
  //   expect(d('Le sujet `d`')).responds_to('contains')
  // })

})
