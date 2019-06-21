'use strict'

describe("Complex Subject `f` (for « File »)", function(){
  //
  // this.case("f existe et est une fonction", () => {
  //   expect(typeof(f), 'typeof(f)').is('function')
  // })
  // this.case("f retourne une instance de `FITSubject`", () => {
  //   expect(f('pour/voir')).instanceof(FITSubject)
  // })
  //
  // this.case("ne produit pas d'erreur sur le sujet est un chemin string", () => {
  //   expect(f("/mon/path"),'f("/mon/path")').not.raises()
  // })
  // this.case("ne produit pas d'erreur si le sujet possède son protocole", () => {
  //   expect(f("file://mon/path"),'f("file://mon/path")').not.raises()
  //   expect(f("http://mon/path"),'f("http://mon/path")').not.raises()
  //   expect(f("https://mon/path/securised/"),'f("https://mon/path/securised/")').not.raises()
  // })
  // this.case("produit une erreur si le sujet est un string mais pas un bon chemin", ()=>{
  //   expect(f("mon mauvais chemin"),'f("mon mauvais chemin")').raises('not-a-path')
  // })
  // this.case("produit une erreur si le sujet est un nombre ou autre valeur différente", ()=>{
  //   const bads = [12, false, {id:12}]
  //   for(var bad of bads){
  //     expect(f(bad), `f(${JSON.stringify(bad)})`).raises('not-a-path')
  //   }
  // })
  //
  // // Méthode exists
  // // ---------------
  // this.case("répond à la méthode `exists` et teste l'existence", async () => {
  //   expect(f("mon/path"),'f(...)').responds_to('exists')
  //   await expect(f('./uncheminimpossiblepourvoir')).not.exists()
  //   await expect(f('/Users/')).exists()
  // })

  // Méthode constains
  // -----------------
  this.case("répond à `contains` qui permet de tester le contenu", async () => {
    expect(f("mon/path"),'f(...)').responds_to('contains')

    var datafile = await mkFile({content: "Un texte pour voir"})
    // console.log("datafile = ", datafile)
    var p = datafile.path
    await expect(f(p)).not.contains("Un texte pour")
    // await expect(f(p)).not.contains("pas dans le fichier")

    // await expect(
    //     x(async () => {
    //       return await expect(f(p)).contains("Un texte pour", {onlyReturn:true})
    //     })
    //   , 'f("path/to/file").contains("Un texte pour")'
    // ).succeeds()
    //
    // await expect(
    //     x(async () => {
    //       return await expect(f(p)).not.contains("Un texte pour", {onlyReturn:true})
    //     })
    //   , 'f("path/to/file").not.contains("Un texte pour")'
    // ).fails()
    //
    // await expect(
    //     x(async () => {
    //       return await expect(f(p)).contains("pas dans le fichier", {onlyReturn:true})
    //     })
    //   , 'f("path/to/file").contains("pas dans le fichier")'
    // ).fails()
    // await expect(
    //     x(async () => {
    //       return await expect(f(p)).not.contains("pas dans le fichier", {onlyReturn:true})
    //     })
    //   , 'f("path/to/file").not.contains("pas dans le fichier")'
    // ).succeeds()

    // expect(x(`f('${p}').contains('pas dans le fichier')`)).fails()
    // // Avec un fichier inexistant
    // expect(f('/fichierinexistant')).not.contains("texte pour voir")
    // expect(x("f('/fichierunreal').contains('ça')")).fails()
  })
})
