'use strict'

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

  building_script:  {id:9, hname: 'Script d’assemblage', format:'md', type:'data', accelerator:'CmdOrCtrl+Shift+X'}

, separatorInfos: 'separator'

, infos:            {id:20, hname: 'Infos film et analyse', format: 'yaml', type:'data', dataeditor: true, menu:false}

, separator2: 'separator'

, variables:        {id:30, hname: 'Variables',  format: 'yaml', type:'data', dataeditor: true}
, diminutifs:       {id:31, hname: 'Diminutifs', format:'yaml', type:'data'}
, snippets:         {id:32, hname: 'Snippets',   format:'yaml', type:'data'}

, separator3: 'separator'

, dpersonnages:     {id:11, hname: 'Personnages', format:'yaml', type:'data', dataeditor: true}
, dbrins:           {id:12, hname: 'Brins', format:'yaml', type:'data', dataeditor: true}
, fondamentales:    {id:13, hname: 'Fondamentales', format: 'yaml', type:'data', dataeditor: true}
, fondamentales_alt:{id:14, hname: 'Fondamentales (Alt)', format: 'yaml', type:'data', dataeditor: true}
, recompenses:      {id:15, hname: 'Récompenses (data)', format: 'yaml', type:'data'}

, separator1: 'separator'

, introduction:     {id: 1, hname: 'Introduction', type: 'real'}
, synopsis:         {id: 2, hname: 'Synopsis', type: 'real'}
, au_fil_du_film:   {id: 3, hname: 'Commentaires au fil du film', type: 'real'}
, personnages:      {id: 4, hname: 'Les personnages', type: 'real'}
, themes:           {id: 5, hname: 'Les thèmes', type: 'real'}
, comments_stats:   {id:10, hname: 'Commentaires sur stats', type:'real'}
, lecon_tiree:      {id: 6, hname: 'La leçon tirée du film', type: 'real'}
, conclusion:       {id: 7, hname: 'Conclusion', type: 'real'}
, annexes:          {id: 8, hname: 'Annexes', type: 'real'}

, custom:           {hname: 'Personnalisé', type:'real', menu: false}
, system:           {hname: 'Système', type: 'data', menu: false, abs:true}

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

// On va ajouter en clé les id des documents qui en ont
for (var dimDoc in DATA_DOCUMENTS) {
  if ( 'undefined' !== typeof DATA_DOCUMENTS[dimDoc].id /* NE PAS UTILISER isDefined */ ) {
    DATA_DOCUMENTS[DATA_DOCUMENTS[dimDoc].id] = Object.assign({}, DATA_DOCUMENTS[dimDoc], {dim: dimDoc, menu:false})
  }
}

// Pour les menus
module.exports = DATA_DOCUMENTS
