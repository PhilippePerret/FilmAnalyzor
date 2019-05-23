'use strict'
/**
  Classe devant servir à contrôler les différentes parties de l'interface
  Pour le moment, seule la colonne C2 est un window controller.
  Permet principalement :
    - d'ouvrir et fermer le panneau
    - de mettre quelque chose à l'intérieur

  @usage

    let data = {
      widthOpened: taille quand ouvert  / undefined
      heightOpened: taille quand ouvert / undefined
      widthClosed:  taille quand ferme / undefined (0 par défaut)
      heightClosed: hauteur quand fermé
      container: Le conteneur dans lequel on doit mettre des choses.
    }
    let wctrl = new WindowController(divPanneau, data)

    divPanneau est le panneau amovible. Noter que ça n'est pas forcément le
    contenant dans lequel les éléments doivent être ajoutés.

**/

class WindowController {
constructor(domElement, data){
  this.jqObj  = $(domElement)
  this.data   = data
}

// Pour ouvrir et fermer
toggle(){this[this.isOpened()?'open':'close']; return this}
open(){ this.jqObj.animate(this.dataCssOpened); return this }
close(){ this.jqObj.animate(this.dataCssClosed); return this }

// Pour resetter
reset(){this.data.container.html(''); return this}

// Ajouter quelque chose au contenant
append(div){ this.data.container.append(div); return this }

get dataCssOpened(){
  if(isUndefined(this._datacssopened)){
    this._datacssopened = {}
    this.data.widthOpened && ( this._datacssopened.width = `${this.data.widthOpened}px`)
    this.data.heightOpened && ( this._datacssopened.height = `${this.data.heightOpened}px`)
  }
  return this._datacssopened
}
get dataCssClosed(){
  if(isUndefined(this._datacssclosed)){
    this._datacssclosed = {}
    this.data.widthClosed && ( this._datacssclosed.width = `${this.data.widthClosed}px`)
    this.data.heightClosed && ( this._datacssclosed.height = `${this.data.heightClosed}px`)
  }
  return this._datacssclosed
}

isOpened(){return this.state === 1}
isClosed(){return this.state === 0}

get state(){return this._state || 0}
set state(v){ this._state = v}
}// /WindowController


module.exports = WindowController
