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

    opts.owner = {type: 'brin', id: this.id}

    var divs = [], str

    if(flag & LABELLED) divs.push(DCreate('LABEL', {inner: `${this.htype} #${this.id}`}))

    switch (format) {
      case 'short':
        divs.push(...this.asShort(opts))
        break
      case 'book':
        // Sortie pour le livre
        divs.push(...this.asBook(opts))
        break
      case 'full':
        // Affiche complet, avec toutes les informations
        divs.push(...this.asFull(opts))
        break
      case 'associate':
        divs.push(...this.asAssociate(opts))
        break
      default:
        throw(`Format inconnu : "${format}"`)
    }


    if(flag & DUREE) divs.push(DCreate('SPAN', {class:'duree', inner: ` (${this.hduree})`}))
    if(flag & EDITABLE) divs.push(this.editLink(opts))
    else if (flag & LINKED) divs.push(this.lienVoir(opts))

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
      DCreate('SPAN', {class:'short brin-short', append:[
        DCreate('LABEL',{inner: 'Brin'})
      , DCreate('SPAN', {class:'brin-numero', inner: this.numero})
      , DCreate('SPAN', {inner: DFormater(this.title)})
      ]})
    ]
  }

, asBook(opts){
  return this.asShort(opts) // pour le moment
}

, asFull(opts){
    var divs = []
    divs.push(DCreate('SPAN', {class:'libelle brin-libelle', inner: DFormater(this.libelle)}))
    if(this.description){
      divs.push(DCreate('SPAN', {class:'description brin-description', inner: DFormater(this.description)}))
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
    return DCreate('A', {class:'lkedit', inner: '[edit]', attrs:{onclick:`FABrin.edit('${this.id}')`}})
  }

, lienVoir(opts){
    return DCreate('A', {class:'lkevent', inner:'[voir]', attrs:{onclick: `showBrin('${this.id}')`}})
  }


/**
  Sortie pour le livre édité (et pour le listing des brins)
**/
, asDiv(options){
  if(undefined === options) options = {}
  var divs = []

  if(this.description){
    divs.push(DCreate('DIV', {class: 'description brin-description', inner: this.description}))
  }

  divs.push(
    // La partie statistique du brin
    DCreate('DIV', {class: 'brin-statistiques statistiques', append:[
      DCreate('H3', {inner: 'Statistiques'})
    , DCreate('H4', {inner: 'Présence'})
    , DCreate('LABEL', {inner: 'Durée du brin dans le film : '})
    , DCreate('SPAN', {class: 'brin-temps-presence', inner: `${this.stats.tempsPresence()} (${this.stats.pourcentagePresence()})`})
    ]})
  )

  // S'il y a des associés
  console.log("this.hasAssociates():",this.hasAssociates())
  if(this.hasAssociates()){
    divs.push(DCreate('DIV', {class: `associates ${this.domC('associates')}`, append:this.divsAssociates({title:true, as:'dom'})}))
  }

  return DCreate('LI', {class: 'li-element brin', attrs:{'data-type':'brin', 'data-id': this.id}, append:[
      // La barre de titre qui contient les spécificités du brin et le
      // bouton pour afficher ses informations
      DCreate('DIV',{class:'bar-title', append:[
          DCreate('IMG', {class: 'toggle-container', src:'img/folder_closed.png', attrs:{'data-container-id':`${this.domId}-content`}})
        , DCreate('DIV', {class: 'brin-title', inner: `Brin « ${this.title} » (${this.id})`})
        , this.miniTimeline
        ]})
    , DCreate('DIV',{id:`${this.domId}-content`, class:'element-content not-visible', append:divs})
    ]})
}

})//assign
