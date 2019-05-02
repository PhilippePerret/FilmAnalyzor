'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEnote,{

})


Object.assign(FAEnote.prototype,{
/**
  Version note de l'event

  Noter que l'indice de la note (this.indice_note) doit avoir été défini
  avant d'appeler cette méthode.
  @param {Object} options   Options de formatage
**/
asNote(options){
  var divs = []
  if(undefined === this.indice_note) this.indice_note = FATexte.newIndiceNote()
  divs.push(DCreate('SPAN',{class:'note', append:[
      DCreate('SPAN',{class:'note-indice',inner:`[${this.indice_note}]`})
    , DCreate('SPAN',{class:'', inner: DFormater(this.content)})
    ]}))
  if (options && options.as === 'string'){
    return divs[0].outerHTML
  } else {
    return divs
  }
}

})


Object.defineProperties(FAEnote.prototype,{
})
