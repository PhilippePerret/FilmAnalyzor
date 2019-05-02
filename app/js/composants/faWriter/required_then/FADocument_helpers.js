'use strict'
/**
  Méthode d'helper pour les documents FADocument
**/
Object.assign(FADocument.prototype,{

/**
  Retourne le document au format voulu (pour la correspondance avec la
  méthode de même nom pour les events)
**/
as(format, flag, opts){
  if (undefined === flag) flag = 0
  // Pour le moment, on lie par défaut (NON !)
  // Pour le moment, on corrige par défaut
  flag = flag | FORMATED

  // console.log("-> as(format, flag)", format, flag)

  var str
  switch (format) {
    case 'short':
      str = this.asShort(opts)
      break
    case 'book':
      // Sortie pour le livre
      str = this.asBook(opts)
      break
    case 'full':
      // Affiche complet, avec toutes les informations
      str = this.asFull(opts)
      break
    case 'associate':
      str = this.asAssociate(opts)
      break
    default:
      str = this.title
  }

  if(flag & LABELLED) str = `<label>DOC #${this.id || this.type} : </label> ${str}`

  if(flag & DUREE) str += ` (${this.hduree})`

  if(flag & FORMATED) str = DFormater(str)

  if(flag & ESCAPED){
    // Note : il exclut editable et linked
    str = str.replace(/<(.*?)>/g, '')
    str = str.replace(/\"/g, '\\\"')
    str = str.replace(/[\n\r]/,' --- ')
  } else if ( flag & EDITABLE ){
    // Note : il exclut LINKED
    str = this.editLink(str).outerHTML // TODO CORRIGER TOUTE CETTE MÉTHODE COMME FAEvent
    // console.log("str:", str)
  } else if(flag & LINKED){
    str = this.linked(str)
  }


  return str
}

, asShort(opts){ return this.title }
, asBook(opts){ return this.title }
, asFull(opts){
    return this.asBook() // pour le moment
  }
// asAssociate est défini ailleurs
, linkedToEdit(str){return `<a onclick="showDocument(${this.argId})">${str}</a>`}
, linked(str){return `<a onclick="showDocument(${this.argId})">${str}</a>`}

}) // /fin Object.assign

Object.defineProperties(FADocument.prototype,{
  argId:{
    get(){return this._argId||defP(this,'_argId', this.id||`'${this.type}'`)}
  }
})
