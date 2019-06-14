'use strict'

// Pour afficher l'UI
require('electron').remote.getCurrentWindow().show();

// const server = require('../main')
test("Premier test sur l'app", () => {
  expect(window).toBeDefined()
  expect(window.FAListing).not.toBeDefined()
  expect(document.getElementById('C1R1')).toBeDefined()
})

test("Une nouvelle application", () => {
  var app = require('electron')
  expect(app).toBeDefined()
  expect(app.FAListing).not.toBeDefined()
})

// test("Mon premier test", () => {
//   expect(2 + 2).toBe(4)
// })
//
// test("Mon second test", ()=>{
//   expect(3+3).toBe(5)
// })
//
// test("Mon troisième test avec interaction", ()=>{
//   expect(FAnalyse.current).not.toBeNull()
// })
