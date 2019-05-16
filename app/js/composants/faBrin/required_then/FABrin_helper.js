'use strict'
/**
  Helpers d'instance
**/
Object.assign(FABrin.prototype,{

toString(){
  if(undefined === this._tostring) this._tostring = `Brin « ${this.title} » (#${this.id})`
  return this._tostring
}

/**
  Pour conformité avec les autres éléments, events, documents, etc.
  Cf. le détail des arguments dans FAEvent
**/
, as(format, flag, opts){
    if (undefined === flag) flag = 0
    if (undefined === opts) opts = {}

    opts.owner = {type: STRbrin, id: this.id}

    var divs = [], str

    if(flag & LABELLED) divs.push(DCreate(LABEL, {inner: `${this.htype} #${this.id}`}))

    switch (format) {
      case STRshort:
        divs.push(...this.asShort(opts))
        break
      case STRbook:
        // Sortie pour le livre
        divs.push(...this.asBook(opts))
        break
      case STRfull:
        // Affiche complet, avec toutes les informations
        divs.push(...this.asFull(opts))
        break
      case STRassociate:
        divs.push(...this.asAssociate(opts))
        break
      default:
        throw(`Format inconnu : "${format}"`)
    }


    if(flag & DUREE) divs.push(DCreate(SPAN, {class:'duree', inner: ` (${this.hduree})`}))
    if(flag & EDITABLE) divs.push(this.editLink(opts))
    else if (flag & LINKED) divs.push(this.showLink(opts))

    if(flag & ESCAPED){
      // Note : il exclut editable et linked
      str = str.replace(/<(.*?)>/g, '')
      str = str.replace(/\"/g, '\\\"')
      str = str.replace(/[\n\r]/,' --- ')
    }
    else if(flag & LINKED){
      str = this.linked(str)
    }
    return str
  }

, asShort(opts){
    return [
      DCreate(SPAN, {class:'short brin-short', append:[
        DCreate(LABEL,{inner: 'Brin'})
      , DCreate(SPAN, {class:'brin-numero', inner: this.numero})
      , DCreate(SPAN, {inner: this.f_title})
      ]})
    ]
  }

, asBook(opts){
  return this.asShort(opts) // pour le moment
}

, asFull(opts){
    var divs = []
    divs.push(DCreate(SPAN, {class:'libelle brin-libelle', inner: DFormater(this.libelle)}))
    if(this.description){
      divs.push(DCreate(SPAN, {class:'description brin-description', inner: this.f_description}))
    }
    return divs
  }

, asAssociate(opts){
    var divs = this.asShort(opts)
    if(opts.owner){
      // Si les options définissent un owner, on ajoute un lien pour pouvoir
      // dissocier le temps de son possesseur
      divs.push(this.dissociateLink())
    }
    return divs
  }

, editLink(opts){
    return DCreate(A, {class:'lkedit', inner: '[edit]', attrs:{onclick:`FABrin.edit('${this.id}')`}})
  }

, showLink(opts){
    return DCreate(A, {class:'lkevent', inner:'[voir]', attrs:{onclick: `showBrin('${this.id}')`}})
  }

, divStatistiques(opts){return this.stats.divStatistiques()}


})//assign
Object.defineProperties(FABrin.prototype,{
  f_title:{get(){return DFormater(this.title)}}
, f_description:{get(){
    if(this.description) return DFormater(this.description)
    else return '---'
  }}
, f_type:{get(){return (this.htype && this.htype != '') ? this.htype : '---'}}
})
