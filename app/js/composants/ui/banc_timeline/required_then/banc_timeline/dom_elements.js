'use strict'
/**
  Définition de tous les éléments du DOM de BancTimeline
**/
Object.defineProperties(BancTimeline,{

  markShortcuts:{get(){
    return this._markshortcuts || defP(this,'_markshortcuts',$('#banctime-mode-shortcuts'))
  }}

})
