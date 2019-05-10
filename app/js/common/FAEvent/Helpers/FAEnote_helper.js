'use strict'
/**
  Helpers pour les Notes
**/


Object.assign(FAEnote.prototype,{
/**
  Version note de l'event

  Noter que l'indice de la note (this.indice_note) doit avoir été défini
  avant d'appeler cette méthode.
  @param {Object} options   Options de formatage
                            :as       si 'string', on doit renvoyer en string
                            :linked   Si true, on doit ajouter le lien
                            d'édition
**/
asNote(options){
  if(undefined === options) options = {}
  var divs = []
  if(undefined === this.indice_note) this.indice_note = FATexte.newIndiceNote()
  divs.push(DCreate('SPAN',{class:'note-indice',inner:`[${this.indice_note}]`}))
  divs.push(DCreate('SPAN',{class:'', inner: DFormater(this.content)}))
  if(options.linked){divs.push(this.editLink())}
  divs = DCreate('SPAN',{class:'note', append:divs})
  if (options.as === 'string'){
    return divs.outerHTML
  } else {
    return [divs]
  }
}

})
