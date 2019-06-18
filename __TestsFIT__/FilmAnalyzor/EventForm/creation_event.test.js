'use strict'

describe("Création d'un event", function(){

  this.case("une note au temps voulu", async () => {
    keyPress('n')
    await wait(1000)
    keyPress('i')

    // Le formulaire d'event est bien la fenêtre courante
    expect(FrontFWindow).is_event_form()

  })

  this.case('On peut créer un procédé', async () => {
    pending("Implémenter")
  })

  this.case('On peut crée un noeud structurel', async()=>{
    tester("La création du noeud dramatique")
  })
})
