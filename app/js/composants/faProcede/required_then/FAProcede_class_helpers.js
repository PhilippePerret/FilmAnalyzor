'use strict'
/**
  Méthodes d'helper de classe pour FAProcede
**/

Object.assign(FAProcede,{
// ---------------------------------------------------------------------
//  LES AIDES/DESCRIPTION

descriptionCategorie(cate_id){
  // C'est un menu de CATÉGORIES qui est affiché
  if(cate_id == ''){
    return 'Ce menu présente la liste des grandes catégories de procédés auxquelles peut appartenir l’event.'
  } else {
    return this.data[cate_id].description || `[DESCRIPTION MANQUANTE POUR ${cate_id}]`
  }
}
,
descriptionSousCategorie(cate_id, scate_id){
  if(scate_id == ''){
    return 'Ce menu présente la liste des sous-catégories de la catégorie courante.'
  } else if (scate_id == '..'){
    return 'Cet item permet de remonter au menu des catégories.'
  } else {
    return this.data[cate_id].items[scate_id].description  || `[DESCRIPTION MANQUANTE POUR LA SOUS-CATÉGORIE ${scate_id}]`
  }
}
,
descriptionProcede(cate_id, scate_id, proc_id){
  // C'est un menu de PROCÉDÉS qui est affiché
  if (proc_id == ''){
    return 'Ce menu présente la liste des procédés parmi lesquels il faut choisir.'
  } else if (proc_id === '..'){
    return 'Ce menu permet de remonter à la liste des sous-catégorie de la catégorie courante.'
  } else {
    let dprocede = this.data[cate_id].items[scate_id].items[proc_id]
      , msg = ''
    msg += `<strong>${dprocede.hname}</strong> : `
    msg += dprocede.description  || `[DESCRIPTION MANQUANTE POUR LE PROCÉDÉ « ${dprocede.hname} » (#${proc_id})]`
    if (dprocede.exemple) msg += `${RC+RC}<label>Exemples : </label> ${dprocede.exemple}`
    return msg
  }
}
,
// ---------------------------------------------------------------------
//  LES MENUS
/**
  Construit le premier menu avec les grandes catégories de procédés
  Rappel : il y a trois niveaux, chacun avec une graphie différente :

    CATEGORIE > Sous-catégorie > procédé

  @return {DOMElement}  Le menu désiré

**/
menuCategories(){
  if(undefined === this._menuCategories){
    // On construit le menu
    var options = [DCreate('OPTION',{value:'', inner:"Choisir la catégorie…"})]
    for(var cate_id in this.data){
      options.push(DCreate('OPTION', {value: cate_id, inner: this.data[cate_id].hname}))
    }
    this._menuCategories = DCreate('SELECT', {class: 'menu-categories-procedes', append:options})
  }
  return $(this._menuCategories).clone()
}
,

/**
  Construit et retourne le sous-menu des sous-catégorie de la catégorie de
  procédés +cate_id+

  @return {DOMElement}  Le menu désiré
**/
menuSousCategories(cate_id){
  if(undefined === this._menusSousCategories) this._menusSousCategories = {}
  if(undefined === this._menusSousCategories[cate_id]){
    // Il faut construire ce sous-menu là
    var options = [DCreate('OPTION',{value:'', inner:"Choisir la sous-catégorie…"})]
    options.push(DCreate('OPTION',{value:'..', inner:"[Catégories]"}))
    let cate_items = this.data[cate_id].items
    for(var scat_id in cate_items){
      options.push(DCreate('OPTION',{value: scat_id, inner: cate_items[scat_id].hname}))
    }
    this._menusSousCategories[cate_id] = DCreate('SELECT', {append: options, class: 'menu-sous-categories-procedes', attrs: {'data-cate-id': cate_id}})
  }
  return $(this._menusSousCategories[cate_id]).clone()
}
,
/**

  @return {DOMElement}  Le menu désiré, celui des procédés de la catégorie et
                        sous catégorie attendues.

**/
menuProcedes(cate_id, scate_id, event_id){
  if(undefined === this._menusProcedesSCat) this._menusProcedesSCat = {}
  if(undefined === this._menusProcedesSCat[scate_id]){
    var options = [DCreate('OPTION',{value:"", inner:"Choisir le procédé…"})]
    options.push(DCreate('OPTION',{value:"..", inner:'[Sous-catégories]'}))
    let scat_items = this.data[cate_id].items[scate_id].items
    for (var proc_id in scat_items){
      options.push(DCreate('OPTION',{value:proc_id, inner:scat_items[proc_id].hname}))
    }
    this._menusProcedesSCat[scate_id] = DCreate('SELECT',{id:`event-${event_id}-procType`, append:options, class:'menu-procedes fproc', attrs:{'data-cate-id':cate_id, 'data-scate-id': scate_id, 'data-event-id': event_id}})
  }
  return $(this._menusProcedesSCat[scate_id]).clone()
}

})
