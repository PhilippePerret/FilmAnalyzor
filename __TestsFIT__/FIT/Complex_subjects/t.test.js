'use strict'

describe("Complex Subject `t` (for « Text »)", function(){

  this.case("t existe et est une fonction qui retourne une instance FITSubject", () => {
    expect(typeof(t), "typeof(t)").is('function')
    expect(t('mon texte')).instanceof(FITSubject)
  })

  this.case("t doit recevoir obligatoirement un string", () => {
    expect(t('string')).not.raises()
    expect(t(12, "t(12)")).raises('not-a-string')
    expect(t({un:'deux'},"t({un:'deux'})")).raises('not-a-string')
  })

  this.case("t répond à la méthode is (ou equals) qui teste bien l'égalité", () => {
    expect(t('string')).responds_to('is')

    expect(
      x(()=>{return expect(t('string')).is('string',{onlyReturn:true})})
      , "expect(t('string')).is('string')"
    ).succeeds()
    expect(
      x(()=>{return expect(t('string')).not.is('string',{onlyReturn:true})})
      , "expect(t('string')).not.is('string')"
    ).fails()
    expect(
      x(()=>{return expect(t('string')).equals('string',{onlyReturn:true})})
      , "expect(t('string')).equals('string')"
    ).succeeds()
    expect(
      x(()=>{return expect(t('string')).not.equals('string',{onlyReturn:true})})
      , "expect(t('string')).not.equals('string')"
    ).fails()

    expect(
      x(()=>{return expect(t('string')).is('chaine',{onlyReturn:true})})
      , "expect(t('string')).is('chaine')"
    ).fails()
    expect(
      x(()=>{return expect(t('string')).not.is('chaine',{onlyReturn:true})})
      , "expect(t('string')).not.is('chaine')"
    ).succeeds()
    expect(
      x(()=>{return expect(t('string')).equals('chaine',{onlyReturn:true})})
      , "expect(t('string')).equals('chaine')"
    ).fails()
    expect(
      x(()=>{return expect(t('string')).not.equals('chaine',{onlyReturn:true})})
      , "expect(t('string')).not.equals('chaine')"
    ).succeeds()

  })

  this.case("t répond à la méthode is_close_to qui teste la ressemblance", async () => {
    expect(t('string')).responds_to('is_close_to')
    await expect(
        x(() => {return expect(t('string')).is_close_to('STRING',{onlyReturn:true})})
      , "expect(t('string')).is_close_to('STRING')"
    ).succeeds()
    await expect(
        x(() => {return expect(t('string')).not.is_close_to('STRING',{onlyReturn:true})})
      , "expect(t('string')).not.is_close_to('STRING')"
    ).fails()

    await expect(
        x(() => {return expect(t('string')).is_close_to('String',{onlyReturn:true})})
      , "expect(t('string')).is_close_to('String')"
    ).succeeds()
    await expect(
        x(() => {return expect(t('string')).not.is_close_to('String',{onlyReturn:true})})
      , "expect(t('string')).not.is_close_to('String')"
    ).fails()

    await expect(
        x(() => {return expect(t('string')).is_close_to('String !',{onlyReturn:true})})
      , "expect(t('string')).is_close_to('String !')"
    ).succeeds()
    await expect(
        x(() => {return expect(t('string')).not.is_close_to('String !',{onlyReturn:true})})
      , "expect(t('string')).not.is_close_to('String !')"
    ).fails()

    await expect(
        x(() => {return expect(t('string')).is_close_to('stringe',{onlyReturn:true})})
      , "expect(t('string')).is_close_to('stringe')"
    ).succeeds()
    await expect(
        x(() => {return expect(t('string')).not.is_close_to('stringe',{onlyReturn:true})})
      , "expect(t('string')).not.is_close_to('stringe')"
    ).fails()

    await expect(
        x(() => {return expect(t('string')).not.is_close_to('chaine',{onlyReturn:true})})
      , "expect(t('string')).not.is_close_to('chaine')"
    ).succeeds()
    await expect(
        x(() => {return expect(t('string')).is_close_to('chaine',{onlyReturn:true})})
      , "expect(t('string')).is_close_to('chaine')"
    ).fails()

  })

  this.case("`t` répond à `contains` qui teste la présence de la contenance", async ()=>{
    expect(t('string')).responds_to('contains')
    expect(t('string')).not.contains(12)

    await expect(
      x(()=>{return expect(t('string')).contains('str',{onlyReturn:true})})
      , "expect(t('string')).contains('str')"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains('str',{onlyReturn:true})})
      , "expect(t('string')).not.contains('str')"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).not.contains('STR',{strict:true,onlyReturn:true})})
      , "expect(t('string')).not.contains('STR',{strict:true})"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).contains('STR',{strict:true,onlyReturn:true})})
      , "expect(t('string')).contains('STR',{strict:true})"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).contains('STR',{strict:false,onlyReturn:true})})
      , "expect(t('string')).contains('STR', {strict:false})"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains('STR',{strict:false,onlyReturn:true})})
      , "expect(t('string')).not.contains('STR', {strict:false})"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).contains('STR',{onlyReturn:true})})
      , "expect(t('string')).contains('STR')"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains('STR',{onlyReturn:true})})
      , "expect(t('string')).not.contains('STR')"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).contains(/str.ng/,{onlyReturn:true})})
      , "expect(t('string')).contains(/str.ng/)"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains(/str.ng/,{onlyReturn:true})})
      , "expect(t('string')).not.contains(/str.ng/)"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).not.contains('chaine',{onlyReturn:true})})
      , "expect(t('string')).not.contains('chaine')"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).contains('chaine',{onlyReturn:true})})
      , "expect(t('string')).contains('chaine')"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).not.contains(/ch..ne/,{onlyReturn:true})})
      , "expect(t('string')).not.contains(/ch..ne/)"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).contains(/ch..ne/,{onlyReturn:true})})
      , "expect(t('string')).contains(/ch..ne/)"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).not.contains(/STR.Ng/,{strict:true,onlyReturn:true})})
      , "expect(t('string')).not.contains(/STR.Ng/,{strict:true})"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).contains(/STR.Ng/,{strict:true,onlyReturn:true})})
      , "expect(t('string')).contains(/STR.Ng/,{strict:true})"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).contains(/STR.Ng/,{strict:false,onlyReturn:true})})
      , "expect(t('string')).contains(/STR.Ng/,{strict:false})"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains(/STR.Ng/,{strict:false,onlyReturn:true})})
      , "expect(t('string')).not.contains(/STR.Ng/,{strict:false})"
    ).fails()

    await expect(
      x(()=>{return expect(t('string')).contains(/STR.Ng/,{onlyReturn:true})})
      , "expect(t('string')).contains(/STR.Ng/)"
    ).succeeds()
    await expect(
      x(()=>{return expect(t('string')).not.contains(/STR.Ng/,{onlyReturn:true})})
      , "expect(t('string')).not.contains(/STR.Ng/)"
    ).fails()
  })

  this.case("doit répondre à `is_empty` qui teste la longueur", () => {
    expect(t('')).responds_to('is_empty')
    expect(
      x(
        () => {return expect(t('')).is_empty({onlyReturn:true})}
      ), "expect(t('')).is_empty()"
    ).succeeds()
    expect(
      x(
        () => {return expect(t('')).not.is_empty({onlyReturn:true})}
      ), "expect(t('')).not.is_empty()"
    ).fails()

    expect(
      x(
        ()=>{return expect(t('non vide')).is_empty({onlyReturn:true})}
      ), "expect(t('non vide')).is_empty()"
    ).fails()
    expect(
      x(
        () => {return expect(t('non vide')).not.is_empty({onlyReturn:true})}
      ), "expect(t('non vide')).not.is_empty()"
    ).succeeds()

    // expect(t('')).is_empty()
    // expect(t('non vide')).not.is_empty()
  })
})
