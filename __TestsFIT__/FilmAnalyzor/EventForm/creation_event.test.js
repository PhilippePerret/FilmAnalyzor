'use strict'

describe("Création d'un event", function(){

  this.case("une note au temps voulu", async () => {

    await action("On presse « n » puis « i »", async () => {
      keyPress('n')
      await wait(500)
      keyPress('i')
      await wait(200)
    })

    // Le formulaire d'event est bien la fenêtre courante
    expect(FrontFWindow).is_event_form()

    expect(FrontEventForm).complies_with({
      type: 'info'
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
