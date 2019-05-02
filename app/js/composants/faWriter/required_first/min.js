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

  infos:            {hname: 'Informations/variables', format: 'yaml', type:'data'}
, building_script:  {hname: 'Script d’assemblage', format:'md', type:'data'}

, separator2: 'separator'

, diminutifs:       {hname: 'Diminutifs', format:'yaml', type:'data'}
, snippets:         {hname: 'Snippets', format:'yaml', type:'data'}

, separator3: 'separator'

, dpersonnages:     {hname: 'Personnages (data)', format:'yaml', type:'data'}
, dbrins:           {hname: 'Brins (data)', format:'yaml', type:'data'}
, fondamentales:    {hname: 'Fondamentales (data)', format: 'yaml', type:'data'}
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

, customdoc:        {hname: 'Personnalisé', type:'real', menu: false}

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
