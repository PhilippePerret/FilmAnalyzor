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
  if (undefined === opts) opts = {}

  opts.owner = {type: 'document', id: this.id || this.type}

  var divs = []

  if(flag & LABELLED) divs.push(DCreate('LABEL', {inner: `DOC #${this.id || this.type}`}))

  switch (format) {
    case 'short':
      divs.push(this.asShort(opts)); break
    case 'book':
      // Sortie pour le livre
      divs.push(this.asBook(opts)); break
    case 'full':
      // Affiche complet, avec toutes les informations
      divs.push(this.asFull(opts)); break
    case 'associate':
      divs.push(...this.asAssociate(opts)); break
    default:
      divs.push(this.asShort(opts))
  }

  if(flag & DUREE) divs.push(DCreate('SPAN',{class:'horloge', inner:` (${this.hduree})` }))

  // --- LE DIV FINAL ---

  // Avec tous ses éléments ajoutés en fonction des choix
  // console.log("domEls:",domEls)
  let divAs = DCreate('DIV', {class:`document DOC${this.id}`, append: divs})

  // --- LE STRING FINAL ---

  // La version string résultant du travail d'assemblage précédent
  let str = divAs.outerHTML

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

, asShort(opts){ return DCreate('SPAN', {class:'titre', inner:DFormater(this.title)}) }
, asBook(opts){ return DCreate('SPAN', {class:'titre', inner:DFormater(this.title)}) }

, asFull(opts){
    return this.asBook() // pour le moment
  }

, asAssociate(opts){
  var divs = []
  divs.push(DCreate('SPAN', {inner: `Doc : ${this.id}`, attrs:{title:`Document « ${DFormater(this.title)} »`}}))
  if(opts.owner){
    // Si les options définissent un owner, on ajoute un lien pour pouvoir
    // dissocier le temps de son possesseur
    divs.push(FAEvent.linkDissocier({owner: opts.owner, owned: this}))
  }
  return divs
}

, as_link(options){
    if(undefined === options) options = {}
    return `« <a onclick="showDocument('${this.id||this.type}')" class="doclink">${options.title || this.title}</a> »`
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
