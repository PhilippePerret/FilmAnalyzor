'use strict'

Object.assign(Helper,{

/**
  Méthode principale permettant d'ouvrir l'aide de type +what+
  Par exemple la première : 'new-element' qui doit afficher le panneau pour
  créer un nouvel élément.
**/
  open(what){
    defaultize(this, 'helpers', {})
    isDefined(this.helpers[what]) || this.buildHelper(what)
    this.helpers[what].open()
  }


/**
  Méthode qui instancie l'helper +what+ (p.e. 'new-element')
**/
, buildHelper(what){
    let newHelper = new Helper(what)
    this.helpers[what] = newHelper
  }
})
