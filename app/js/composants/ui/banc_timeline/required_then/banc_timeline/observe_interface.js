'use strict'

// BancTimeline::observeBancTimeline()
Object.assign(BancTimeline,{

observeBancTimeline(){
  // On place un observer qui
  let domObserver = new MutationObserver((mutations, observer)=>{
    for(var mutation of mutations){
      if(mutation.type === STRchildList){
        // Un élément ajouté
        console.log("Élément ajouté : ", mutation)
        mutation.addedNodes.forEach( node => {
          $(node).find(TEXT_TAGNAMES)
            .on(STRfocus, BancTimeline.onFocusTextField.bind(BancTimeline))
            .on(STRblur,  BancTimeline.onBlurTextField.bind(BancTimeline))
        })
      }
    }
  })
  let domObserverConfig = {
    // On ne prend pas les changements d'attributs
    attributes: false,
    // On veut la liste des éléments ajoutés et supprimés
    childList: true,
    // Seulement les éléments ajoutés au body
    subtree: false
  };


  // La tape d'échelle (bande métrée) est sensible au clic pour se
  // déplacer dans le film
  this.scaleTape.on(STRclick, this.onClickScaleTape.bind(this))

  // On rend tous les éléments sensible au clic pour les éditer
  this.timelineTape.find('.banctime-element').on(STRclick, this.onClickElement.bind(this))

  // Dans le mode ban timeline, toutes les touches forment des combinaisons
  // clavier, tant qu'on n'est pas dans un champ de texte.
  // Pour activer les obersers, on simule le blur d'un champ
  this.onBlurTextField()

  // On commence à observer le DOM
  domObserver.observe(document.body, domObserverConfig)
  domObserver.observe(document.querySelector('#section-writer'), domObserverConfig)

}// /function

})
