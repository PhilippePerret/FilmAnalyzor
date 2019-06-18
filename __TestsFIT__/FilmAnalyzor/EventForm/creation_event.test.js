'use strict'

describe("Création d'un event", function(){

  this.case("Création d'une idée au temps voulu", async () => {

    await action("On se rend à 32 secondes et on presse « n » puis « i »", async () => {
      goToTime(32)
      keyPress('n')
      await wait(500)
      keyPress('i')
      await wait(200)
    })

    // Le formulaire d'event est bien la fenêtre courante
    expect(FrontFWindow).is_event_form()

    expect(FrontEventForm).complies_with({
      type: 'idee', isNew: true, time:32
    })

    await wait(10000)
    F.notify("J'ai fini d'attendre 10 secondes")

    await action("On presse la touche tabulation pour entrer dans le titre", () => {
      keyPress('Tab')
    })
    expect(UI.currentShortcutsName).is('TEXT FIELD')

    await action("On écrit le titre", async () => {

    })
    await action("On écrit une description", async() => {

    })

    // tester("Écrire un titre d'information")
    // tester("Écrire une description d'information")

  })

  // this.case('On peut créer un procédé', async () => {
  //   pending()
  //   // await action("On presse «n» puis «p»", async () => {
  //   //   keyPress('n')
  //   //   await wait(200)
  //   //   keyPress('p')
  //   //   await wait(200)
  //   // })
  // })
  //
  // this.case('On peut créer un noeud structurel', async()=>{
  //   tester("La création du noeud dramatique")
  // })
})
