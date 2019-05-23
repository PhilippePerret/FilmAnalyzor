'use strict'

class NextTime {
constructor(){
  this.a = current_analyse
  this.inited = false
}

/**
  Initialisation du temps courant avec le temps +curt+

  @param {OTime} curt   Temps courant, en général
**/
initWithTime(curt){
  let my = this
  var nextEvent, nextImage

  console.log(`[NextTime] Initialisation avec ${curt}`)

  // On cherche l'event situé après ce temps
  var idx = 0, ev, len = this.a.events.length, img
  for(;idx < len; ++idx){
    ev = this.a.events[idx]
    if ( ev.time < curt - 1 ) continue
    nextEvent = ev // un event, une scène ou un noeud stt
    my.event_idx = parseInt(idx,10)
    break
  }
  if(nextEvent){
    console.log(`[NextTime] Event trouvé: ${nextEvent} à ${nextEvent.time}`)
  } else {
    console.log("[NextTime] Aucun event trouvé.")
  }
  console.log(`[NextTime] event_idx: ${my.event_idx}`)

  // On cherche l'image située après ce temps
  len = FAImage.byTimes.length
  for(idx=0;idx<len;++idx){
    img = FAImage.byTimes[idx]
    if (isUndefined(img) ) break // plus d'images
    img = FAImage.get(img.id)
    if ( img.time < curt - 1 ) continue
    nextImage = FAImage.get(img.id)
    my.image_idx = parseInt(idx,10)
    break
  }

  if(nextImage){
    console.log(`[NextTime] Image trouvée: ${nextImage}`)
  } else {
    console.log("[NextTime] Aucune image trouvée.")
  }
  console.log(`[NextTime] image_idx: ${my.image_idx}`)


  this.nextItem = my.nextEventOrNextImage(nextEvent, nextImage)
  console.log(`[NextTime] nextItem: ${my.nextItem}`)

  this.inited = true
}

valueOf(){ return this.nextItem && (this.nextItem.time) }
toString(){ return this.nextItem && this.nextItem.otime.horloge}

/**
  Quand le temps suivant a été atteint, on appelle cette méthode
  pour trouver le temps suivant.
**/
revealNextItemAndFindNext(){
  this.revealNextItem()
  this.findNext()
}

/**
  Méthode appelée quand le temps prochain est atteint
**/
revealNextItem(){
  // console.log("-> revealNextItem", this.nextItem)
  FAReader.reveal(this.nextItem, {fadeOut:true}) // image ou event
  if(this.nextItem.isScene){
    console.log("Le nextItem est une scène")
  } else if (this.nextItem.type == STRstt) {
    console.log("Le nextItem est un noeud structurel")
  } else {
    // C'est une image
  }
}

/**
  Noter qu'on repart du dernier index trouvé, car si le nextItem
  était une image par exemple, peut-être que le prochain sera
  l'event qui avait été retenu.
**/
findNext(){
  let nextImage, nextEvent
  // console.log("-> findNext", {
  //   'this.nextItem.isEvent': this.nextItem.isEvent
  //   , 'event_idx': this.event_idx
  //   , 'image_idx': this.image_idx
  // })
  // Si le next item courant était un
  if ( this.nextItem.isEvent) ++ this.event_idx
  else ++ this.image_idx

  nextImage = FAImage.byTimes[this.image_idx]
  isDefined(nextImage) && ( nextImage = FAImage.get(nextImage.id) )

  nextEvent = this.a.events[this.event_idx]

  // console.log("[finNext] nextEvent:", nextEvent)
  // console.log("[findNext] nextImage:", nextImage)
  this.nextItem = this.nextEventOrNextImage(nextEvent, nextImage)
  // console.log("[findNext] nextItem:", this.nextItem)
  // console.log("[findNext] next time :", this.nextItem.time)
  //
  // console.log("this.nextTime:", this)
}

nextEventOrNextImage(nextEvent, nextImage){
  if ( nextImage && nextEvent && nextImage.time < nextEvent.time) {
    return nextImage
  } else if ( nextEvent ){
    return nextEvent
  } else if ( nextImage ){
    return nextImage
  }
  return // rien
}

} // class NextItem


module.exports = NextTime
