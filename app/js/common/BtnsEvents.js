'use strict'
/**

  Class BtnEvent
  ----------------
  Pour la gestion des boutons qui permettent de créer des
  events.
  La classe gère l'ensemble des boutons, qui sont des
  instances.

**/

window.EVENTS_TYPES_DATA = require('./js/common/FAEvents_data.js')

class BtnEvent {
// ---------------------------------------------------------------------
//  CLASSE

static toggle(){this.fwindow.toggle()}
static show(){this.fwindow.show()}
static hide(){this.fwindow.hide()}

static build(){
  var btns = []
  for(var etype in EVENTS_TYPES_DATA){
    btns.push(this.button(etype).as_button)
  }
  return btns
}
static observe(){
  // Tous les boutons doivent réagir au click pour créer un
  // nouvel event
  this.fwindow.jqObj.find(STRbutton).on(STRclick, function(e){ EventForm.onClickNewEvent.bind(EventForm)(e, $(this)) })

}

/**
* Retourne le bouton d'identifiant (type) +btn_id+
**/
static button(btn_id){
  if(isUndefined(this.buttons)) this.buttons = {}
  if(isUndefined(this.buttons[btn_id])) {
    this.buttons[btn_id] = new BtnEvent(EVENTS_TYPES_DATA[btn_id])
  }
  return this.buttons[btn_id]
}

// La fenêtre volante affichant tous les boutons
static get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{id: 'buttons-new-event', name:BtnsEventFWindowName, container: $('#section-footer'), y: -50, x: 386, class: 'no-user-selection'}))}

// ---------------------------------------------------------------------
//  INSTANCES
constructor(data){
  this.data = data
}

get as_button(){
  let attrs =  {title: `Pour créer un event de type « ${this.data.hname} »` }
  attrs[STRdata_type] = this.type
  if(isUndefined(this._as_button)){
    this._as_button = DCreate(BUTTON,{
      id:     `btn-new-${this.type}`
    , type:   STRbutton
    , class:  STRsmall
    , inner:  this.data.btn_name
    , attrs: attrs
    })
  }
  return this._as_button
}

get type(){return this._type||defP(this,'_type',this.data.id)}

}
