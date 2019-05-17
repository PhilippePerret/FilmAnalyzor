'use strict'

/**
  Données fixes pour les scripts d'assemblage
**/

const BUILDING_SCRIPT_DATA = {

  infos_film:{
      hname: 'Infos sur le film (et analyse)'
  }

, recompenses: {
      hname: 'Récompenses obtenues'
  }

, note_version_original:{
      hname: "Note sur version originale"
    , explication: 'Ajoute une note qui invite à regarder le film dans sa langue originale'
  }

, synopsis: {
      hname: 'Synopsis'
  }

, scenier: {
      hname: 'Scénier'
    , explication: "Ce document ne présente que la liste des scènes, avec intitulé et pitch."
  }

, au_fil_du_film: {
      hname: 'Au fil du film'
    , explication: "Contrairement au scénier qui ne présente qu'une liste des scènes avec leur résumé, ce document présente l'intégralité des notes et des synopsis de chaque scène."
  }

, rapport_visionnage: {
      hname: 'Rapport de visionnage'
    , explication: "Pour une utilisation particulière de l'application qui permet de produire un commentaire sur un film."
  }

, intro_generale:{
      hname: 'Introduction générale'

  }

, fondamentales:{
      hname: 'Fondamentales principales'
  }

, fondamentales_alt:{
      hname: 'Fondamentales alternatives'
  }

, personnages:{
      hname: 'Commentaires sur personnages'
}

, themes: {
      hname: 'Commentaires sur les thèmes'
  }

, intrigues: {
      hname: 'Commentaires sur intrigues'
  }

, pfa: {
      hname: 'Paradigme de Field'
  }

, pfa_alt: {
      hname: 'PFA alternatif'
  }

, diagramme_dramatique: {
      hname: 'Diagramme dramatique'
  }

, diagramme_dynamique: {
      hname: 'Diagramme dynamique'
    , explication: "Construit le diagramme dynamique qui montre la répartition des OOC (objectif, obstacle, conflit)."
  }

, lecon: {
      hname: 'Leçon tirée du film'
  }

, conclusion:{
      hname: 'Conclusion générale'
  }

, documents: {
      hname: null
    , items_method: FABuildingScript.customDocumentsAsSteps.bind(FABuildingScript)
  }

, custom_brins: {
      hname: null
    , items_method: FABuildingScript.brinsAsSteps.bind(FABuildingScript)
  }

, brins_personnages:{
      hname: 'Brins des personnages'
    , explication: "Ce document présente les données générales de chaque brin de personnage, automatiquement réalisé."
  }

, annexes: {
      hname: 'Début de l’annexes'
    , explication: 'Ce bloc permet de délimiter ce qui fera partie de l’annexe (tout ce qui sera en dessous).'
  }

, lexique: {
      hname: 'Lexique des termes propres'
  }

, statistiques: {
      hname: 'Statistiques générales'
    , explication: "Les statistiques générales, telles que le nombre de scènes et leur durée moyenne, le pourcentage d'utilisation des personnages et des décors, etc."
  }

}
