'use strict'

const PanelPersos = {
  toggle(opened){
    if(undefined === opened) this.fwindow.toggle()
    else this.fwindow[opened?'show':'hide']()
  }

, beforeHide(){
    FAPersonnage.saveIfModify()
  }

, build(){
    let divsPersonnages = this.personnages.map(perso => perso.domListing())
    return [
      DCreate('DIV', {class: 'header', append:[
          DCreate('BUTTON', {type:'button', class:'btn-close'})
        , DCreate('H3', {inner: `Personnages`})
        ]})
    , DCreate('DIV', {class:'body', append: [
        DCreate('UL', {class:'personnages', append:divsPersonnages})]})
    , DCreate('DIV', {class:'footer', append:[
        DCreate('IMG', {class:'update fleft', src:'img/update-2.png'})
      , DCreate('BUTTON', {type:'button', inner: 'Tous', class: 'btn-show-all'})
      , DCreate('BUTTON', {type:'button', inner: 'OK', class: 'btn-ok'})
      ]})
    ]
  }

, observe(){

    // L'observation de chaque élément, dont, notamment, la gestion du bouton
    // 'edit' et le drag de l'élément.
    this.personnages.map(p => p.observe())

    this.jqObj.find('.btn-ok').on('click', this.fwindow.toggle.bind(this.fwindow))
    this.jqObj.find('.footer img.update').on('click', this.update.bind(this))
    this.btnShowAll.on('click', this.showAll.bind(this))
    this.btnShowAll.css('visibility','hidden')
  }

/**
  Met le personnage +perso_id+ en exergue
  En fait, on masque tous les autres sauf celui-là.
  Et on affiche un bouton "Voir tous" qui remettra tous les personnages

  @param {String} perso_id  Identifiant du personnage

**/
, select(perso_id){
    this.jqObj.find('li.li-perso').hide()
    this.jqObj.find(`li.li-perso#li-perso-${perso_id}`).show()
    this.btnShowAll.css('visibility','visible')
  }

, showAll(){
    this.jqObj.find('li.li-perso').show()
    this.btnShowAll.css('visibility','hidden')
  }

/**
  Pour actualiser la liste des personnages (après modification autre part)
**/
, update(){
    this.ulPersos.html('')
    this.personnages.map(p => p = null)
    delete this._personnages
    this.personnages.map(p => {
      this.ulPersos.append(p.domListing())
      p.observe()
    })
    F.notify("Actualisation effectuée avec succès.")
  }
}
Object.defineProperties(PanelPersos, {
  opened:{get(){return !!this.fwindow.visible}}
, personnages:{get(){
    if(undefined === this._personnages){
      this._personnages = FAPersonnage.personnages.map(p => new PanelPersonnage(p))
    }
    return this._personnages
  }}
, ulPersos:{get(){return this._ulPersos || defP(this,'_ulPersos',this.jqObj.find('ul.personnages'))}}
, btnOK:{get(){return this.jqObj.find('button.btn-ok')}}
, btnShowAll:{get(){return this.jqObj.find('button.btn-show-all')}}
, jqObj:{get(){return this.fwindow.jqObj}}
, fwindow:{
    get(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{class:'fwindow-listing-type personnages', x:10, y:10}))}
  }

})

/**
  Class PanelPersonnage pour les personnages du panneau
**/
class PanelPersonnage {

constructor(instance){
  this.instance = this.i = instance
}

toString(){return this._tostring||defP(this,'_tostring',`<span class="${this.domC('pseudo')}">${this.pseudo}</span> (#${this.id})`)}

domListing(){
  var divs = []
  divs.push(DCreate('A', {class:'lkedit edit fright', inner: 'edit'}))
  divs.push(DCreate('SPAN', {class:`pseudo ${this.i.domC('pseudo')}`, inner: this.pseudo}))
  divs.push(DCreate('DIV', {class:`references`, inner:this.i.f_references /* id et DIM */}))
  if(this.i.prenom || this.i.nom){
    divs.push(DCreate('DIV', {class:'patronyme', append:[
      DCreate('SPAN', {class:`prenom ${this.i.domC('prenom')}`, inner: this.i.prenom})
    , DCreate('SPAN', {class:`nom ${this.i.domC('nom')}`, inner: this.i.nom})
    ]}))
  }
  if(this.i.ages){
    divs.push(DCreate('DIV',{class:`ages ${this.i.domC('ages')}`, inner: this.i.f_ages}))
  }
  divs.push(DCreate('DIV',{class:`description ${this.i.domC('description')}`, inner:this.i.f_description}))

  if(this.i.fonctions){
    // console.log("this.i.fonctions:",this.i.fonctions)
    divs.push(DCreate('DIV',{class:`fonctions ${this.i.domC('fonctions')}`, inner:this.i.f_fonctions}))
  }

  if(this.i.dimensions){
    divs.push(DCreate('DIV',{class:`dimensions ${this.i.domC('dimensions')}`, inner:this.i.f_dimensions}))
  }

  // S'il y a des éléments associés, on les marque
  if(this.i.associates){
    divs.push(DCreate('DIV',{class:`associates ${this.i.domC('associates')}`, inner:this.i.f_associates}))
  }

  // On construit le LI final
  return DCreate('LI', {id:`li-perso-${this.id}` , class:'li-element li-perso personnage', append:divs, attrs:{
      'data-type':'personnage', 'data-id':this.id
    }})
}

observe(){

  // Le bouton edit doit permettre d'éditer le personnage
  this.li.find('a.edit').on('click', this.edit.bind(this))

  // Le LI doit réagir au drop d'élément
  this.li.droppable(DATA_DROPPABLE /* comme donnée universelle */)

  // Chaque élément est draggable
  this.li.draggable({
      revert: true
    , helper: () => {return this.i.dragHelper()}
    // , helper: () => {return `<div class="personnage" data-type="personnage" data-id="${this.id}" data-dim="${this.dim}">${this.pseudo} (#${this.id})</div>`}
    , cursorAt: {left:40, top:20}
  })
}

edit(){
    FAPersonnage.edit(this.id)
  }

get id(){return this.instance.id}
get pseudo(){return this.instance.pseudo}
get li(){return this._li||defP(this,'_li',PanelPersos.jqObj.find(`li#li-perso-${this.id}`))}
}

module.exports = PanelPersos
