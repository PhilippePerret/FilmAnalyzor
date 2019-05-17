'use strict'
/**
 * Ce module du FAWriter est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

/**
 * Données des documents
 * ---------------------
 *
 *  Note : le +format+ doit correspondre impérativement à l'extension du
 *  fichier et du fichier modèle.
 *
 * Le `type` va définir s'il s'agit d'un document contenant des données, comme
 * les informations sur le film ou les fondamentales (type 'data'), OU alors
 * un « vrai » document, en markdown, qui sera affiché dans l'analyse.
 *
 * Les deux types doivent être séparés car ils seront séparés dans les
 * menus.
 */
const DATA_DOCUMENTS = {

  building_script:  {hname: 'Script d’assemblage', format:'md', type:'data'}

, separatorInfos: 'separator'

, infos:            {hname: 'Infos film \& analyse', format: 'yaml', type:'data', dataeditor: true}

, separator2: 'separator'

, variables:        {hname: 'Variables', format: 'yaml', type:'data', dataeditor: true}
, diminutifs:       {hname: 'Diminutifs', format:'yaml', type:'data'}
, snippets:         {hname: 'Snippets', format:'yaml', type:'data'}

, separator3: 'separator'

, dpersonnages:     {hname: 'Personnages', format:'yaml', type:'data', dataeditor: true}
, dbrins:           {hname: 'Brins', format:'yaml', type:'data', dataeditor: true}
, fondamentales:    {hname: 'Fondamentales', format: 'yaml', type:'data', dataeditor: true}
, fondamentales_alt:{hname: 'Fondamentales (Alt)', format: 'yaml', type:'data', dataeditor: true}
, recompenses:      {hname: 'Récompenses (data)', format: 'yaml', type:'data'}

, separator1: 'separator'

, introduction:     {hname: 'Introduction', type: 'real'}
, synopsis:         {hname: 'Synopsis', type: 'real'}
, au_fil_du_film:   {hname: 'Commentaires au fil du film', type: 'real'}
, personnages:      {hname: 'Les personnages', type: 'real'}
, themes:           {hname: 'Les thèmes', type: 'real'}
, comments_stats:   {hname: 'Commentaires sur stats', type:'real'}
, lecon_tiree:      {hname: 'La leçon tirée du film', type: 'real'}
, conclusion:       {hname: 'Conclusion', type: 'real'}
, annexes:          {hname: 'Annexes', type: 'real'}

, custom:           {hname: 'Personnalisé', type:'real', menu: false}
, any:              {hname: 'Quelconque', type: 'data', menu: false, abs:true}

// --- Pour les documents des données absolues ---
// La clé doit être le nom du fichier dans ./js/data/
, data_proc:        {hname: 'Date absolues des procédés', type:'data', abs:true, menu:false}
, data_note:        {hname: 'Date absolues notes', type:'data', abs:true, menu:false}
, data_info:        {hname: 'Date absolues Infos', type:'data', abs:true, menu:false}
, data_action:      {hname: 'Date absolues Actions', type:'data', abs:true, menu:false}
, data_dialog:      {hname: 'Date absolues Dialogues', type:'data', abs:true, menu:false}
, data_dyna:        {hname: 'Date absolues Éléments dynamique', type:'data', abs:true, menu:false}
, data_scene:       {hname: 'Date absolues Scènes', type:'data', abs:true, menu:false}
, data_idee:        {hname: 'Date absolues Idées', type:'data', abs:true, menu:false}

}

// Pour les menus
module.exports = DATA_DOCUMENTS
