'use strict'
/**
  Test du changement de version d'une analyse
**/
describe("Changement de version d'une analyse", function(){

  // On crée une nouvelle analyse vierge
  this.before(async () => {
    this.ca = FITAnalyse.create(EMPTY)
    await this.ca.load()
  })

  this.case("On choisit une nouvelle version", async () => {
    await action("On active le menu « Nouvelle version » et on choisit la première", async () => {
      chooseMenu('Nouvelle version')
      // TODO Choix du premier bouton
    })

  })

  this.case("On annule le changement de version", async () => {
    await action("On active le menu « Nouvelle version »", async () => {
      chooseMenu('Nouvelle version')
    })
  })

})
