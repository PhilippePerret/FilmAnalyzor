'use strict'
/**
  Test du sujet complexe 'a' (array)
**/
var suj, res

describe("Sujet complexe `a`", function(){

  this.case("produit une erreur si le sujet n'est pas un array ou une liste d'éléments", () => {
    expect(a(12)).raises('not-a-array')
  })
  this.case("ne produit pas d'erreur si le sujet est un array", () => {
    expect(a([1,2,'trois'])).not.raises()
  })
  this.case("ne produit pas d'erreur si le sujet contient plusieurs arguments", () => {
    expect(a(1,2,'trois')).not.raises()
  })

  this.case("répond et teste la méthode `contains`", () => {
    expect(a(1,2)).responds_to('contains')
    expect(x('expect(a(1,2)).contains(1)')).succeeds()
    expect(x('expect(a(1,2)).contains(2)')).succeeds()
    expect(x('expect(a(1,2)).contains([2,1])')).succeeds()
    expect(x('expect(a(1,2)).contains(12)')).fails()
  })

  this.case("répond et teste la méthode `is`", () => {
    suj = a(2,3)
    expect(suj).responds_to('is')
    expect(x('expect(a(2,3)).is([2,3])')).succeeds()
    expect(x('expect(a(2,3)).is([3,2])')).fails()
    expect(x('expect(a(2,3)).is(3)')).fails()
    expect(x('expect(a(2,3)).is("trois")')).fails()
    expect(x('expect(a(2,3)).is(["deux","trois"])')).fails()

  })
})
