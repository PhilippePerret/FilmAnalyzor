'use strict'

module.exports = function(){
  let explanation = `
Par respect pour le travail artistique effectué par les auteurs du film, les
commentaires émis dans ce livre sur les dialogues, leur contenu comme leur interprétation,
sont établis sur la base
de la version originale du film, sous-titrée, toute version adaptée à une
autre langue étant incapables, pour des raisons évidentes de temps et de
compétence, de correspondre aux choix des primos intervenants.
  `
  let ajout = `
Il est de toute façon fortement recommandé de visionner une œuvre quelle qu'elle soit
dans sa langue originale, les adaptations dénaturant souvent, pour ne pas dire toujours,
et ce de façon considérable l'œuvre originale.
  `

  return DCreate(DIV,{class:'note-version-originale', append:[
    DCreate(DIV, {inner: explanation.trim()})
  , DCreate(DIV, {inner: ajout.trim()})
  ]})
}
