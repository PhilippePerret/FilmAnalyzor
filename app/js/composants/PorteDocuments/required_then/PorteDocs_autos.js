'use strict'
/**
  Extension du porte-documents pour tout ce qui concerne les méthodes
  automatiques (sauvegarde, aperçu)
**/
Object.assign(PorteDocuments,{
  // Arrêter les timers s'il y en a (appelée à la fermeture)
  stopTimers(){
    this.stopTimerAutoSave()
    this.stopTimerAutoVisu()
  }

// Arrêt du timer qui s'occupe de la sauvegarde
, stopTimerAutoSave(){
    if (this.autoSaveTimer){
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  }

// Arrêt du timer qui s'occupe de la visualisation
, stopTimerAutoVisu(){
    if (this.autoVisuTimer){
      clearInterval(this.autoVisuTimer)
      this.autoVisuTimer = null
    }
  }

/**
  Méthode d'autosauvegarde du document courant
 */
, autoSaveCurrent(){
    this.currentDocument.getContents()
    this.currentDocument.isModified() && this.currentDocument.save()
  }

/**
 * Pour définir l'autosauvegarde
 */
, setAutoSave(e){
    this.autoSave = DGet('cb-save-auto-doc').checked
    if(this.autoSave){
      this.autoSaveTimer = setInterval(this.autoSaveCurrent.bind(this), 2000)
    } else {
      this.stopTimerAutoSave()
    }
    $('#btn-save-doc').css('opacity',this.autoSave ? '0.3' : '1')
  }

// Pour définir la visualisation en direct
, setAutoVisualize(e){
    if (this.visualizeDoc){
      this.autoVisuTimer = setInterval(this.updateVisuDoc.bind(this), 5000)
      this.positionneWriter()
      this.updateVisuDoc() // on commence tout de suite
    } else {
      this.stopTimerAutoVisu()
    }
    this.visualizor[this.visualizeDoc?STRshow:STRhide]()
  }

})
