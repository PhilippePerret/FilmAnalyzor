'use strict'

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
})
