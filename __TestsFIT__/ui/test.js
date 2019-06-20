'use strict'

var test = new Test("L'UI…")

test.case("…doit contenir tous les éléments requis à l'interface", () => {
  return assert_DomExists('div#whole-ui', {success:'un div principal (whole-ui)'})
  .then(()=>{
  return assert_DomExists('div#whole-ui > div#C1', {success:'une première colonne (C1)'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > div#C1-R1', {success:'une rangée pour la vidéo et le reader'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > div#C1-R1 > section#C1-R1-C1-section-video', {success:'une section pour la vidéo'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > div#C1-R1 > section#C1-R1-C2-section-reader', {success:'une section pour le reader'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > section#C1-R2-banc-timeline', {success:'une rangée pour le banc-timeline'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > section#C1-R2-banc-timeline > section#banctime-banc-timeline', {success:'la section banc-timeline elle-même'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > section#C1-R2-banc-timeline > section#banctime-banc-timeline > div#banctime-tape', {success:'la bande de timeline'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > section#C1-R2-banc-timeline > section#banctime-banc-timeline > div#banctime-tape > div#banctime-timeRuler', {success:'la réglette de temps dans le banc-timeline'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C1 > section#C1-R2-banc-timeline > section#banctime-banc-timeline > div#banctime-tape > div#banctime-cursor', {success:'le curseur principal du banc-timeline'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C2', {success:'une seconde colonne (C2)'})
  .then(() => {
  return assert_DomExists('div#whole-ui > div#C2 > section#C2-R1-forms', {success:'la section des formulaires'})
  })
  })
  })
  })
  })
  })
  })
  })
  })
  })
  })
})

module.exports = test
