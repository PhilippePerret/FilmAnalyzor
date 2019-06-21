'use strict'
/**
  Tests du FITSubject b_boolean

**/
describe("FITSubject b_Boolean", function(){

  this.case("répond et teste avec #is", () => {
    expect(b(true),'b(true)').responds_to('is')
    expect(x("expect(b(true)).is(true)")).succeeds()
    expect(x("expect(b(true)).not.is(true)")).fails()
    expect(x("expect(b(2==2)).is(true)")).succeeds()
    expect(x("expect(b(2==2)).not.is(true)")).fails()
    expect(x("expect(b(true)).is(false)")).fails()
    expect(x("expect(b(true)).not.is(false)")).succeeds()
    expect(x("expect(b(2==2)).is(false)")).fails()
    expect(x("expect(b(2==2)).not.is(false)")).succeeds()
    expect(x("expect(b(false)).is(false)")).succeeds()
    expect(x("expect(b(false)).not.is(false)")).fails()
    expect(x("expect(b(2==3)).is(false)")).succeeds()
    expect(x("expect(b(2==3)).not.is(false)")).fails()
    expect(x("expect(b(false)).is(true)")).fails()
    expect(x("expect(b(false)).not.is(true)")).succeeds()
    expect(x("expect(b(2==3)).is(true)")).fails()
    expect(x("expect(b(2==3)).not.is(true)")).succeeds()
  })

  this.case("répond et teste avec #is_true", () => {
    expect(b(true),'b(true)').responds_to('is_true')
    expect(x("expect(b(true)).is_true()")).succeeds()
    expect(x("expect(b(true)).not.is_true()")).fails()
    expect(x("expect(b(2==2)).is_true()")).succeeds()
    expect(x("expect(b(2==2)).not.is_true()")).fails()
    expect(x("expect(b(false)).not.is_true()")).succeeds()
    expect(x("expect(b(false)).is_true()")).fails()
    expect(x("expect(b(2==3)).not.is_true()")).succeeds()
    expect(x("expect(b(2==3)).is_true()")).fails()
  })

  this.case("répond et teste avec #is_false", () => {
    expect(b(true),'b(true)').responds_to('is_false')
    expect(x("expect(b(false)).is_false()")).succeeds()
    expect(x("expect(b(false)).not.is_false()")).fails()
    expect(x("expect(b(2==3)).is_false()")).succeeds()
    expect(x("expect(b(2==3)).not.is_false()")).fails()
    expect(x("expect(b(true)).not.is_false()")).succeeds()
    expect(x("expect(b(true)).is_false()")).fails()
    expect(x("expect(b(2==2)).not.is_false()")).succeeds()
    expect(x("expect(b(2==2)).is_false()")).fails()
  })

  this.case("répond et teste avec #is_close_to", () => {
    expect(b(true),'b(true)').responds_to('is_close_to')
    expect(x("expect(b(2)).is_close_to('2')")).succeeds()
    expect(x("expect(b(2)).is_close_to(2)")).succeeds() // je sais pas trop…
    expect(x("expect(b(2.3)).is_close_to(2)")).succeeds()
    expect(x("expect(b(2)).is_close_to(2.3)")).succeeds()
  })
})
