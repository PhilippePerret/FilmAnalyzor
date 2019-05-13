'use strict'
/**
  Helpers pour les Notes
**/


Object.assign(FAEnote.prototype,{
/**
  Version note de l'event

  @param {Object} options   Options de formatage
                            :as       si 'string', on doit renvoyer en string
                            :linked   Si true, on doit ajouter le lien
                            d'édition
**/
asNote(options){
  if(undefined === options) options = {}
  var divs = []
  if(undefined === this.indice_note) this.indice_note = FATexte.newIndiceNote()
  if(options.curimage && this.needCurImage()){
    divs.push(this.curImageDiv(options))
  }
  divs.push(DCreate(SPAN,{class:'note-indice',inner:`[${this.indice_note}]`}))
  divs.push(DCreate(SPAN,{class:'', inner: DFormater(this.content)}))
  if(options.linked){divs.push(this.editLink())}
  divs.push(DCreate(DIV,{style:'clear:both;'}))
  divs = DCreate(SPAN,{class:'note', append:divs})
  if (options.as === 'string'){
    return divs.outerHTML
  } else {
    return [divs]
  }
}

, asBook(opts){
    return this.asNote(Object.assign(opts||{}, {forBook:true, curimage:true}))
  }

})
