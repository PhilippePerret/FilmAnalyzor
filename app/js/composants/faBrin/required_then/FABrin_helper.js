'use strict'
/**
  Helpers d'instance
**/
Object.assign(FABrin.prototype,{

/**
  Pour conformité avec les autres éléments, events, documents, etc.
  Cf. le détail des arguments dans FAEvent
**/
as(format, flag, opts){
  if (undefined === flag) flag = 0

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
      divs.push(this.asAssociate(opts))
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
    return this.asShort(opts)[0]
  }

, editLink(opts){
    return DCreate('A', {class:'lkedit', inner: '[edit]', attrs:{onclick:`FABrin.edit('${this.id}')`}})
  }

, lienVoir(opts){
    return DCreate('A', {class:'lkevent', inner:'[voir]', attrs:{onclick: `showBrin('${this.id}')`}})
  }


/**
  Sortie pour le livre édité
**/
, asDiv(options){
  if(undefined === options) options = {}
  var divs = [
      DCreate('SPAN', {class: 'brin-title', inner: `Brin #${this.numero}. ${this.title}`})
    , this.miniTimeline
  ]
  if(this.description){
    divs.push(DCreate('SPAN', {class: 'brin-description small', inner: this.description}))
  }

  let infosMasked = [
    DCreate('DIV', {class:'brin-associateds-detailled', append: this.divAssociateds()})
    // La partie statistique du brin
  , DCreate('DIV', {class: 'brin-statistiques', append:[
      DCreate('H4', {inner: 'Présence'})
    , DCreate('LABEL', {inner: 'Durée du brin dans le film : '})
    , DCreate('SPAN', {class: 'brin-temps-presence', inner: `${this.stats.tempsPresence()} (${this.stats.pourcentagePresence()})`})
    ]})

  ]
  if(options.forBook === true){
    divs.push(DCreate('DIV', {class:'brin-infos-masked', append: infosMasked}))
  } else {

    // S'il y a des associés
    let divsAss = this.associateds()
    if(divsAss){
      divsAss.unshift(DCreate('LABEL', {inner: 'Associés :'}))
      divs.push(DCreate('DIV', {class: 'brin-associateds small', append:divsAss}))
    }

    divs.push(DCreate('BUTTON', {type:'button', class: 'toggle-next'}))
    divs.push(DCreate('DIV', {class:'brin-infos-masked', style:'display:none;', append: infosMasked}))
  }
  divs.push(DCreate('DIV', {style:'clear:both;'}))

  return DCreate('DIV', {class: 'brin', append:divs, attrs:{'data-type':'brin', 'data-id': this.id}})
}
,

divAssociateds(){
  var divs = [ DCreate('H4', {inner:'Associés'}) ]
    , id, ass, time
  for(id of this.documents){
    if(ass = FADocument.get(id)){
      divs.push(DCreate('DIV', {attrs:{'data-type':'document', 'data-id': ass.id}, append:[
        DCreate('LI', {class:'document-title', inner: ass.as('associate',FORMATED|LINKED|LABELLED,{no_warm:true})})
      ]}))
    } else {
      console.error(`ERREUR Document introuvable. #${id}`)
    }
  }
  for(id of this.events){
    if(ass = FABrin.a.ids[id]){
      divs.push(DCreate('DIV', {attrs:{'data-type':'event', 'data-id': ass.id}, append:[
        // DCreate('LI', {class:'event-title', inner: ass.as('short',FORMATED|LINKED|LABELLED,{no_warm:true, notes:false})})
        DCreate('LI', {class:'event-title', inner: ass.as('associate',LINKED,{no_warm:true, notes:false})})
      ]}))
    } else {
      console.error(`EVENT INTROUVABLE. ID: #${id}. C'est une erreur grave, l'analyse a besoin d'être fixée.`)
    }
  }
  for(time of this.times){
    ass = new OTime(time)
    divs.push(DCreate('DIV', {attrs:{'data-type':'time', 'data-time': time}, append:[
      DCreate('LI', {class:'time', inner: `<a onclick="showTime(${id})">Temps : ${ass.horloge_simple}</a>`})
    ]}))
  }
  return divs
}
,
/**
  Retourne la liste des éléments associés, en mode court (il suffit de glisser la souris sur l'ID pour le lire)

  TODO: Peut-être que cette méthode devrait être plus universelle, notamment
  pour traiter les nouveaux events non encore enregistrés.
**/
associateds(opts){
  var ass = [], id, ev
  for(id of this.documents){
    ass.push(FADocument.get(id).asAssociate(opts))
  }
  for(id of this.events){
    ev = FABrin.a.ids[id]
    // Lorsque l'on glisse un nouvel event depuis son formulaire de création jusque sur
    // la fenêtre des brins, cet event n'existe pas encore. Dans ce cas, on met juste la
    // marque 'NEW EVENT #XXX'
    // Noter qu'on pourrait très bien récupérer ses valeurs dans le formulaire, mais bon…
    if(ev){
      ass.push(DCreate('SPAN',{inner:`Ev#${id}`, attrs:{title:ev.as('short',ESCAPED,{no_warm:true})}}))
    } else {
      ass.push(DCreate('SPAN',{inner: `NEW EVENT #${id}`}))
    }
  }
  for(id of this.times){
    ass.push(DCreate('SPAN', {append:[
        DCreate('LABEL', {inner: 'temps :'})
      , DCreate('SPAN',  {inner: new OTime(id).horloge_simple})
      ]}))
  }
  if (ass.length){
    return ass
  } else {
    return null
  }
}
})

Object.defineProperties(FABrin.prototype,{

})
