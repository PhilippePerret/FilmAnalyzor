'use strict'
/**
 * Mixin pour élément de l'analyse permettant de gérer leur affichage
 * en listing.
 *
 * Cf. le manuel développeur pour l'aide (#falisting_elements)
 *
**/


class FAListing {
// ---------------------------------------------------------------------
//  CLASSE

// Pour ajouter la propriété `listing` à la classe +classe+ en jouant
// simplement `FAListing.extend(classe)`
static extend(classe){
  this.classIsValid(classe) && (classe.listing = new FAListing(classe))
}

// ---------------------------------------------------------------------
//  INSTANCE
//  Donc un listing particulier, pour la classe +classFAElement+

constructor(classeFAElement){
  this.owner = classeFAElement
}
// Pour ouvrir et fermer le panneau
toggle(force_opened){
  if(undefined === force_opened) this.fwindow.toggle()
  else this.fwindow[force_opened?'show':'hide']()
}
get opened(){return this.fwindow.visible}

// Boucle sur chaque élément (item)
forEachItem(fn){
  for(var el of this.items){if(false === fn(el)) break}
}

// ---------------------------------------------------------------------
//  MÉTHODES DE DOM


build(){
  var header = DCreate(DIV,{class:'header', append:[
      DCreate(BUTTON, {type:'button', class:'btn-close'})
    , DCreate('H3', {inner: this.mainTitle})
    ]})

  var body = DCreate(DIV,{class:'body', append:[
      DCreate(DIV,{class:'explication', inner:T('explication-images-listing')})
    , DCreate(DIV,{class:'falisting', append:this.divsItems()})
    ]})

  var footer = DCreate(DIV,{class:'footer', append:[
      DCreate(BUTTON, {type:'button', class:'btn small update fleft', inner:'Update'})
    , DCreate(BUTTON, {type:'button', class:'small btn-show-all fleft', inner:'Tout', style:'visibility:none;'})
    , DCreate(BUTTON, {type:'button', class:'main-button small btn-ok', inner:'OK'})
    ]})

  return [header, body, footer]
}
afterBuilding(){
  this.btnShowAll.css('visibility','hidden')
  this.selected && this.select(this.selected)
  this.setHeight()
}

/**
  Observation des éléments
**/
observe(){

  this.observeListing()

  // Le bouton OK doit être surveillé
  this.btnOK.on('click', this.onOK.bind(this))
  // Le bouton pour actualiser la liste
  this.jqObj.find('.footer BUTTON.update').on('click', this.update.bind(this))
  // Le bouton pour montrer tous les éléments
  this.btnShowAll.on('click', this.showAll.bind(this))

}
observeListing(){
  if(this.associable){
    // Les LI doivent être rendus draggable et droppable
    this.jqObj.find('.falisting > LI')
      .draggable(DATA_ASSOCIATES_DRAGGABLE)
      .droppable(DATA_ASSOCIATES_DROPPABLE)
  }
}

// ---------------------------------------------------------------------
//  Méthodes d'évènement

onOK(){
  this.owner.modified && this.owner.save()
  this.toggle()
}

/**
  Pour sélectionner un élément en particulier
**/
select(item_id){
  let item = this.owner.get(item_id)
  this.jqObj.find('.body .falisting > LI').hide()
  this.jqObj.find(`.body > LI.falisting-${item.domClass}`).show()
  this.btnShowAll.css('visibility','visible')
}

showAll(){
  this.jqObj.find('.body .falisting > LI').show()
  this.btnShowAll.css('visibility','hidden')
}

// ---------------------------------------------------------------------
//  Méthodes de construction

update(){
  this.listing.html('')
  this.divsItems().map(div => this.listing.append(div))
  this.observeListing()
  F.notify("Liste actualisée.")
}

divsItems(){
  var arr = [], li, attrs
  this.forEachItem(it => {
    Object.assign(this.itemOptions,{as:'dom', owner:{id:it.id, type:it.metaType||it.type}})
    li = this.asListItem(it, this.itemOptions)
    attrs = {}
    attrs.id = `falisting-${it.domClass}`
    attrs.class = li.className ? li.className.split(' ') : []
    attrs.class.push(it.metaType||it.type)
    if (this.editable) {
      li.prepend(this.buildEditButton(it))
    }
    if (this.removable){
      li.prepend(this.buildRemoveButton(it))
    }
    if(this.displayAssociates){
      it.hasAssociates() && li.append(DCreate(DIV,{class:'associates', append:it.divsAssociates(Object.assign({}, this.itemOptions, {title:true}))}))
    }
    if (this.associable){
      Object.assign(attrs,{'data-id':it.id, 'data-type':(it.metaType||it.type)})
    }
    $(li).attr(attrs)
    arr.push(li)
  })
  return arr
}

setHeight(){
  this.jqObj.css('height',`${ScreenHeight - 100}px`)
}

// ---------------------------------------------------------------------
// MÉTHODES DE CONSTRUCTION POUR LES ITEMS
buildEditButton(item){
  let attrs = {onclick:`${item.constructor.name}.edit('${item.id}', event)`}
  return DCreate('A',{id:this.editBtnUID, class:'lkedit lktool fright',inner:'edit',attrs:attrs})
}

buildRemoveButton(item){
  let attrs = {onclick:`${item.constructor.name}.destroy('${item.id}')`}
  return DCreate('A',{class:'lkdel lktool fright',inner:' x ',attrs:attrs})
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// PROPRIÉTÉS

// ---------------------------------------------------------------------
//  PROPRIÉTÉS DÉFINISSABLE PAR LE PROPRIÉTAIRE

// Titre principal de la fenêtre
get mainTitle() {
  if(undefined === this._maintitle){
    this._maintitle = this.data.mainTitle || `${this.owner.type.toUpperCase()}S`
  }
  return this._maintitle
}
// Toutes les instances transmises
get items(){return this._items || defP(this,'_items', this.data.items)}
set items(v){this._items = v ; this.data.items = v}
// Options pour construire le LI des items
get itemOptions(){return this._item_options||defP(this,'_item_options',this.data.item_options || {})}
// True si l'item doit être éditable
get editable(){return this.data.editable || false}
// True si les items doit être rendu associable
get associable(){return this.data.associable}
// True si les items peuvent être supprimés
get removable(){return this.data.removable}
// ID de l'élément à sélectionner
get selected(){return this.data.selected}
// False si les associés ne doivent pas être affichés (true par défaut)
get displayAssociates(){
  if(undefined === this._displayAssociates){
    if(undefined === this.data.displayAssociates)this.data.displayAssociates = true
    this._displayAssociates = !!this.data.displayAssociates
  }
  return this._displayAssociates
}
asListItem(it,ops){return this.data.asListItem(it,ops)}
get data(){return this._data||defP(this,'_data',this.owner.DataFAListing)}

// ---------------------------------------------------------------------

get listing()   {return this._listing||defP(this,'_listing', this.jqObj.find('.falisting'))}
get btnOK()     {return this.fwindow.jqObj.find('.footer .btn-ok')}
get btnShowAll(){return this.fwindow.jqObj.find('.footer .btn-show-all')}
get jqObj()     {return this.fwindow.jqObj}
get fwindow()   {return this._fwindow||defP(this,'_fwindow', new FWindow(this,{name:`${this.owner.name}-FAListing`, class:'fwindow-listing-type images', x:200,y:100}))}
}



// ---------------------------------------------------------------------
//  Méthodes ponctuelles
Object.assign(FAListing,{
  classIsValid(classe){
    var res
    try {
      undefined !== classe.DataFAListing || raise('falist-data-required')
      let data = classe.DataFAListing
      undefined !== data.items || raise('falist-items-required')
      undefined !== data.asListItem || raise('falist-aslistitem-required')
      'function'== typeof(data.asListItem) || raise('falist-aslistitem-must-be-function')
      // On essaie de voir si l'instance répond bien à `asListItem`. S'il y a
      // des items, on utilise le premier, sinon, on essaie de créer une
      // instance et en cas d'échec, on ne teste pas.
      let it = data.items[0]
      if(it){
        res = data.asListItem(it)
        res || raise('falist-aslistitem-bad-return')
        'string' === typeof(res.outerHTML) || raise('falist-aslistitem-bad-return')
        res.tagName === LI || raise('falist-aslistitem-required')
      }
      it = null

      // La classe doit répondre à la méthode save()
      'function'===typeof(classe.save) || raise('faliste-owner-save-required')

      data.editable === true && 'function'!==typeof(classe.edit) && raise('faliste-edit-function-required')

      data.removable === true && 'function'!==typeof(classe.destroy) && raise('faliste-destroy-fct-require')



    } catch (e) {
      return F.error(T(e, {classe: classe.name}))
    }
    return true
  }
})

module.exports = FAListing
