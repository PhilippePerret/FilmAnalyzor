'use strict'

/**
  Tests principaux du Porte-document
**/
const test = new Test("Pour tester les types et les instances")

test.case("Types et instances", async () => {

  expect(12).is_typeof(Number)
  expect(12).is_instanceof(Number)


})

module.exports = test
