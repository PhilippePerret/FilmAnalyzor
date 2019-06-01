'use strict'

const STRArrowRight = 'ArrowRight'
const STRArrowLeft = 'ArrowLeft'

const GOTODATA = [
    {hname:'Scène suivante', type:'next-scene', shortcut:'s', arrowComb:'⌘→', dataArrowComb:{meta:true, key:STRArrowRight}}
  , {hname:'Scène précédente', type:'prev-scene', shortcut:'S', arrowComb:'⌘←', dataArrowComb:{meta:true, key:STRArrowLeft}}
  , {hname:'Image suivante', type:'next-image', shortcut:'g', arrowComb:'→', dataArrowComb:{key:STRArrowRight}}
  , {hname:'Image précédente', type:'prev-image', shortcut:'G', arrowComb:'←', dataArrowComb:{key:STRArrowLeft}}
  , {hname:'Seconde suivante', type:'next-second', shortcut:'c', arrowComb:'⌥→', dataArrowComb:{meta:false, alt:true, key:STRArrowRight}}
  , {hname:'Seconde précédente', type:'prev-second', shortcut:'C', arrowComb:'⌥←', dataArrowComb:{meta:false, alt:true, key:STRArrowLeft}}
  , {hname:'Event suivant', type:'next-event', shortcut:'e', arrowComb:'⇧⌥→', dataArrowComb:{meta:false, alt:true, shift:true, key:STRArrowRight}}
  , {hname:'Event précédent', type:'prev-event', shortcut:'E', arrowComb:'⇧⌥←', dataArrowComb:{meta:false, alt:true, shift:true, key:STRArrowLeft}}
  , {hname:'10 secondes après', type:'next-tenseconds', shortcut:'t', arrowComb:'⌃→', dataArrowComb:{meta:false, ctrl:true, key:STRArrowRight}}
  , {hname:'10 secondes avant', type:'prev-tenseconds', shortcut:'T', arrowComb:'⌃←', dataArrowComb:{meta:false, ctrl:true, key:STRArrowLeft}}
  , {hname:'Minute suivante', type:'next-minute', shortcut:'l'}
  , {hname:'Minute précédente', type:'prev-minute', shortcut:'L'}
  , {hname:'Début du film', type:'start-film', shortcut:'D', arrowComb:'⇧⌘→', dataArrowComb:{meta:true, shift:true, key:STRArrowRight}}
  , {hname:'Fin du film', type:'end-film', shortcut:'F', arrowComb:'⇧⌘←', dataArrowComb:{meta:true, shift:true, key:STRArrowLeft}}
  , {hname:'Nœud STT suivant', type:'next-sttnode', shortcut:'n', arrowComb:'⇧⌥⌘→', dataArrowComb:{meta:true, alt:true, shift:true, key:STRArrowRight}}
  , {hname:'Nœud STT précédent', type:'prev-sttnode', shortcut:'N', arrowComb:'⇧⌥⌘←', dataArrowComb:{meta:true, alt:true, shift:true, key:STRArrowLeft}}
  , {hname:'Stop-point suivant', type:'next-stoppoint', shortcut:'p'}
  , {hname:'Stop-point précédent', type:'prev-stoppoint', shortcut:'P'}
  , {hname:'Marqueur suivant', type:'next-marker', shortcup:'m', arrowComb:'', dataArrowComb:{meta:true, alt:true, shift:true, key:null}}
  , {hname:'Marqueur précédent', type:'prev-marker', shortcup:'M', arrowComb:'', dataArrowComb:{meta:true, alt:true, shift:true, key:null}}
  ]

module.exports = GOTODATA
