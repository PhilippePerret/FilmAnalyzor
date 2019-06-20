'use strict'

const PFA_Calque = {
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
    this.show(this.hide.bind(this))
  }
, show(fn){
    this.jqObj.css({top: '30px'})
    this.shown = true
    isFunction(fn) && fn.call()
    return this // pour le chainage
  }
, hide(fn){
    this.jqObj.css({top:this.top})
    this.shown = false
    isFunction(fn) && fn.call()
    return this // pour le chainage
  }
}

Object.defineProperties(PFA_Calque,{
  jqObj:{get(){ return $('#PFA-CALQUE') }}
, top:{
    get(){return `${UI.sectionTimeline.outerHeight()}px`}
  }
})

module.exports = PFA_Calque
