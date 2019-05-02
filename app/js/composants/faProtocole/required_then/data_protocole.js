'use strict'
/**

  Données d'un protocole d'analyse

**/
// Liste des étapes du protocole qui permettent de définir l'état
// d'avancement de l'analyse.
// Par exemple, si seules les étapes de la donnée '10' (pour « 10 % ») sont
// checkées, l'état d'avancement général est calculé sur la base de ces
// 10 %.
FAProtocole.States = {
  '5':[]
, '10':['infos-film', 'collecte-scenes', 'collecte-stt', 'fiche-identite', 'debut-fin-film']
, '20':['reflexion-lecon', 'ebauche-synopsis']
, '30':['ebauche-personnages','ebauche-introduction']
, '40':['ebauche-lecon', 'ebauche-themes','documents-ebauches']
, '50':['comments-stats','fondamentales','pfa', 'full-collecte', 'rewards']
, '60':['redaction-conclusion']
, '70':['qrd','diagramme-dynamique','building-script', 'documents-required']
, '80':['final-themes','final-personnages']
, '90':['final-introduction','final-conclusion','final-lecon-tiree']
, '100':['full-relecture', 'full-correction','final-cover', 'final-ebook']
, '110':['publication'] // pour la vérification en bas de ce fichier
}
FAProtocole.DATA = {
  steps:[
    {id:'infos-film', libelle: "Informations complètes sur le film", steps:[
      {id: 'fiche-identite', libelle: 'Fiche d’identité (document « Informations »)'}
    , {id: 'debut-fin-film', libelle: 'Définition du temps de début et de fin du film'}
    , {id: 'rewards', libelle: 'Récompenses obtenues (document « Récompenses »)'}
    ]}
  , {id:'full-collecte', libelle: 'Collecte complète', steps: [
      {id:'collecte-scenes', libelle: 'Collecte des scènes'}
    , {id:'collecte-procedes', libelle: 'Collecte des procédés'}
    , {id:'collecte-stt', libelle:'Collecte des éléments structurels'}
    , {id:'collecte-dyna', libelle:'Collecte des éléments de Dynamique narrative'}
    , {id:'collecte-events', libelle:'Collecte de tous les events'}
    ]}
  , {id:'reflexion-lecon', libelle:'Réflexion sur le choix de la leçon tirée du film.'}

  , {type:'separator'}

  , {id:'documents-required', libelle:'Documents obligés', steps:[
      {id:'fondamentales', libelle: 'Les Fondamentales'}
    , {id:'pfa', libelle: 'Le Paradigme de Field Augmenté'}
    , {id:'qrd', libelle: 'Le Diagramme Dramatique'}
    , {id:'diagramme-dynamique', libelle: 'Le Diagramme Dynamique'}
    ]}

  , {type:'separator'}

  , {id:'documents-ebauches', libelle:'Ébauches de documents', steps:[
      {id:'ebauche-synopsis', libelle: 'Ébauche du synopsis'}
    , {id:'ebauche-introduction', libelle: 'Ébauche de l’Introduction'}
    , {id:'ebauche-personnages', libelle: 'Ébauche du chapitre Personnages'}
    , {id:'ebauche-themes', libelle: 'Ébauche du chapitre sur les thèmes'}
    , {id:'ebauche-lecon', libelle: 'Ébauche Leçon tirée du film'}
    ]}

  , {type:'separator'}

  , {id:'comments-stats', libelle:'Commentaires sur les statistiques'}
  , {id:'redaction-conclusion', libelle: 'Rédaction de la conclusion'}
  , {id:'final-introduction', libelle: 'Finalisation de l’introduction'}
  , {id:'final-personnages', libelle:'Finalisation chapitre personnages'}
  , {id:'final-themes', libelle:'Finalisation chapitre thèmes'}
  , {id:'final-lecon-tiree', libelle:'Finalisation de la Leçon tirée du film'}
  , {id:'final-conclusion', libelle: 'Finalisation de la conclusion'}

  , {type:'separator'}

  , {id:'building-script', libelle:'Établissement du script d’assemblage'}
  , {id:'full-relecture', libelle:'Relecture complète'}
  , {id:'full-correction', libelle:'Correction complète du document'}

  , {type:'separator'}

  , {id: 'final-cover', libelle: 'Finalisation de la couverture'}
  , {id: 'final-ebook', libelle: 'Finalisation des eBooks'}
  , {id: 'publication', libelle:'Publication'}

]//Fin des steps
}

/*
 Une petite vérification pour qu'on trouve bien toutes les étapes
 dans la donnée States qui permet de définir les pourcentages
 d'avancement et qu'elles n'y soient qu'une seule fois.
*/
var errors = []
var stepsForState = {}
for (var pct in FAProtocole.States){
  for (var step of FAProtocole.States[pct]){
    if(undefined === stepsForState[step]){
      stepsForState[step] = 0
    } else {
      errors.push(`L'étape '${step}' est définie 2 fois dans FAProtocole.States`)
    }
  }
}
for(var dstep of FAProtocole.DATA.steps){
  if(dstep.type === 'separator') continue
  if(undefined === stepsForState[dstep.id]){
    errors.push(`L'étape '${dstep.id}' n'est pas définie dans FAProtocole.States.`)
  }
}

if(errors.length){
  console.error("Des erreurs ont été trouvées dans la définition des étapes du protocole pour l'estimation de l'avancée de l'analyse.")
  console.error(errors)
}
