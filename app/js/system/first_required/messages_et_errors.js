'use strict'


// TODO Peut-être les mettre dans des fichier JSON à requérir, en fonction de
// la langue
const ERRORS = {

  "--- GÉNÉRAL ---":""
, "too-much-tries": "Trop de tentatives de chargement. Un composant empêche le chargement. J’interromps la procédure."
, "all-componants-required": "Erreur Fatale : tous les composants sont requis, pour charger l'application."

, "--- INTERFACE ---":""
, "ui-init-only-once": "On ne doit initier l'interface qu'une seule fois…"
, "unknown-front-fwindow-cant-close":"Je ne sais pas ce qu'est la fenêtre au premier plan, je ne peux donc pas la fermer."

, "--- KEYWINDOW ---":""
, "kwindow-func-after-choose-required": "La fonction à appeler après le choix d'un item est absolument requise et doit être définies dans la propriété `onChoose`."
, "kwindow-no-remove-function": "Aucune fonction de destruction n'est défini pour cette liste. Définir la méthode `onRemove` dans les données du second argument le cas échéant."

, "--- ANALYSE ---":""
, "analyse-locked-no-save": "L'analyse est verrouillée, impossible de la modifier."
, "invalid-folder": "Le dossier \"%{fpath}\" n’est pas un dossier d’analyse valide."
, "already-analyse-folder": "Ce dossier est déjà un dossier d'analyse ! Utiliser le menu « Ouvrir… » pour l'ouvrir."

, "--- FILM ---":""
, "export-infos-film-not-defined":"Les informations sur le film ne sont pas définis, je ne peux pas les inscrire. Il faudra absolument le faire pour connaitre le film et pouvoir régler la vidéo."

, "--- TIME MAP ---":""
, "timemap-unknown-second-cant-add-element": "L'élément %{e} ne peut être ajouté à la TimeMap à la seconde %{s}, car cette seconde n'existe pas…"

, "--- DOCUMENTS ---":""
, "id-or-path-required-for-doc": "Impossible d'instancier un document sans ID ou PATH."
, "ask-for-save-document-modified": "Le document courant, de type « %{type} », a été modifié. Voulez-vous enregistrer les changements ou les ignorer ?"
, "new-custom-document-created": "Document créé. Sa première ligne définit son titre."
, "same-document-no-association": "Un document ne peut pas être associé avec lui-même, désolé."
, "no-association-event-in-doc": "Pour lier un event à un document, il faut le glisser dans son texte."
, "docpath-unfound": "Le path \"%{path}\" est introuvable. Je ne peux pas éditer ce document."

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
, "scene-too-close": "Une scène se trouve à moins de 2 secondes. Impossible d'en créer une autre si proche…"

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
, "explaination-cur-image":"Si cette case est cochée, l'event est lié à l'image de son temps courant, c'est-à-dire que cette image sera affichée en regard de l'affichage de l'event.\n\nOn pourra définir une légende, une taille et une position en éditant l'image depuis le listing des images."
, "stt-id-structurel-required":"L'ID structurel est indispensable et doit être choisi avec soin."
, "stt-index-pfa-required":"L'index du Paradigme de Field Augmenté est requis."
, "stt-noeud-already-exists":"Il existe déjà un nœud structurel « %{name} » défini à %{at} (%{link})"
, "event-modified-cant-close-form": "L'event a été modifié mais pas enregistré. Pour fermer la fenêtre et abandonner les changements, cliquez sur le bouton à la souris. Sinon, faites CMD-S pour enregistrer et fermer."

, "--- FLYING WINDOW ---":""
, "fwindow-required-owner": "Pour instancier une flying-window (FWindow), le propriétaire est requis en premier argument."
, "fwindow-required-data": "Pour instancier une Flying-Window (FWindow), il faut deux arguments : le propriétaire et les data."
, "fwindow-required-container": "Pour instancier une Flying-window (FWindow), il faut fournir son container dans les data (l'élément DOM jQuery qui la contiendra)."
, "fwindow-invalid-container": "Le container pour placer la flying-window est invalide (introuvable)"
, "fwindow-contents-required": "Pour instancier une flying-window, il faut fournir le contenu HTML (noeud principal). On peut le faire soit par les data (propriété `contents`) soit en définissant `FWcontents` dans le propriétaire."
, "fwindow-owner-has-build-function": "Le propriétaire d'une flying-window doit définir la méthode `build` qui doit construire le contenu de la fenêtre volante."
, "fwindow-can-check-overlap": "Bizarrement, la flying-window %{id} est introuvable dans le DOM. Impossible de checker le chevauchement avec une autre fenêtre."

, "--- TEXTES ---": ""
, "notify-missed-variable": "La variable “{{%{var}}}” est inconnue. Il faut la définir dans le documents “Documents > Informations/variables” en ajoutant la ligne `%{var}: Valeur` (code YAML)."

, "--- DATA ÉDITOR ---":""
, "deditor-data-required": "Les données d'édition sont requises pour éditer un élément de l'analyse (`DataEditorData`)."
, "deditor-title-required": "La propriété `title` définissant le titre de la fenêtre est requise."
, "deditor-mainclass-required": "La classe principale de l'objet à éditer (`mainClass`) est absolument requise."
, "deditor-titleProp-required": "La propriété `titleProp` doit définir quelle propriété utiliser comme titre (pour le menu des éléments, notamment)."
, "deditor-get-method-required": "La méthode `%{classe}::get` doit absolument exister, qui retourne l'instance de l'élément possédant l'id de la valeur envoyée en argument."
, "deditor-onsave-required": "La méthode `%{classe}.dataEditor.onSave` est requise pour savoir quoi faire à l'enregistrement."
, "deditor-onremove-required": "La méthode `%{classe}.dataEditor.onRemove` est requise pour savoir quoi faire à la destruction de l'élément."
, "deditor-items-required": "La liste des items (`items`) est requise, même si elle est vide."
, "deditor-type-required": "Le type de l'élément à éditer est requis. À définir dans `%{classe}.dataEditor.type`)."
, "deditor-items-is-array": "La liste des éléments (`items`) doit être un Array."
, "deditor-must-have-prop-dataEditor": "La classe %{classe} devrait avoir une propriété objet `dataEditor` (qui définira tout)."
, "deditor-fields-undefined": "`%{classe}.dataEditor.dataFields` doit définir les champs permettant d'éditer un élément."
, "deditor-function-required": "La classe %{classe} devrait définir la fonction `%{function}()`?"

, "--- FA LISTING ---":""
, "falist-data-required": "REQUIS : %{classe}.DataFAListing\n\nLa classe propriétaire doit définir la propriété `DataFAListing`."
, "falist-items-required": "`%{classe}.DataFAListing` doit impérativement définir la liste array `items` contenant les instances à afficher."
, "falist-aslistitem-required": "`%{classe}.DataFAListing` doit impérativement définir la méthode `asListItem()`."
, "falist-aslistitem-must-be-function": "`%{classe}.DataFAListing.asListItem` doit être une fonction."
, "falist-aslistitem-bad-return": "asListItem(item) doit retourner le LI de l'item pour le listing."
, "faliste-edit-function-required": "REQUIS : %{classe}::edit(item_id)\n\nPour l'édition, la classe %{classe} doit impérativement définir la méthode `edit` qui reçoit en premier argument l'id de l'item."
, "faliste-owner-save-required": "REQUIS : %{classe}::save(item_id)\n\nLa méthode `save` doit exister, qui permettra de sauver les associations, notamment."
, "faliste-destroy-fct-require": "REQUIS : %{classe}::destroy(item_id)\n\nPour être destructible, la classe de l'item doit répondre à la méthode `destroy` qui recevra en premier et seul argument l'identifiant de l'item."
, "confirm-destroy-brin": "Voulez-vous vraiment détruire à tout jamais le %{ref} ?"

, "--- IMAGES ---":""
, "explication-images-listing": "Pour ajouter des images, se placer à l'endroit voulu dans le film et utiliser le menu « Vidéo > Prendre l'image courante »."
, "confirm-current-image":"L'image courante a été figée avec succès ! Pour l'insérer, glisser son icône depuis le reader."
, "unfound-current-image":"Bizarrement, l'image courante n'a pas été créée. Consulter la console pour en trouver la raison."

, "--- DIVERS ---":""
, "otime-arg-required": "Cette méthode requiert un argument temps de type OTime"
, "settime-time-undefined": "Le temps est indéfini (undefined), dans %{method}."

}
const MESSAGES = {
  "--- UI ---":""
, "tit-update-type-list": "Pour actualiser la liste des types"
, "tit-modify-type-list": "Pour modifier la liste des types (ouvrir le fichier des données)"

, "--- TEXTES ---":""
, "confirm-abandon-modif-text":"Le texte original a été modifié. Voulez-vous vraiment abandonner les changements ?"

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

module.exports = {
  T:T, ERRORS:ERRORS, MESSAGES:MESSAGES
}
