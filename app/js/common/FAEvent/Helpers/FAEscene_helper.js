'use strict'
/**
  Méthodes d'helper pour la sous-classe FAEscene

**/
Object.assign(FAEscene.prototype,{

/**
  La version la plus courte de la scène, pour la marque de scène
  au-dessus de la vidéo, pour le moment, et pour les liens

  Noter que pour le moment, ça retourne un {String}, contrairement à la
  nouvelle façon de procéder.
**/
asPitch(opts){
  if(undefined === this._aspitch){
    if(this.isRealScene) this._aspitch = DFormater(`${this.numero}. ${this.pitch}`)
    else this._aspitch = 'GÉNÉRIQUE'
  }
  return this._aspitch
}
,
/**
  Version courte propre au scène
  Pour les scènes, le résumé (content) et le pitch (titre) peuvent
  commencer par le même texte. Dans ce cas-là, on ne prend que le
  résumé.
**/
asShort(opts){
  // console.log("-> FAEscene#asShort")
  let divs = []
  divs.push(DCreate('SPAN', {class: 'scene-num', inner: `sc. ${this.numero}`}))
  // Si le résumé contient le pitch, on n'a pas besoin de le marquer
  if (!this.resume.match(new RegExp(`${RegExp.escape(this.pitch)}`))){
    divs.push(DCreate('SPAN', {class: 'scene-pitch', inner: DFormater(this.pitch)}))
  }
  divs.push(DCreate('SPAN', {class:'scene-resume', inner: DFormater(this.resume)}))
  return divs
}

/**
  Sortie complète de l'event, par exemple pour le reader
**/
, asFull(opts){
    if(undefined === opts) opts = {}
    opts.noTime = true
    let divs = []
    divs.push(...this.asBook(opts))
    let divAssos = this.divAssociates(opts)
    // console.log("[FAScene#asFull] divAssos:", divAssos)
    divAssos && divs.push(...divAssos)
    return divs
  }

,
/**
  Pour le livre
  TODO Peut-être qu'il faudrait une appellation qui indique qu'il
  s'agit du scénier (`inScenier`)
**/
asBook(opts){
  var divs = []
  var scene_content = []
  divs.push(this.f_scene_heading(opts))
  if(this.isRealScene && this.pitch){
    let re = new RegExp(`${RegExp.escape(this.pitch)}`)
    if (!(this.resume||'--non défini--').match(re)) scene_content.push(this.f_pitch)
  }
  if(this.isRealScene) scene_content.push(DCreate('SPAN',{class:'resume', inner: DFormater(this.resume)}))
  divs.push(DCreate('SPAN',{class:'scene-content', append: scene_content}))
  return divs
}

,
f_scene_heading(opts){
  // console.log("-> FAEscene#f_scene_heading")
  if(undefined === opts) opts = {}
  var headingElements = []
  if(this.isRealScene){
    headingElements.push(DCreate('SPAN', {class:'scene-numero', inner: `${this.numero}. `}))
  } else {
    headingElements.push(DCreate('SPAN', {class: 'scene-numero', inner: 'GÉNÉRIQUE'}))
  }
  if(this.lieu){
    headingElements.push(DCreate('SPAN', {class:'scene-lieu', inner: `${this.lieu.toUpperCase()}. `}))
  }
  if(this.effet){
    headingElements.push(DCreate('SPAN', {class:'scene-effet', inner: this.effet.toUpperCase()}))
  }
  if(this.decor){
    headingElements.push(DCreate('SPAN', {inner:' – '}))
    headingElements.push(DCreate('SPAN', {class:'scene-decor', inner: DFormater(this.decor).toUpperCase()}))
  }
  if(this.sous_decor){
    headingElements.push(DCreate('SPAN', {inner: ' : '}))
    headingElements.push(DCreate('SPAN', {class:'scene-sous-decor', inner: DFormater(this.sous_decor).toUpperCase()}))
  }
  if(!opts.noTime){
    headingElements.push(DCreate('SPAN', {class:'scene-time', inner: ` (${new OTime(this.time).horloge_simple})`}))
  }
  // On peut assembler l'entête
  return DCreate('SPAN', {class: 'scene-heading', append: headingElements})
}

// /**
//  * Retourne le lien vers l'event
//  * Pour remplacer par exemple une balise `event: <id>`
//  *
//  * Note : si ce texte est modifié, il faut aussi corriger les tests à :
//  * ./app/js/TestsFIT/tests/Textes/fatexte_tests.js
//  */
// , asLink(alt_text){
//     if(undefined === this._asLink){
//       this._asLink = `<a class="lkscene" onclick="showScene(${this.numero})">[voir]</a>`
//     }
//     return `${alt_text || this.asPitch()} ${this._asLink}`
//   }
})

Object.defineProperties(FAEscene.prototype,{
  f_pitch:{
    get(){
      if(undefined === this._f_pitch){
        this._f_pitch = DCreate('SPAN', {class:'scene-pitch', inner: DFormater(this.pitch)})
      }
      return this._f_pitch
    }
  }
})
