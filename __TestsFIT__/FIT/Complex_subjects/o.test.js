'use strict'
/**
  Tests du sujet complexe o
**/
describe("Test du sujet complexe o", function(){

  this.case("o existe et est une fonction qui retourne un FITSubject", () => {
    expect(typeof(o)).is('function')
    expect( o({}) ).instanceof(FITSubject)
  })

  this.case("o produit une erreur si le sujet n'est pas un objet, un succès otherwise",() => {
    expect( o(12), 'o(12)' ).raises('not-an-object')
    expect( o('string'), "o('string')" ).raises('not-an-object')
    expect( o(true), 'o(true)' ).raises('not-an-object')
    expect( o([1,2,3]), 'o([1,2,3])' ).raises('not-an-object')
    expect( o({}), 'o({})' ).not.raises()
    expect( o({id:12}), 'o({id:12})' ).not.raises()
    expect( o({id:12, name:'douze'}), 'o({id:12, name:"douze"})' ).not.raises()
  })

  this.case("o répond à la méthode `contains qui teste l'appartenance`", () => {
    expect(o({})).responds_to('contains')

    let hh = {id:12,type:'stt',name:'node'}
      , hstr = "{id:12,type:'stt',name:'node'}"
    expect(
      x(()=>{return expect(o(hh)).contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:12})`
    ).succeeds()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:12})`
    ).fails()

    expect(
      x(()=>{return expect(o(hh)).contains({type:'stt'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({type:'stt'})`
    ).succeeds()
    expect(
      x(()=>{return expect(o(hh)).not.contains({type:'stt'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({type:'stt'})`
    ).fails()

    expect(
      x(()=>{return expect(o(hh)).contains({name:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({name:'node'})`
    ).succeeds()
    expect(
      x(()=>{return expect(o(hh)).not.contains({name:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({name:'node'})`
    ).fails()

    expect(
      x(()=>{return expect(o(hh)).contains({name:'node',id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({name:'node',id:12})`
    ).succeeds()
    expect(
      x(()=>{return expect(o(hh)).not.contains({name:'node',id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({name:'node',id:12})`
    ).fails()

    expect(
      x(()=>{return expect(o(hh)).contains({id:12,type:'stt',name:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:12,type:'stt',name:'node'})`
    ).succeeds()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:12,type:'stt',name:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:12,type:'stt',name:'node'})`
    ).fails()

    // ---------------------------------------------------------------------
    //  Les erreurs

    expect(
      x(()=>{return expect(o(hh)).contains({},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({})`
    ).fails() // ÉCHEC AUSSI

    expect(
      x(()=>{return expect(o(hh)).contains({id:'stt'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:'stt'})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:'stt'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:'stt'})`
    ).succeeds()

    expect(
      x(()=>{return expect(o(hh)).contains({id:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:'node'})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:'node'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:'node'})`
    ).succeeds()

    expect(
      x(()=>{return expect(o(hh)).contains({type:'sttt'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({type:'sttt'})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({type:'sttt'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({type:'sttt'})`
    ).succeeds()

    expect(
      x(()=>{return expect(o(hh)).contains({type:'sttt',id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({type:'sttt',id:12})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({type:'sttt',id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({type:'sttt',id:12})`
    ).succeeds()

    expect(
      x(()=>{return expect(o(hh)).contains({name:'anode'},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({name:'anode'})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({name:'anode'},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({name:'anode'})`
    ).succeeds()

    hh = {}
    hstr = "{}"
    expect(
      x(()=>{return expect(o(hh)).contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:12})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:12})`
    ).succeeds()

    hh = {type:'stt'}
    hstr = "{type:'stt'}"
    expect(
      x(()=>{return expect(o(hh)).contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:12})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:12},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:12})`
    ).succeeds()

    hh = {id:12}
    hstr = "{id: 12}"
    expect(
      x(()=>{return expect(o(hh)).contains({id:13},{onlyReturn:true})})
      , `expect(o(${hstr})).contains({id:13})`
    ).fails()
    expect(
      x(()=>{return expect(o(hh)).not.contains({id:13},{onlyReturn:true})})
      , `expect(o(${hstr})).not.contains({id:13})`
    ).succeeds()


  })
})
