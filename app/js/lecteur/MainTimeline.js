'use strict'

const MainTimeline = {
  class: 'MainTimeline'
, inited: false
, visible: false

, toggle(){
    if (!this.inited) this.init()
    this[this.visible?'hide':'show']()
}
, show(){
    this.jqObj.show()
    this.visible = true
}
, hide(){
    this.jqObj.hide()
    this.visible = false
}
, init(){

    var div = document.createElement('DIV')
    div.id = 'main-timeline'
    document.body.appendChild(div)
    this.inited = true

    var fat = new FATimeline(this.jqObj[0])
    fat.init()
}

}
Object.defineProperties(MainTimeline,{
  jqObj:{
    get(){return $('#main-timeline')}
  }
})
