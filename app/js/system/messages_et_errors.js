'use strict'


// TODO Peut-être les mettre dans des fichier JSON à requérir, en fonction de
// la langue
const ERRORS = {
  "--- ANALYSE ---":""
, "analyse-locked-no-save": "L'analyse est verrouillée, impossible de la modifier."
, "invalid-folder": "Le dossier \"%{fpath}\" n’est pas un dossier d’analyse valide."
, "already-analyse-folder": "Ce dossier est déjà un dossier d'analyse ! Utiliser le menu « Ouvrir… » pour l'ouvrir."
, "--- DOCUMENTS ---":""
, "ask-for-save-document-modified": "Le document courant, de type « %{type} », a été modifié. Voulez-vous enregistrer les changements ou les ignorer ?"
, "new-custom-document-created": "Document créé. Sa première ligne définit son titre."
, "same-document-no-association": "Un document ne peut pas être associé avec lui-même, désolé."
, "no-association-event-in-doc": "Pour lier un event à un document, il faut le glisser dans son texte."
, "--- FILES ---": ""
, "code-to-save-is-empty":"Le code à sauver est vide, malheureusement."
, "error-while-saving-file": "Une erreur s'est produite à l'enregistrement du fichier. Il ne contient pas le bon nombre d'octets.<br>%{fpath}."
, "temp-file-empty-stop-save": "Le code du fichier temporaire est malheureusement vide. Je dois interrompre la procédure de sauvegarde du fichier.<br>%{fpath}"
, "temps-file-unfound": "Le fichier temporaire est introuvable. Je dois interrompre la procédure d'enregistrement.<br>%{fpath}"
, "code-to-save-is-undefined":"Le code à sauver est indéfini (undefined), c'est impossible !"
, "code-to-save-is-null":"Le code à sauver vaut `null`, c'est impossible !"
, "code-to-save-not-ok": "Le code à enregistrer est invalide : %{raison}.\n\nCorrigez-le pour pouvoir l'enregistrer."
, "--- VIDÉO ---": ""
, "video-path-required": "Il faut indiquer la vidéo du film, en actionnant le menu « Analyse > Choisir la vidéo du film »."
, "video-required": "La vidéo du film est absolument requise pour analyser le film…<br>Astuce : utilisez une autre vidéo si vous voulez travailler « à blanc »."
, "---- SCÈNES ---":""
, "scene-to-close": "Une scène se trouve à moins de 2 secondes. Impossible d'en créer une autre si proche…"
, "---- EVENTS ----":""
, "same-event-no-association": "Désolé, mais un event ne peut être associé avec lui-même."
, "data-type-required-for-association": "L'élément droppé devrait définir son data-type. Cet attribut n'est pas défini."
, "unknown-associated-type": "Impossible d'associer l'élément à un élément de type inconnu “%{type}”."
, "proc-type-required": "Le type du procédé est requis."
, "proc-install-required": "L'installation du procédé est requis."
, "proc-description-required": "La description du procédé est requis."
, "parent-is-required": "Un parent (de type : %{ptypes}) est requis pour cet event."
, "good-parent-required": "Le parent défini n'est pas du bon type. Il est de type “%{bad}” alors que le ou les types acceptés sont : %{ptypes}."
, "event-not-itself-parent": "Un event ne peut pas être son propre parent, voyons…"
, "proc-setup-required":"L'installation d'un procédé est toujours requise."
, "idee-type-required":"Le type de l'idée est requis."
, "idee-description-required":"La description de l'idée est requise (précise si possible)"
, "idee-setup-required":"L'installation de l'idée est requise"
, "no-event-with-filter":"Aucun event n'a été trouvé avec le filtre demandé."
, "--- FLYING WINDOW ---":""
, "fwindow-required-owner": "Pour instancier une flying-window (FWindow), le propriétaire est requis en premier argument."
, "fwindow-required-data": "Pour instancier une Flying-Window (FWindow), il faut deux arguments : le propriétaire et les data."
, "fwindow-required-container": "Pour instancier une Flying-window (FWindow), il faut fournir son container dans les data (l'élément DOM jQuery qui la contiendra)."
, "fwindow-invalid-container": "Le container pour placer la flying-window est invalide (introuvable)"
, "fwindow-contents-required": "Pour instancier une flying-window, il faut fournir le contenu HTML (noeud principal). On peut le faire soit par les data (propriété `contents`) soit en définissant `FWcontents` dans le propriétaire."
, "fwindow-owner-has-build-function": "Le propriétaire d'une flying-window doit définir la méthode `build` qui doit construire le contenu de la fenêtre volante."
, "--- TEXTES ---": ""
, "notify-missed-variable": "La variable “{{%{var}}}” est inconnue. Il faut la définir dans le documents “Documents > Informations/variables” en ajoutant la ligne `%{var}: Valeur` (code YAML)."
, "--- DIVERS ---":""
, "otime-arg-required": "Cette méthode requiert un argument temps de type OTime"
}
const MESSAGES = {
  "--- UI ---":""
, "tit-update-type-list": "Pour actualiser la liste des types"
, "tit-modify-type-list": "Pour modifier la liste des types (ouvrir le fichier des données)"

, "--- messages ANALYSE ---":""
, "conf-created-analyse": "Nouvelle analyse créée avec succès."
, "loading-analyse": "Chargement de l'analyse… "
, "same-start-time": "Le temps de départ n'a pas changé, rien à faire."
, "confirm-on-change-start-time": "Si le temps de départ est modifié, il faut corriger le temps de tous les éléments existants. Je le ferai dès confirmation."
, "confirm-start-time": "Le temps %{time} correspond au début réel du film."
, "--- messages VIDÉO ---":""
, "no-stop-point": "Aucun point d'arrêt n'est encore défini. Déplacez-vous dans la vidéo pour les définir (à chaque lancement de la vidéo)."
, "--- messages SCÈNES ---":""
, "confirm-scene-close": "Une scène se trouve à %{ecart} secondes. Voulez-vous vraiment créer cette scène ?"
, "--- messages EVENTS ---":""
, "confirm-destroy-event": "Êtes-vous certain de vouloir détruire à tout jamais cet event ?…"
, "---- DOCUMENT ----":""
, "no-association-between-docs": "Pour le moment, l'association entre documents n'est pas possible. Glisser le document dans le texte pour créer cette association efficacement."
, "confirm-content-much-shorter": "Le document \"%{doc_name}\" est plus de 20% plus court que sa version précédente… Confirmez-vous quand même cet enregistrement ?"
}

/**
 * Gestion des "translation"
 * Les messages sont définis dans ERRORS et MESSAGES, on envoie à cette
 * méthode la clé +lid+ (pour "Locale Id"), avec éventuellement la table
 * des remplacement +lrep+ (pour "Locales Replacement") et la méthode retourne
 * le texte.
 *
 * Les variables s'écrivent `%{<variable name>}` dans le texte (comme les
 * template ruby).
 */
const T = function(lid, lrep){
  var str = ERRORS[lid] || MESSAGES[lid]
  if(undefined===str){
    throw(`L'identifiant de message/error "${lid}" est inconnu de nos services…`)
  }
  if(lrep){
    for(var k in lrep){
      var reg = new RegExp(`%\{${k}\}`, 'g')
      // console.log("str:",str)
      str = str.replace(reg, lrep[k])
    }
  }
  return str
}
