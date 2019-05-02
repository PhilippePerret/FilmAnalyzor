'use strict'

var t = new Test("Modification de document")

t.beforeTest(FITAnalyse.load.bind(FITAnalyse, 'tests/simple'))


t.case('Modification et enregistrement', () => {

  // Simulation de l'action du menu
  action("J'active le menu Documents > Synopsis", () => {
    ipc.send('click-menu', {menu_id: 'open-doc-synopsis'})
  })
  return waitFor("'undefined' !== typeof(FAWriter) && FAWriter.isOpened === true", {timeout: 4000})
  .then(()=>{

    let curDoc = FAWriter.currentDoc

    // On se met dans le champ de texte
    FAWriter.docField.focus()
    FAWriter.docField.insertAtCaret('Super')
    FAWriter.docField.blur()
    // Malheureusement, le blur ne suffit pas à provoquer le change.
    FAWriter.docField.trigger('change')

    assert_equal(
      true, curDoc._modified,
      {
          success: 'Le document courant est bien marqué modifié'
        , failure: 'Le document courant devrait être marqué modifié…'
      }
    )

    action("J'enregistre le document en cliquant sur le bouton…", ()=>{
      FAWriter.btnSave.click()
    })
    return waitFor("FAWriter.currentDoc._modified === false", {timeout: 6000})
    .then(()=>{
      assert_equal(
        false, curDoc._modified,
        {
          success: 'Le document n’est plus marqué modified'
        , failure: "Le document ne devrait pas être marqué modified"
        }
      )

      FAWriter.docField.focus()
      FAWriter.docField.insertAtCaret(RC + RC + "Nouveau texte")

      action("Je fais CMD-S depuis le champ de saisie", ()=>{
        var press = $.Event('keypress')
        press.which   = K_S
        press.metaKey = true
        FAWriter.docField.trigger(press)
      })

      var expected  = `Super${RC}${RC}Nouveau texte`
      var actual    = FAWriter.currentDoc.contents
      assert_equal(
        expected, actual,
        {
          success: "Le contenu (contents) du document est correct"
        , failure: `Le contenu (contents) du document ne matche pas. Attendu: "${expected}", actuel: "${actual}"`
        }
      )

      actual = fs.readFileSync(current_analyse.filePathOf('synopsis'),'utf8')
      assert_equal(
        expected, actual,
        {
          success: 'Le fichier contient le texte attendu'
        , failure: `Le fichier ne contient pas le texte attendu. Attendu : "${expected}", actuel : "${actual}"`
        }
      )

    })
    .catch()
  })
  .catch((err)=>{
    throw(err)
  })

})
