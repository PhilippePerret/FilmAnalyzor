'use strict'
/**
  Données minimales qui peuvent être chargées lorsqu'on ne charge pas
  tout le module.
**/
window.DATA_STT_NODES = {
// cZone définit le calcul de la zone où le noeud peut se trouver
// Noter qu'on peut indiquer "<identifiant>" pour ne pas préciser un
// temps mais préciser le noeud qui servira de fin ou de début
// Dans ces cas-là, une troisième donnée peut être fournie, dans le cas
// où le noeud ne serait pas défini.
/**
*
* Détail des propriétés
* ----------------------
*   Note : NRC signifie « Noeud Relatif Correspondant »

    requirity   Pour le calcul de l'état d'avancement et la pertinence de
                l'export, la valeur de nécessité des noeuds. De 1 à 10

*   tolerance   Cette propriété définit la différence qu'il peut y
*               avoir, au niveau du positionnement temporel, entre le
*               noeud absolu et le NRC.
*               Cette propriété est obligatoire.
*               Les valeurs possibles sont les suivants :
  e   Féminin ('e') ou masculin ('')
*               'none'      Le NRC doit se trouver exactement dans la
*                           zone absolue définie.
*               'before'    Le NRC peut se trouver avant la zone définie
*               'after'     Le NRC peut terminer après la zone absolue
*               '24ieme'    Le NRC peut se trouver à plus ou moins le
*                           24e de temps de distance, au début et/ou à
*                           la fin de la zone absolue.
*
**/
  EXPO:   {hname: 'EXPOSITION', e:'e', shortHname: 'EXPO.', cZone:'[0,quart]', zone: null, main: true, next: 'DEV1', tolerance: '24ieme', requirity:10}
, preamb: {hname: 'Préambule', e:'',              dim: 'PR', shortHname: 'Préamb.', cZone:'[0,iem24]', next:'incPer', last: 'desine', tolerance: 'after', requirity:5}
, incPer: {hname: 'Incident perburbateur', e:'',  dim: 'IP', shortHname: 'Inc.Pert.', cZone:'[iem24,douzi]', next:'incDec', tolerance: 'before', requirity:7}
, incDec: {hname: 'Incident déclencheur', e:'',   dim: 'ID', shortHname: 'Inc.Déc.', cZone:'[douzi,quart-douzi]', next:'zone_r', tolerance: 'before', requirity:10}
, zone_r: {hname: 'Zone de refus', e:'e',          dim: 'ZR', shortHname: 'Zone R.', cZone:'[quart-douzi,quart-iem24]', next:'pivot1', tolerance: 'before', requirity:4}
, pivot1: {hname: 'Pivot 1', e:'',                dim: 'P1', shortHname: 'Pvt 1', cZone: '[quart-iem24,quart]', next:'act1d1', tolerance: 'none', requirity:9}
, DEV1:   {hname: 'DÉVELOPPEMENT (1ère partie)', e:'', shortHname: 'DÉV. Part 1', cZone:'[quart,moiti]', main: true, next: 'DEV2', tolerance: '24ieme', requirity:10}
, act1d1: {hname: '1ère action', e:'e',            dim: 'A1', shortHname: '1ère action', cZone:'[quart,quart+iem24]', next:'tiers1', tolerance:'none', requirity:4}
, tiers1: {hname: 'Premier Tiers', e:'',          dim: 'T1', shortHname: '1/3', cZone:'[tiers-iem24,tiers+iem24]', next: 'cledev', tolerance:'none', requirity:3}
, cledev: {hname: 'Clé de voûte', e:'e',           dim: 'CV', shortHname: 'C.d.V.', cZone:'[moiti-iem24,moiti+iem24]', next: 'act1d2', tolerance:'none', requirity:9}
, DEV2:   {hname: 'DÉVELOPPEMENT (2nde partie)', e:'', shortHname: 'DÉV. Part 2', cZone:'[moiti,tresQ]', main: true, next: 'DNOU', tolerance: '24ieme', requirity:10}
, act1d2: {hname: '1ère action post-CdV', e:'e',   dim: 'A2', shortHname: 'Action post-CdV', cZone:'[moiti+iem24,moiti+douzi]', next: 'tiers2', tolerance:'before', requirity:3}
, tiers2: {hname: 'Second Tiers', e:'',           dim: 'T2', shortHname: '2/3', cZone:'[deuxT-iem24,deuxT+iem24]', next: 'pivot2', tolerance:'none', requirity:3}
, pivot2: {hname: 'Pivot 2', e:'',                dim: 'P2', shortHname: 'Pvt 2', cZone:'[tresQ-iem24,tresQ]', next: 'act1d3', tolerance: 'none', requirity:9}
, DNOU:   {hname: 'DÉNOUEMENT', e:'', shortHname: 'DÉNOUE.', cZone:'[tresQ,duree]', main: true, next: null, first: 'EXPO', tolerance: '24ieme', requirity:10}
, act1d3: {hname: '1ère action dénouante', e:'e',  dim: 'A3', shortHname: 'Action dénoue.', cZone:'[tresQ,tresQ+iem24]', next: 'crisis', tolerance:'none', requirity:2}
, crisis: {hname: 'Crise', e:'e',                  dim: 'CR', shortHname: 'Crise', cZone:'[tresQ+iem24,duree-huiti]', next: 'climax', tolerance:'before', requirity:7}
, climax: {hname: 'Climax', e:'',                 dim: 'CX', shortHname: 'Climax', cZone:'[duree-huiti,duree-iem24]', next: 'desine', tolerance:'after', requirity:10}
, desine: {hname: 'Désinence', e:'e',              dim: 'DS', shortHname:'Désin.', cZone:'[duree-iem24,duree]', next: null, first: 'preamb', tolerance:'none', requirity:4}
}

window.MAIN_STT_NODES = ['incDec', 'pivot1', 'cledev', 'pivot2', 'climax']
window.SUB_STTNODES = ['preamb', 'incPer', 'zone_r', 'act1d1', 'tiers1', 'act1d2', 'tiers2', 'act1d3', 'crisis', 'desine']

// module.exports = {
//   MAIN_STT_NODES: ['incDec', 'pivot1', 'cledev', 'pivot2', 'climax']
// , SUB_STTNODES: ['preamb', 'incPer', 'zone_r', 'act1d1', 'tiers1', 'act1d2', 'tiers2', 'act1d3', 'crisis', 'desine']
// , DATA_STT_NODES: DATA_STT_NODES
// }
