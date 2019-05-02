'use strict'
/**

  Class BtnEvent
  ----------------
  Pour la gestion des boutons qui permettent de créer des
  events.
  La classe gère l'ensemble des boutons, qui sont des
  instances.

**/
class BtnEvent {
// ---------------------------------------------------------------------
//  CLASSE

static toggle(){this.fwindow.toggle()}
static show(){this.fwindow.show()}
static hide(){this.fwindow.hide()}

static build(){
  var btns = []
  for(var etype in EVENTS_DATA){
    btns.push(this.button(etype).as_button)
  }
  return btns
}
static observe(){
  // Tous les boutons doivent réagir au click pour créer un
  // nouvel event
  this.fwindow.jqObj.find('button').on('click', function(e){ EventForm.onClickNewEvent.bind(EventForm)(e, $(this)) })

}

/**
* Retourne le bouton d'identifiant (type) +btn_id+
**/
static button(btn_id){
  if(undefined === this.buttons) this.buttons = {}
  if(undefined === this.buttons[btn_id]) {
    this.buttons[btn_id] = new BtnEvent(EVENTS_DATA[btn_id])
  }
  return this.buttons[btn_id]
}

// La fenêtre volante affichant tous les boutons
static get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{id: 'buttons-new-event', container: $('#section-footer'), y: -50, x: 40, class: 'no-user-selection'}))}

// ---------------------------------------------------------------------
//  INSTANCES
constructor(data){
  this.data = data
}

get as_button(){
  if(undefined === this._as_button){
    this._as_button = DCreate('BUTTON',{
      id:     `btn-new-${this.type}`
    , type:   'button'
    , class:  'small'
    , inner:  this.data.btn_name
    , attrs: {'data-type': this.type, title: `Pour créer un event de type « ${this.data.hname} »` }
    })
  }
  return this._as_button
}

get type(){return this._type||defP(this,'_type',this.data.id)}

}
