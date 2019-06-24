'use strict'
/**
  Test du sujet complexe 'n'
**/
describe("Le sujet complexe `n`", function(){
  this.case("existe, retourne une instance FITSubject et attend un nombre", () => {
    expect(typeof(n), 'typeof(n)').is('function')
    expect(n(12)).instanceof(FITSubject)
    expect(n(12)).not.raises()
    var bads = ['string', {un:'hash'}, true]
    for (var bad of bads) {
      expect(n(bad)).raises('not-a-number')
    }
  })

  this.case("répond à #is et #equals qui attend un nombre et teste l'égalité", async () => {
    expect(n(12)).responds_to('is')

    await expect(
      x(async ()=>{return await expect(n(12)).not.is("12", {onlyReturn:true})})
      , 'expect(n(12)).not.is("12")'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is(true, {onlyReturn:true})})
      , 'expect(n(12)).not.is(true)'
    ).fails()

    await expect(
      x(async () => { return await expect(n(12)).is(12, {onlyReturn:true})})
      , 'expect(n(12)).is(12)'
    ).succeeds()
    await expect(
      x(async () => { return await expect(n(12)).not.is(12, {onlyReturn:true})})
      , 'expect(n(12)).not.is(12)'
    ).fails()

    await expect(
      x(async () => { return await expect(n(12)).equals(12, {onlyReturn:true})})
      , 'expect(n(12)).equals(12)'
    ).succeeds()
    await expect(
      x(async () => { return await expect(n(12)).not.equals(12, {onlyReturn:true})})
      , 'expect(n(12)).not.equals(12)'
    ).fails()

    await expect(
      x(async () => { return await expect(n(12)).not.is(13, {onlyReturn:true})})
      , 'expect(n(12)).not.is(13)'
    ).succeeds()
    await expect(
      x(async () => { return await expect(n(12)).is(13, {onlyReturn:true})})
      , 'expect(n(12)).is(13)'
    ).fails()

    await expect(
      x(async () => { return await expect(n(12)).not.equals(13, {onlyReturn:true})})
      , 'expect(n(12)).not.equals(13)'
    ).succeeds()
    await expect(
      x(async () => { return await expect(n(12)).equals(13, {onlyReturn:true})})
      , 'expect(n(12)).equals(13)'
    ).fails()

  })

  this.case("répond à #is_close_to qui teste la proximité avec les bons paramètres", async () => {
    expect(n(12)).responds_to('is_close_to')

    await expect(
      x(async () => {return await expect(n(12)).is_close_to(11, 1, {onlyReturn:true})})
      , 'expect(n(12)).is_close_to(11, 1)'
    ).succeeds()
    await expect(
      x(async () => {return await expect(n(12)).not.is_close_to(11, 1, {onlyReturn:true})})
      , 'expect(n(12)).not.is_close_to(11, 1)'
    ).fails()

    await expect(
      x(async () => {return await expect(n(12)).not.is_close_to(11, 1, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_close_to(11, 1, {strict:true})'
    ).succeeds()
    await expect(
      x(async () => {return await expect(n(12)).is_close_to(11, 1, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_close_to(11, 1, {strict:true})'
    ).fails()

    await expect(
      x(async () => {return await expect(n(12)).is_close_to(10, 1.9, {onlyReturn:true})})
      , 'expect(n(12)).is_close_to(10, 1.9)'
    ).fails()
    await expect(
      x(async () => {return await expect(n(12)).not.is_close_to(10, 1.9, {onlyReturn:true})})
      , 'expect(n(12)).not.is_close_to(10, 1.9)'
    ).succeeds()

    await expect(
      x(async () => {return await expect(n(2)).is_close_to(0, 5, {onlyReturn:true})})
      , 'expect(n(2)).is_close_to(0, 5)'
    ).succeeds()
    await expect(
      x(async () => {return await expect(n(2)).not.is_close_to(0, 5, {onlyReturn:true})})
      , 'expect(n(2)).not.is_close_to(0, 5)'
    ).fails()

    await expect(
      x(async () => {return await expect(n(-2)).is_close_to(0, 5, {onlyReturn:true})})
      , 'expect(n(-2)).is_close_to(0, 5)'
    ).succeeds()
    await expect(
      x(async () => {return await expect(n(-2)).not.is_close_to(0, 5, {onlyReturn:true})})
      , 'expect(n(-2)).not.is_close_to(0, 5)'
    ).fails()
  })


  this.case("répond à #is_between qui teste l'inclusion en mode strict ou non", async () => {
    expect(n(12)).responds_to('is_between')

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([11,13],{onlyReturn:true})})
      , 'expect(n(12)).is_between([11,13])'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([11,13], {onlyReturn:true}) })
      , 'expect(n(12)).not.is_between([11,13])'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([13,11],{onlyReturn:true})})
      , 'expect(n(12)).is_between([13,11])'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([13,11],{onlyReturn:true})})
      , 'expect(n(12)).not.is_between([13,11])'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([12,12],{onlyReturn:true})})
      , 'expect(n(12)).is_between([12,12])'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([12,12],{onlyReturn:true})})
      , 'expect(n(12)).not.is_between([12,12])'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([12,12],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).is_between([12,12],{strict:true})'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([12,12],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).not.is_between([12,12],{strict:true})'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([12,14],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).is_between([12,14],{strict:true})'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([12,14],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).not.is_between([12,14],{strict:true})'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([10, 12],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).is_between([10, 12],{strict:true})'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([10, 12],{onlyReturn:true, strict:true})})
      , 'expect(n(12)).not.is_between([10, 12],{strict:true})'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between([11.99,12.01],{onlyReturn:true})})
      , 'expect(n(12)).is_between([11.99,12.01])'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between([11.99,12.01],{onlyReturn:true})})
      , 'expect(n(12)).not.is_between([11.99,12.01])'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).is_between(10,{onlyReturn:true})})
      , 'expect(n(12)).is_between(10,14)'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_between(10,{onlyReturn:true})})
      , 'expect(n(12)).not.is_between(10,14)'
    ).fails()
  })

  this.case("répond à is_greater_than et teste la supériorité", async () => {
    expect(n(12)).responds_to('is_greater_than')

    await expect(
      x(async ()=>{return await expect(n(12)).is_greater_than(10, {onlyReturn:true})})
      , 'expect(n(12)).is_greater_than(10)'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_greater_than(10, {onlyReturn:true})})
      , 'expect(n(12)).not.is_greater_than(10)'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).is_greater_than(10, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_greater_than(10,{strict:true})'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_greater_than(10, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_greater_than(10,{strict:true})'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_greater_than(14, {onlyReturn:true})})
      , 'expect(n(12)).not.is_greater_than(14)'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).is_greater_than(14, {onlyReturn:true})})
      , 'expect(n(12)).is_greater_than(14)'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_greater_than(14, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_greater_than(14,{strict:true})'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).is_greater_than(14, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_greater_than(14,{strict:true})'
    ).fails()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_greater_than(12, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_greater_than(12,{strict:true})'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).is_greater_than(12, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_greater_than(12,{strict:true})'
    ).fails()

  })

  this.case("répond à is_less_than et teste l'infériorité", async () => {
    expect(n(12)).responds_to('is_less_than')

    await expect(
      x(async ()=>{return await expect(n(12)).is_less_than(10, {onlyReturn:true})})
      , 'expect(n(12)).is_less_than(10)'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_less_than(10, {onlyReturn:true})})
      , 'expect(n(12)).not.is_less_than(10)'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).is_less_than(10, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_less_than(10,{strict:true})'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).not.is_less_than(10, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_less_than(10,{strict:true})'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_less_than(14, {onlyReturn:true})})
      , 'expect(n(12)).not.is_less_than(14)'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).is_less_than(14, {onlyReturn:true})})
      , 'expect(n(12)).is_less_than(14)'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_less_than(14, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_less_than(14,{strict:true})'
    ).fails()
    await expect(
      x(async ()=>{return await expect(n(12)).is_less_than(14, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_less_than(14,{strict:true})'
    ).succeeds()

    await expect(
      x(async ()=>{return await expect(n(12)).not.is_less_than(12, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).not.is_less_than(12,{strict:true})'
    ).succeeds()
    await expect(
      x(async ()=>{return await expect(n(12)).is_less_than(12, {onlyReturn:true,strict:true})})
      , 'expect(n(12)).is_less_than(12,{strict:true})'
    ).fails()
  })
})
