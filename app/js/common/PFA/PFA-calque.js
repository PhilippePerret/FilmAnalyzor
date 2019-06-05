'use strict'

const PFA_calque = {
calque:{
  built: false
, shown: false
, toggle(){
    if ( isFalse(this.built) ) this.build()
    if ( isFalse(this.shown) ) this.show()
    else this.hide()
  }
, build(){
    var divs = []
    divs.push(
        DCreate(DIV,{id:'CPFA-tiers1'})
      , DCreate(DIV,{id:'CPFA-tiers2'})

      , DCreate(DIV,{id:'CPFA-huit1', class:'huitieme'})
      , DCreate(DIV,{id:'CPFA-huit2', class:'huitieme'})
      , DCreate(DIV,{id:'CPFA-huit3', class:'huitieme'})
      , DCreate(DIV,{id:'CPFA-huit4', class:'huitieme'})

      , DCreate(DIV,{id:'CPFA-part-EXPO', class:'part', inner:'EXPOSITION'})
      , DCreate(DIV,{id:'CPFA-part-DEV1', class:'part', inner:'DÉVELOPPEMENT PART 1'})
      , DCreate(DIV,{id:'CPFA-part-DEV2', class:'part', inner:'DÉVELOPPEMENT PART 2'})
      , DCreate(DIV,{id:'CPFA-part-DNOU', class:'part', inner:'DÉNOUEMENT'})

    )
    let div = DCreate(DIV, {id:'PFA-CALQUE', append:divs})
    UI.sectionTimeline.append(div)
    this.built = true
    this.show().hide()
  }
, show(){
    this.jqObj.css({top: '30px'})
    this.shown = true
    return this // pour le chainage
  }
, hide(){
    this.jqObj.css({top: '240px'})
    this.shown = false
    return this // pour le chainage
  }
}
}
Object.defineProperties(PFA_calque.calque,{
  jqObj:{get(){ return $('#PFA-CALQUE') }}
})

module.exports = PFA_calque
