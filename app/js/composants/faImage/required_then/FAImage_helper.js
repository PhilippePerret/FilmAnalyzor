'use strict'

Object.assign(FAImage.prototype,{
  asDiv(opts){
    var divs = []
      , styles = []
    if(this.size)     styles.push(`width:${this.f_size};`)
    if(this.position) styles.push(this.f_position)
    styles = styles.length > 0 ? styles.join('') : null
    divs.push(DCreate(IMG,{src:this.path, class:opts.imgClass, style:styles}))
    if(opts && !opts.no_legend && this.legend){
      divs.push(DCreate(DIV,{class:'img-legend', inner:this.f_legend}))
    }
    return DCreate(DIV,{id:`div-${this.domId}-curimage`, class:'curimage', append:divs})
  }
})
Object.defineProperties(FAImage.prototype,{
  f_legend:{get(){return DFormater(this.legend||`Légende de ${this.fname}`)}}
, f_size:{get(){
    if(undefined === this._fsize){
      if(undefined === this.size){
        this._fsize = '---'
      } else if (this.size.match(/\%/)){
        this._fsize = this.size
      } else {
        this._fsize = `${this.size}px`
      }
    }
    return this._fsize
  }}
, f_position:{get(){
    if (undefined === this._fposition){
      this._fposition = (pos => {
        switch (pos) {
          case 'float-left':  return 'float:left;'
          case 'float-right': return 'float:right;'
          case 'above': return 'display:block;text-align:center;'
          default:

        }
      })(this.position)
    }
    return this._fposition
  }}
})
