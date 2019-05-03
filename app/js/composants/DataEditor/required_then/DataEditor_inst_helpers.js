'use strict'

Object.assign(DataEditor.prototype,{
init(){
  this.peupleItems()
  this.build()
}
/**
  Méthode qui met les items dans le menu des items
  Rappel : ce menu reste toujours dans la fenêtre, il n'est pas construit
  par la méthode build ci-dessous qui construit le formulaire pour le type
  d'élément
**/
, peupleItems(){
    let my = this
    this.menu.html('<option value="">Éditer l’élément…</option>')
    this.items.map(item => this.menu.append(DCreate('OPTION',{value:item.id, inner: DFormater(item[my.title_prop])})))
  }

/**
  Construction du formulaire propre à l'élément
**/
, build(){
    var divField, tag, tagProps, label
    this.form.html('')
    this.mainClass.dataEditor.dataFields.map(dField => {
      [tag, tagProps] = ((typ)=>{
        switch (typ) {
          case 'text': return ['INPUT', {type: 'text'}]
          case 'textarea': return ['TEXTAREA', {}]
        }
      })(dField.type)
      if(undefined === tagProps.attrs) tagProps.attrs = {}
      tagProps.id = `item-${dField.prop}`
      if(dField.exemple) tagProps.attrs.placeholder = dField.exemple
      label = dField.label
      if(dField.aide) label += ` <span class="tiny">(${dField.aide})</span>`
      // console.log("tagProps:", tagProps)
      divField = DCreate('DIV', {class:'div-form', append:[
          DCreate('LABEL', {inner:label, class:dField.type==='textarea'?'long':''})
        , DCreate(tag, tagProps)
        ]})
      this.form.append(divField)
    })
  }

})
Object.defineProperties(DataEditor.prototype,{
  form:{get(){return this.constructor.form}}
, menu:{get(){return this.constructor.menuItems}}
})
