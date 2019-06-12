# Film-Analyzer
# Manuel de développement

<!-- Dernier numéro de note N0004 -->

* [Point d'entrée](#point_dentree)
* [Principes généraux](#principes_generaux)
  * [Fonctionnalité « One Key Pressed »](#one_key_pressed_feature)
  * [Messages d'attente](#waiting_messages)
* [Essais/travail du code](#travail_code_sandbox_run)
* [Chargement de dossier de modules](#loading_modules_folders)
  * [Chargement de dossiers JS au lancement de l'application](#load_folders_at_launching)
  * [Chargement d'outils particuliers (tools)](#load_tools)
* [Création/modification des events](#creation_event)
  * [Mise en forme des events](#event_mise_en_forme)
  * [Bouton Play/Stop des events](#bouton_playstop_event)
  * [Actualisation automatique des horloges, time et numéro](#autoupdate_horloge_time_numera)
  * [Actualisation automatique du numéro de scène courante](#autoupdate_scene_courante)
  * [Enregistrement des events](#saving_events)
* [Travail avec les events](#working_with_events)
  * [Affichage de la liste des events](#display_falisting_events)
  * [Filtrage des events](#filtering_events)
  * [Association des events](#associations_elements)
* [Autres données de l'analyse](#analyse_autres_donnees)
  * [FAElements, éléments propres de l'analyse (Personnages, Brins, etc.)](#elements_analyse)
  * [Récupérer une instance par son type et son id](#get_instance_with_type_and_id)
  * [FAListing, listing des éléments](#falisting_elements)
  * [DataEditor, l'éditeur de données](#data_editor)
  * [Les Keys-Windows, choix d'élément par les touches](#les_keyswindows)
  * [Actualisation automatique des éléments affichés lors des modifications](#autoupdate_after_edit)
  * [Association des éléments](#associations_elements)
    * [Helpers de drag](#assocations_helper_drag)
* [Vidéo](#la_video)
  * [Actualisation des informations vidéo](#update_infos_video)
* [Ajout de préférences globales](#add_global_prefs)
  * [Utilisation des préférences globales](#use_global_prefs})
* [Ajout de préférence analyse](#add_analyse_pref)
* [Horloges et durées](#temporal_fields)
* [UI / Aspect visuel](#visual_aspect)
  * [Boutons de fermeture](#boutons_close)
  * [Boutons expand/collapse](#boutons_toggle_next)
  * [Boutons d'aide](#boutons_daide)
  * [Élément toujours visible dans container scrollable](#rend_always_visible)
* [Documents de l'analyse](#documents_analyse)
  * [Quatre types de documents](#les_types_de_documents)
  * [Édition d'un fichier quelconque](#edit_any_file)
  * [Sauvegarde protégée des documents (IOFile)](#saving_protected)
* [Assemblage de l'analyse](#assemblage_analyse)
  * [Script d'assemblage](#script_assemblage_analyse)
  * [Messages de suivi](#assemblage_messages_suivis)
* [Test de la l'application](#test_application)
* [Les « Hand-Tests », test manuels de l'application](#tests_manuels)
  * [Lancement des hand-tests](#running_hand_tests)
    * [Astuce pour toujours commencer par le test en cours](#tip_start_with_current_test)
    * [Passage au test suivant](#next_hand_test)
    * [Passage au fichier suivant](#next_file_hand_tests)
    * [Interrompre les tests](#interrompre_hand_tests)
  * [Composition des étapes des hand-tests](#compositing_hand_tests_steps)
  * [Vérification dans le synopsis (check)](#checks_in_synopsis)
  * [Implémentation des hand-tests](#developping_hand_tests)
    * [Implémentation des checks](#implementer_checks)
    * [Définir les *éléments numérisables* de l'application](#define_numerisable_elements)
    * [Commandes interprétables](#interpretable_commands)
    * [Définir les checks dynamiques](#define_dynamique_checks)
    * [Toutes les commandes de test](#all_commands_of_the_tests)
* [Notes/explication](#notes_et_explications)

<!-- Définition des liens courants -->
[script d'assemblage]: #script_assemblage_analyse


## Point d'entrée {#point_dentree}

Le point d'entrée du main process se fait par `./main.js`

Le point d'entrée de l'analyser (`analyser.html`) se fait par `./app/js/lecteur/on_ready.js`

On fabrique une instance `FAnalyse`, qui est l'analyse courante. Normalement, pour le moment, c'est un singleton, mais on pourra imaginer certaines parties du programme qui travaillent avec plusieurs analyses en même temps.

Cette instance `FAnalyse` construit un « controleur vidéo » (instance `VideoController`) et un « lecteur d'analyse » (instance `FAReader`)

---------------------------------------------------------------------

## Principes généraux {#principes_generaux}

### Fonctionnalité « One Key Pressed » {#one_key_pressed_feature}

Permet de régler des choses en tenant une touche appuyée. Par exemple, quand on tient la touche « v » appuyée, on peut régler des choses concernant la vidéo. Avec les flèches haut/bas, on peut régler sa taille (OBSOLÈTE avec la nouvelle interface Banc Timeline).

Cette fonctionnalité est principalement définies dans le fichier `app/js/composants/ui/ui/require_then/shortcuts.js` (le nom est unique pour une recherche rapide : « app shortcuts »). La touche pressée est captée dans `onKey_DOWN_OUT_TextField` et mise dans la propriété `currentKeyDown` de l'objet. Si on la relève tout de suite, `currentKeyDown` est effacée dans `onKey_UP_OUT_TextField`. Si, en revanche, d'autres touches sont pressées avant que la touche ne soit relevée, on peut offrir des traitements.

On peut définir dans la propriété `methodOnKeyPressedUp` de l'objet `UI` la méthode qui doit être appelée quand on relève la touche. Cela permet de ne pas multiplier un traitement coûteux à répétition. Par exemple, sans cette méthode, avec la touche « v » appuyée, on changerait la taille de la vidéo **et on l'enregistrerait dans le fichier `options.json`** chaque fois que la touche flèche haut ou bas serait appuyée. Puisque c'est une touche « à répétition » (i.e. qu'on peut maintenir pour répéter la touche), l'enregistrement serait appelé de façon intensive. Au lieu de ça, la taille de la vidéo n'est enregistrée que lorsqu'on relève la touche.


### Messages d'attente {#waiting_messages}

Pour afficher un message d'attente, utiliser :

```javascript

UI.startWait('<message>')

```

Pour interrompre le message d'attene, utiliser :

```javascript

UI.stopWait()

```

---------------------------------------------------------------------

## Essais/travail du code {#travail_code_sandbox_run}

Pour faciliter le travail, on peut utiliser `Sandbox.run` qui est appelée quand l'application est prête. Dans la méthode `run` de la Sandbox — qui se trouve dans le fichier `./js/system.sandbox.js` — on définit le code à ajouter.

Par exemple, quand je travaillais sur le MiniWriter, plutôt que de chaque fois lancer l'application, afficher les events, choisir un event, le mettre en édition, activer l'option « Utiliser le Mini-Writer pour les textes » et cliquer sur le champ contenu du premier event, j'ai utilisé :

```javascript
Sandbox.run = function(){
  FAEvent.edit(0)
  MiniWriter.new(DGet('event-0-content'))
}
```


## Chargement de dossier de modules {#loading_modules_folders}

On peut charger des modules en inscrivant leur balise `<script>` dans le document grâce à la méthode `System.loadJSFolders(mainFolder, subFolders, fn_callback)`.

L'avantage de ce système — contrairement à `require` —, c'est que tout le contenu du code est exposé à l'application. Si une classe `FADocument` est définie, elle sera utilisable partout, à commencer par les modules chargés.

C'est cette formule qu'on utilise par exemple pour charger le *PorteDocuments* qui permet de rédiger les textes.

### Chargement de dossiers JS au lancement de l'application {#load_folders_at_launching}

Grâce au module `system/App.js`, on peut charger des dossiers javascript sans les coder en dur dans le fichier HTML de l'application.

Il suffit de les inscrire dans la constante `AppLoader::REQUIRED_MODULES` et ils sont chargés de façon asynchrone.

## Chargement d'outils particuliers (tools) {#load_tools}

Pour charger un module se trouvant dans le dossier des outils `app/js/tools`, utiliser la méthode `App.loadTool(<affixe>)` avec l'affixe du fichier en argument.

Par exemple, pour charger le module `./app/js/tools/building/fondamentales.js`, utiliser :

```javascript

window.PanelFonds = App.loadTool('building/fondamentales')

```

## Création/modification des events {#creation_event}

Les `events` (scène, info, note, qrd, etc.) héritent tous de la classe `FAEvent`.

Ils sont définis dans le dossier `./app/js/common/FAEvents/` où on définit leur sous-classe. Par exemple la classe `FAEscene (extends FAEvent)`.

La propriété de classe `OWN_PROPS` permet de définir les propriétés propres au type d'event. C'est une liste qui contient :

* soit un `String` si la propriété possède le même nom (suffixe d'id) que le champ où elle est éditée,
* soit un `Array` de deux éléments `[propriété, suffixe d'id]` si le champ pour l'éditer n'est pas propre à la propriété.

Par exemple, pour la propriété personnelle `procType` de la classe `FAEproc`, le menu porte le nom `event-<id event>-procType`. Le suffixe est `procType`, on peut donc mettre juste le string `procType` dans `OWN_PROPS`. En revanche, la propriété `setup` (installation du procédé) est édité dans le champ `event-<id>-inputtext1`, donc il faut mettre la valeur `['setup', 'inputtext1']` dans `OWN_PROPS`.

### Exécution d'une opération après la création

Il suffit de créer la méthode d'instance `onCreate` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

### Exécution d'une opération après la modification

Il suffit de créer la méthode d'instance `onModify` dans la classe de l'event. Elle sera automatiquement jouée lors de la modification de l'instance.

## Mise en forme des events {#event_mise_en_forme}

C'est le getter super `div` qui se charge de construire le div qui doit être affiché dans le reader. Il convient de ne pas le surclasser, pour obtenir tous les outils nécessaires à la gestion des events.

En revanche, pour un affichage particulier du contenu, on peut définir le fonction d'instance `formateContenu` qui doit définir ce qui va remplacer le texte `content` dans le div final. Elle doit retourner le contenu à afficher (sans le mettre dans une propriété conservé, ce qui empêcherait l'actualisation — ou la compliquerait).

> Utiliser la méthode `current_analyse.deDim(<formated>)` à la fin de l'opération pour remplacer tous les diminutifs utilisés.

Exemple :

```javascript

  formateContenu(){
    var str
    str = '<mon div avec content>'
    str += '<mon div avec les notes>'
    str += '<mon div avec une autre valeur>'
    // etc.
    str = this.analyse.deDim(str)

    return str
  }
```

### Bouton Play/Stop des events {#bouton_playstop_event}

`BtnPlay` est une classe javascript qui permet de gérer facilement les boutons play/stop des events, c'est-à-dire des boutons qui mettent en route (ou se rendent au temps de) la vidéo et l'arrête à la fin de la durée de l'event.

Une unique instance `BtnPlay` est associée à un event `event.btnPlay` et va gérer tous les boutons play affichés de cet évènement.

Pour l'implémenter, inscrire ce code HTML dans la page, à l'endroit où le bouton doit apparaitre, en réglant l'attribut `size` pour que le bouton ait la taille voulu. Si le bouton doit être à gauche, ajouter la classe `left`, s'il doit être à droite, ajouter `right` (cela permet de gérer l'espace avec les éléments autour) :

```html

  <div id="main-container">

    <button class="btnplay left" size="30"></button>

  </div>

```

Dans le code javascript, ajouter simplement :

```javascript

  BtnPlay.setAndWatch($('#main-container'), <event>)

```

> `#main-container` ne peut pas être le bouton lui-même, il ne serait pas traité.

Tout le reste est géré automatiquement, il n'y a rien à faire.

### Actualisation automatique des horloges, time et numéro {#autoupdate_horloge_time_numera}

> Pour savoir comment fonctionne l'actualisation, voir plutôt [Actualisation des informations vidéo](#update_infos_video).

Afin que les horloges et les times en attribut de balises soient automatiquement modifiés tous en même temps, il suffit de respecter les conventions suivantes :

* Pour les horloges, ajouter la classe CSS `horloge-event` et mettre un attribut `data-id` avec la valeur de l'identifiant de l'event. Par exemple :
    ```html
      <span class="horloge horloge-event" data-id="4">...</span>
    ```
* Pour la valeur du `time` enregistré en attribut (pratique pour certaines opération), il suffit d'ajouter l'attribut `data-id` en parallèle de l'attribut `data-time`. Par exemple :
    ```html
      <div data-time="23.56" data-id="12">...</div>
    ```
* Si l'event est une scène, son numéro doit être indiqué de la manière suivante :
    ```html
      <span class="numero-scene" data-id="23">...</span>
    ```
Si ces conventions sont respectées, l'appel à la méthode `FAEvent#updateInUI` modification automatiquement les valeurs affichées et consignées. Pour ce qui est des scènes, c'est la méthode qui actualise tous les numéros qui se chargera d'actualiser les numéros de scène.

Cf. aussi [Champs temporels](#temporal_fields) pour les champs *horlogeables* et *durationables*.


### Actualisation automatique du numéro de scène courante {#autoupdate_scene_courante}

Pour obtenir une actualisation automatique de la scène courante, comme elle est affichée par exemple à côté des markeurs de parties, il suffit d'utiliser des champs de classe CSS :

```html

<span class="current-scene-number">Scène 12</span>
<span class="current-scene-number-only">12</span>
<span class="current-scene-pitch">Le résumé de la scène</span>

```

### Enregistrement des events {#saving_events}

Les events sont enregistrés dans le fichier `events.json` du dossier de l'analyse. Des backups sont systématiquement faits dans le dossier `.backups`.

Mais les events devenant très nombreux à l'avancée de l'analyse (pouvant dépasser les 2000 items), on procède en parallèle à un enregistrement des seuls events modifiés, ajoutés ou supprimés.

C'est la classe `FAEvent` qui s'en charge, dans sa méthode `saveModifieds`. Ces enregistrements sont faits chaque fois qu'on enregistre la liste de tous les events et ils sont placés dans le dossier `.backups/events` de l'analyse.

## Travail avec les events {#working_with_events}

### Affichage de la liste des events {#display_falisting_events}

Pour le détail de l'utilisation des listes d'*events* en tant qu'analyste, voir le manuel de l'analyste.

Pour ce qui est de l'implémentation, il faut savoir qu'il existe deux moyens différents utilisés pour afficher les *events* :

* les [`FAListing`(s)](#falisting_elements) qui permet d'afficher facilement et rapidement un type particulier,
* les [`eventers`](#filtering_events) qui permettent d'appliquer un filtre et de choisir plusieurs types d'*events* en même temps.

### Filtrage des events {#filtering_events}

On peut travailler avec une liste filtrée des events grâce à la classe `EventsFilter` (définie pour le moment dans le `FAEventer`, donc il faut charger ce composant pour avoir le filtre).

Pour créer un filtre :

```javascript

  let obj  = monObjetPeuImporte
  let monFiltre = {
    eventTypes: ['stt', 'scenes', ...] // sinon tous les types
  , fromTime: 1200  // sinon le début
  , toTime:   12000 // sinon la fin
  , invert:   true  // pour inverser toutes les conditions
  }
  let monF = new EventsFilter(obj, {filter: monFiltre})

```

---------------------------------------------------------------------

## Autres données de l'analyse {#analyse_autres_donnees}

L'analyse contient d'autres données contenues le plus souvent dans des documents au format `YAML`. On trouve pour commencer les données du film, les personnages, les brins, etc.

La plupart de ces données peuvent se définir par le menu `Documents`.

### Éléments de l'analyse {#elements_analyse}

Les éléments propres à l'analyse, dont le nombre est variable, peuvent se définir par héritage de la classe `FAElement`. Cette classe, outre certaines méthodes utiles, apporte toutes les méthodes permettant de gérer les associations avec les autres éléments.

Pour définir un tel élément, il suffit de faire, comme pour les personnages :

```javascript

class FAPersonnage extends FAElement {

constructor(data){
  super(data)
  // ...
}  

}

```

Noter le constructeur qui doit appeler la superclasse avec les données. Toutes ces données seront dispatchées en les mettant dans les propriétés `_<prop>`. Donc la propriété `pseudo` (`data['pseudo']`) renseignera la propriété d'instance `this._pseudo`.


Le nom d'un tel élément doit impérativement :

* commencer par `FA` et être au singulier, comme `FAPersonnage`, `FABrin`.
* définir la propriété `Classe#id` contenant l'identifiant de l'instance,
* définir la propriété `Classe#type` retournant le type de l'instance (par exemple, une instance `FAPersonnage` a le type `personnage`),
* définir la méthode de classe `Classe::get(identifiant)` qui reçoit un identifiant et retourne l'instance correspondante.

Voir dans [Association des éléments](#associations_elements) tout ce qu'on peut faire avec l'élément, en tant qu'élément associable à un autre élément.

### Récupérer une instance par son type et son id {#get_instance_with_type_and_id}

La méthode générique `FAnalyse.instanceOfElement` permet de récupérer n'importe quelle instance d'élément de l'analyse en fournissant en argument un `object` contenant `{type:<type>, id:<identifiant>}`.

```javascript

var inst = current_analyse.instanceOfElement({type:'monType', id:'monID'})

```

Une instance est toujours retournée, que l'élément existe ou pas. S'il n'existe pas, c'est un objet de la classe `FAUnknownElement` qui est retourné.

### FAListing, listing des éléments {#falisting_elements}

La classe `FAListing` permet de faire des listings des éléments des analyses.

Code à insérer pour utiliser les listings :

```javascript

// Par exemple dans un fichier ./app/js/tools/building/listing_element.js

if (NONE === typeof(FAListing)) window.FAListing = require('./js/system/FA_Listing')

// Pour étendre la classe `FAClasse`
FAListing.extend(FAClasse) // ajoute la propriété `listing` (instance de FAListing)

// Pour afficher/masquer le listing
FAClasse.listing.toggle()

```

Pour pouvoir fonctionner, la classe `FAClasse` doit définir :

```javascript

FAClasse.DataFAListing = {
  items: [/* liste des instances d'éléments de la classe (filtrée ou non) */]
, asListItem(item, opts){/* cf. ci-dessous */}

// Propriétés optionnelles
, mainTitle: '/* le titre principal de la fenêtre (par défaut, la classe au pluriel) */'
, editable: true/false  // Si true, un bouton 'edit' est ajouté, permettant
                        // d'éditer l'élément avec un méthode de classe `edit`
                        // qui doit exister et recevoir en premier argument
                        // l'identifiant de l'élément.
, creatable: true/false   // Si true, un '+' est ajouté en haut de liste pour
                          // pouvoir créer un nouvel élément avec le DataEditor
, removable: true/false   // si true, un petit bouton permet de détruire l'élément
                          // Il faut que la classe réponde à la méthode 'destroy'
                          // qui doit recevoir l'identifiant en argument.
, associable: true/false  // Si true, on peut dragguer l'élément sur un autre
                          // et l'élément peut recevoir un autre élément.
, associates: true        // pour afficher les associés (false par défaut)
, statistiques: true      // Pour afficher les statistiques (false par défaut)
, collapsable: true       // Si true, les informations supplémentaires sont
                          // masquables/affichables.
                          // Noter que si collapsable est true, la description
                          // de l'élément, si elle existe, est automatiquement
                          // ajouter.
, collapsed: false        // Si true (défaut) les informations supplémentaires
                          // sont masquées. Sinon, elles sont affichées.
, item_options: {/* options à envoyer à asListItem */}
, only:  '/* identifiant du seul item à montrer */'
, selected: /* alias de only */

}

```

#### Fonction `DataFAListing.asListItem(item, opts)`

Cette fonction doit retourner le LI de l'item `item`, comme `DOMElement`.

Le LI lui-même n'a pas besoin de définir son `id` ou ses autres attributs comme `data-type` ou `data-id` car ils seront automatiquement ajoutés si `associable` est `true` dans les données. Il suffit de définir sa classe si elle est différente du type (qui pourra servir à le mettre en forme précisément dans `faListing.css`) et son contenu :

```javascript

, asListItem(item, opts){
    return DCreate(LI,{class:'maclassedifferente', append:[

      ]})
  }
```

Si `editable` est `true`, un bouton `edit` est automatiquement ajoutés.

Si `associable` est `true`, les attributs `data-type` et `data-id` sont automatiquements ajoutés.

Si `displayAssociates` est `true`, on ajoute le div des associés retourné par la méthode commune `divsAssociates()`.

### DataEditor, l'éditeur de données {#data_editor}

Parmi les données précédentes, on trouve des données qui peuvent s'éditer à l'aide du `DataEditor`. Ce sotn par exemple les personnages, les brins, les Fondamentales, etc.

Pour pouvoir être *data-éditorable*, un objet ou une classe doit posséder :

* une propriété `DataEditorData` qui définit un grand nombre de caractéristiques,
* des méthodes permettant de prendre en compte les changements et de les enregistrer dans un fichier.

Pour le développeur, ces requisitions sont testées et signalées en cas de manquement.

Voilà les données générales :

```javascript

  DataEditorData:{
      title:  "Le titre à donner à la fenêtre d'édition"
    , type:   "Le type de l'élément, par exemple 'personnage'" // pas vraiment utilisé
    , titleProp:  'la propriété qui servira à nommer l’élément, dans le menu par exemple'
    , items:      [Array('de tous les éléments comme instances')]
    , dataFields: [
        // Définition des champs d'édition (cf. plus bas)
      ]
    , no_new_item: true // Si true, on ne peut pas ajouter de données
                        // C'est le cas par exemple des Fondamentales
    , no_del_item: true // Si true, on ne peut pas détruire de données
    , checkOnDemand: true /* Si true, les données ne sont pas vérifiées
                            automatiquement. C'est un bouton qui permet de les
                            valider. Cela permet de les rentrer progressivement,
                            comme pour les fondamentales par exemple.
                          */
  }

```

`DataEditorData.dataFields` est un `Array` qui contient des `object`s définissant les propriétés suivantes :

```javascript

  {
    label:    'Libellé affiché en regard du champ'     // REQUIS
  , type:     'type du champ (text, textarea, select)'   // REQUIS
  , prop:     'la propriété de l’instance qui sera lue et affectée'  // REQUIS
  , observe: {
        '<type evenement>': <méthode de traitement>
      /* par exemple */ , 'click': OBJ.onClick.bind(OBJ)
      /* ou encore */   , 'change': OBJ.onChange.bind(OBJ)
      /* Cas spécial du drop : */
      , 'drop': {<data pour droppable>}
    }
  , editable:  /* si false, la valeur ne pourra pas être éditée */
  , exemple:  'placeholder affiché quand aucune donnée'
  , aide:     'texte ajouté en petit à côté du libellé'
  , after:    'texte ajouté après un champ court (type:"text" et class:"short")'
  , validities: flag pour tester la validité de (UNIQ, REQUIRED, ASCII)
  , values:   <valeurs pour un select, soit [{value: inner}...], soit [[value, inner]...]
  , editLink: <function>
        /**
          Si définie, un lien est placé après le champ d'édition pour éditer la
          chose qui correspond au champ d'édition avec la fonction spécifiée.
          Par exemple, si c'est un champ contenu un ID de QRD, un lien pour
          éditer la QRD sera créé.

          La méthode spécifiée doit IMPÉRATIVEMENT pouvoir recevoir en premier
          argument la valeur du champ courant (par exemple l'identifiant de la
          QRD à éditer).

          [2] Si la méthode existe au moment de la définition de ce editLink, on
          peut utiliser la tournure : `editLink:MONObjet.method.bind(MONObjet)`
          Si elle n'existe pas, on utilisera la formule :
            `editLink:(v)=>{MONObjet.method.bind(MONObjet)(v)}`

        **/
  , showLink: <function>
        /**
          Même fonctionnement que pour la propriété editLink ci-dessus, mais
          pour les éléments qui ne s'éditent pas.

          La méthode spécifiée doit IMPÉRATIVEMENT pouvoir recevoir en premier
          argument la valeur du champ courant (par exemple l'identifiant de la
          personnage à afficher).
        **/
  , updateValuesMethod:  <function> // si select, la méthode pour actualiser
                          // [OPTIONNEL]

  , getValueMethod: (v) => { return "la valeur réelle à prendre en compte"}
  , setValueMethod: (v) => { return "la valeur à mettre dans le champ (if any)"}
  , checkValueMethod: (v) => { /* return rien si valeur v OK, sinon le message d'erreur */}

  }

```

Le flag `validities` permet de checker si la valeur est :

* unique (`UNIQ`),
* définie (requise, obligatoire) (`REQUIRED`),
* composée uniquement de lettre a-z (min/maj) de chiffre ou du trait plat (`ASCII`).

Si de plus amples vérifications doivent être faites sur la donnée, il faut utiliser la méthode `checkValueMethod`.

#### Les méthodes obligatoires

Un objet *data-editorable* doit répondre aux méthodes :

* `DECreateItem(data)`. Qui doit permettre de créer un nouvel élément avec les données `data`, sauf si `no_new_item` est à `true`
* `DEUpdateItem(data)`. Qui doit permettre de modifier un élément avec les nouvelles données `data`,
* `DERemoveItem(data)`. Qui doit permettre de détruire l'élément d'identifiant `data.id`

Note : s'inspirer des fonctions définies dans `app/js/composants/faPersonnage/required_then/FAPersonnage_DataEditor.js` pour les personnages ou `app/js/composants/faBrin/required_then/FABrin_DataEditor.js` pour les brins.

### Les méthodes utiles

`<Classe>.edit(item_id, e)` est la méthode de classe de l'élément qui va permettre d'éditer automatiquement les objets. Elle est héritée de `FAElement`. Il suffit d'utiliser :

```html

  <a class="lkedit lktool" onclick="MaClasse.edit('<id>',event)">edit</a>

```

ou :

```javascript

$('a#<idlien>').on('click', this.constructor.edit.bind(this.constructor,'<id>'))

```

### Fonctionnement en panneaux {#data_editor_panels}

Le data-editeur peut aussi fonctionner en panneaux mais, dans ce cas, les données et les méthodes sont beaucoup plus complexes. On ne le fera que si c'est vraiment nécessaire. Ça l'est, par exemple, pour les fondamentales.

#### Définition des panneaux

Les panneaux sont définis comme des `dataField`s normaux mais ils possèdent la propriété `type` réglée à `panel`. Ils définissent aussi une sous-propriété `dataFields` qui définit les champs.

Chaque panneau doit impérativement correspondre à un object/une classe qui sera traitée comme un item particulier possédant les propriétés définies.

Dans ce cas, notamment, chaque `id` de panneau doit correspondre à une méthode de l'item qui retournera l'élément à modifier. Par exemple, pour l'objectif dans les Fondamentales, il appartient à la deuxième fondamentale. Le panneau a pour id `fd2`, qui permet de récupérer la deuxième fondamentale, et c'est dans cette deuxième fondamentale qu'on définit `get/set objectif`.


## KWindows, choix d'élément par les touches {#les_keyswindows}

Les « keys-windows » (class `KWindow`) permettent d'afficher une liste de choses quelconques (comme des marqueurs) et de les sélectionner avec les touches. Elles permettent aussi de supprimer des éléments dans la liste.

Soit un objet `MonObjet` contenant des items.

```javascript

  MonObjet.kwindow = new KWindow(MonObjet, {
      id:   'identifiant-valide-unique-et-universel'
    , items: [<liste des items, cf. ci-dessous>]
    , title: 'TITRE DE LA FENÊTRE' // par exemple "Se rendre au marqueur…"
    , width:    XXX // largeur de la fenêtre (400 par défaut)
                // Unité : pixel
    , onChoose: /* methode à appeler quand on choisit un élément
                    Le premier argument est l'ID de l'item
                */
    , onCancel: /* méthode appelée quand on renonce (touche escape) */
    , onRemove: /* méthode appelée quand on détruit un élément (touche Backspace)
                   Le premier argument est l'ID de l'item
                   Note : c'est la Kwindow elle-même qui se charge d'afficher
                   la confirmation et d'appeler la méthode si la confirmation de
                   destruction a été donnée.
                */
  })

```

La liste des items doit être une liste `Array` de paires `[valeur, titre]`. C'est le `titre` qui sera affiché et c'est la `valeur` (ou identifiant) qui sera envoyé aux méthodes.

Sur chaque rangée, il peut cependant y avoir deux valeurs, la valeur par défaut et une valeur alternative. Par exemple, pour les nœuds structurels, on a à gauche le nœud absolu et à droite le nœud relatif à l'analyse. On définit cette valeur alternative simplement en définissant une troisième valeur dans la paire ci-dessus : `[valeur, titre, titre_alternatif]`.

Pour afficher la liste, on fait :

```javascript

MonObjet.kwindow.show()

```

Ensuite, il suffit d'utiliser les flèches et la touche retour pour choisir et sélectionner un item en particulier. Tout est géré de façon automatique.

La méthode qui reçoit le `onChoose`, l'item choisi, doit recevoir en premier argument la valeur, c'est-à-dire le premier élément de la paire `[valeur, titre]` :

```javascript

methodeOnChoose(valeur){
  /* traitement de `valeur` */
}

```

Si c'est une rangée double — i.e. avec une valeur alternative —, la méthode doit recevoir un second argument qui est `true` lorsque la valeur envoyée doit concerner l'élément alternatif.

```javascript

methodeOnChoose(valeur, forAlt){
  /* traitement de `valeur` pour l'élément alternatif */
}

```

Pour les nœuds structurels par exemple, `forAlt` sera `true` ci-dessus si c'est le nœud relatif qu'on veut rejoindre.


## Actualisation automatique des éléments affichés lors des modifications {#autoupdate_after_edit}

Le système adopté pour actualiser automatiquement l'affichage lors de modifications est de fonctionner avec une classe qui contienne la définition de ce qu'est l'élément.

Un exemple tout simple, avec les personnages. Lorsqu'un personnage est modifié, disons son pseudo, automatiquement, tous les éléments (span essentiellement) possédant la classe `perso-<ID perso>-pseudo` sont modifiés pour refléter le changement.

Donc, la classe est construite avec :

```

  <prefixe objet>-<identifiant objet>-<propriété>

```

Chaque classe doit posséder une méthode d'instance `onUpdate` qui corrige les éléments. Elle peut se résumer à :

```javascript

onUpdate(){
  this.constructor.PROPS.map(prop => {
    $(this.domCP(prop)).html(this[`f_${prop}`]||this[prop])
  })  
}
domC(prop){return `${this.prefix}-${this.id}-${prop}`}
domCP(prop){return `.${this.domC(prop)}`}
get prefix(){return 'perso' /* À DÉFINIR */}

```

Avec comme prérequis que :

* `PROPS` contient la liste de toutes les propriétés actualisables.
* chaque propriété spéciale possède une méthode `f_<propriété>` qui formate cette propriété pour l'affichage. Le cas échéant, c'est la valeur de la propriété elle-même qui est utilisée.

### Association des éléments {#associations_elements}

Cette partie concerne maintenant les [éléments de l'analyse](#elements_analyse) en tant que classe étendue de `FAElement`. Dès qu'une classe hérite de cette superclasse, elle hérite des méthodes d'association décrites ci-dessous.

Tous les types d'éléments d'une analyse peuvent être associés, à savoir les types `event`, `personnage`, `document`, `brin` et `time`.

Pour rendre une classe *associable*, les requis sont les suivants.

* L'élément doit être conforme aux requis définis dans [éléments de l'analyse](#elements_analyse).
* Définir l'élément sur lequel on pourra *dropper* un autre élément. Il suffit pour cela d'utiliser la ligne de code `$(element).droppable(DATA_ASSOCIATES_DROPPABLE)` ([1]).
* Définir l'élément qui sera déplaçable (peut-être le même) pour associer l'élément avec un autre élément droppable :
        `$(element).draggable(DATA_ASSOCIATES_DRAGGABLE)`
* Définir les propriétés obligatoires (requis pour tous les éléments) :
  * `CLASSE#type`, propriété d'instance qui retourne le type de l'élément (qui doit être le nom minuscule de la classe).
  * `CLASSE#id` propriété d'instance qui retourne l'identifiant de l'élément (celui qui permettra de le récupérer en utilisant la méthode de classe `get` — cf. ci-dessous).
* Définir les méthodes obligatoires :
  * `CLASSE#toString()`, méthode d'instance qui retourne la référence simplifiée de l'élément (sert pour le helper qu'on déplacera pour dragguer l'élément). Cette méthode sert aussi pour tous les messages traitant de l'élément.
  * `CLASSE#as('associate')` qui doit retourner le div de l'associé pour affichage (dans un listing par exemple). Cette méthode doit utiliser le lien `dissociateLink([options])` pour dissocier l'élément.
  * `CLASSE::get(<element id>)`, méthode de classe qui retourne une instance de l'élément.
* Modifier `ASSOCIATES_COMMON_METHODS` :
  * Ajouter le type de l'élément à sa liste `types`. Rappel : il est maintenant toujours au singulier
* Si le type d'élément définissait les anciennes valeurs d'associations, il faut détruire ses méthodes ou propriétés `documents`, `events`, `brins` et `personnages`.
* Ajouter la propriété `associates` aux propriété de l'élément (surtout celles qui doivent être enregistrées). Dans la propriété `constructor.PROPS` qui peut être inspirée de celle de `FAPersonnage` ou `FABrin` par exemple.
* Vérifier que l'élément utilise bien la méthode `associatesEpured()` pour définir les associés à enregistrer.
* Si la classe de l'élément utilise le `DataEditor`, il suffit d'ajouter `associable: true` dans la table `DataEditorData` pour rendre l'élément associable dans les deux sens en édition.

> [1] Auparavant, il fallait redéfinir la méthode `drop` des données droppable, mais maintenant la méthode est générique et appelle toujours la méthode `associer` de l'analyse courante avec en arguments le possesseur et le possédé.

#### Apports des mixins ASSOCIATES

La table `ASSOCIATES_COMMON_METHODS` et la table `ASSOCIATES_COMMON_PROPERTIES` apportent toutes les méthodes et propriétés utiles pour les associations, et notamment :

* Les méthodes `<type>s` et `instances_<type>s` qui retournent respectivement la liste des identifiants et la liste des instances de chaque type associé. Par exemple, la propriété `<instance brin>.documents` des brins retourne la liste des identifiants des documents tandis que la propriété `<instance brin>.instances_documents` retourne la liste des instances `{FADocument}` des documents du brin en question.
* La méthode `hasAssociates()` qui retourne true si l'élément possède des associés
* la méthode d'helper `dragHelper` qui retourne l'helper à utiliser pour les éléments draggable. On l'utilise en définissant :
      ```javascript
      $(element).draggable({
          revert: true
        , helper: () => {return this.dragHelper()}
        , cursorAt:{left:40, top:20}
      })
      ```
* la méthode d'helper `dissociateLink([options])` qui retourne un lien pour dissocier l'élément (elle peut être utile, mais c'est elle qui est utilisée, de toute façon, lorsqu'on utilise la méthode `divAssociates` — cf. ci-dessous — pour lister les associés),
* la propriété `associates` qui est une table qui contient en clé le type de l'associé (**au singulier**) et en valeur la liste des identifiants des associés de chaque type.
* la méthode `divsAssociates([<options>])` qui retourne les divs de tous les associés (au format `options.as` qui peut être soit 'dom' (défaut) soit 'string'). Noter que si l'option `title: true` ou `title: "Le titre à donner"` est utilisée, la liste retournée contient le titre donné ou « Éléments associés » par défaut, dans un `H3`.
* La méthode `associatesEpured()` qui retourne la liste des assiociés épurée des valeurs nulles (listes vides) pour l'enregistrement. Placer simplement la ligne suivante dans la méthode qui constitue les données à enregistrer :
      ```javascript
      data2save.associates = this.associatesEpured()
      if(!data2save.associates) delete data2save.associates
      ```
* La propriété `associatesCounter` qui retourne le nombre courant d'associés.


### Helpers de drag {#assocations_helper_drag}

Pour ne pas avoir d'helper de drag qui passe sous les autres éléments, entendu que le `z-index` de jQuery est une horreur, on peut utiliser la méthode utile `DHelper(...)` pour produire un helper qui restera toujours au-dessus.

Pour ce faire, on définit les données du drag en mettant :

```javascript

element.draggable({
  //...
  , helper: function(e){ // ne pas utiliser (e) => {...}
      if ( isUndefined(this._draghelper) ) {
        let target = $(e.target)
        this._draghelper = DHelper('<inner texte>', {<data>})
      }
      return this._draghelper
    }
  //...
  // Pour supprimer l'helper à la fin du drag :
  , stop: function(e){ // ne pas utiliser (e) => {...}
      this._draghelper.remove()
    }
})
```

Les `<data>` ci-dessus est une table qui contiendra en clé les `propriétés-data` à définir dans le helper. Par exemple, la commande

```javascript

  DHelper("mon texte", {id: 12, type: 'document'})
```

produira le code

```HTML

  <div class="draghelper" data-id="12" data-type="document">mon texte</div>

```

Noter que la classe CSS `.draghelper` doit être définie. Une définition possible est :

```CSS

div.draghelper
  display: inline-block
  width: auto
  background-color: darkblue !important
  color: white
  white-space: nowrap
  padding: 1px 8px
  font-size: 13pt
  z-index: 5000

```

---------------------------------------------------------------------

## La vidéo {#la_video}

### Actualisation des informations vidéo {#update_infos_video}

Au lancement de la vidéo avec :

* `Locator.togglePlay`, la vidéo est mise en route avec :
* `video.play()`, ce qui génère une `Promise` qui
* active les horloges avec `Locator.activateFollowers`

La méthode `Locator.activateFollowers` génère un timer d'intervalle qui appelle la méthode `Locator.actualizeAll` tous les 1000/40e de seconde.

La méthode `Locator.actualizeAll` :

* prend le temps courant (`Locator.currentTime`)
* actualise les horloges avec le temps courant
* actualise le Reader pour afficher les events au temps courant (`Locator.actualizeReader`)
* actualise les marques de structure (`Locator.actualizeMarkersStt`)
* actualise la marque de scène courante (`actualizeMarkScene`)
* actualise le Banc Timeline en positionnant le curseur.

Note : à l'avenir, il faudrait pouvoir décider ce que l'on actualise pour alléger le travail. La méthode `actualizeALL` ne sert plus qu'à tout actualiser lorsque l'on s'arrête ou qu'on choisit un temps.

---------------------------------------------------------------------

## Ajout de préférences globales {#add_global_prefs}

On distingue les « Préférences », qui sont globales, c'est-à-dire propre à toutes les analyses, et les « Options » qui sont propres à une analyse en particulier et n'affecte pas les autres.

Ces préférences sont définies dans le menu « Options » jusqu'à définition contraire, bien que ce menu soit confusionnant.

Pour définir une nouvelle préférences (donc une options globale) :

1. Définir la valeur par défaut et le nom de l'option dans le fichier `./js/system/Options.js:14`, dans la constante `DEFAULT_DATA`. S'inspirer des autres options.

2. Créer un nouveau menu dans le submenu de "Options" (fichier `/main-process/menu.js:427`) avec les données suivantes :

```javascript
  {
      label:    "<Le label de la préférences>"
    , id:       '<id_indispensable_et_universel>'
    , type:     'checkbox'
    , checked:  false
    , click:    ()=>{
        var check = this.getMenu('<id_indispensable_et_universel>').checked
        mainW.webContents.executeJavaScript(`FAnalyse.setGlobalOption('<id_indispensable_et_universel>',${checked?'true':'false'})`)
    }
  }
```

3. Si nécessaire, demander le réglage de la préférence, au chargement de l'application, dans le fichier `.../main-process/Prefs.js:170` :

```javascript

  // dans .../main-process/Prefs.js

  , setMenusPrefs(){
      //...

      ObjMenus.getMenu('<id_indispensable_et_universel>').checked = this.get('<id_indispensable_et_universel>')
      // En considérant que le menu et l'id de l'option sont identiques, ce
      // qui est préférable.
    }

```

Si la valeur par défaut doit être false, il n'y a rien d'autres à faire. Sinon, il faut définir sa valeur par défaut dans `Prefs` (fichier `.../main-process/Prefs.js:26` comme ci-dessous), dans la constante `USER_PREFS_DEFAULT`.

Noter que les préférences générales, lorsqu'elles sont modifiées, sont enregistrées dans le fichier `$LIBRARY/Application\ Support/Film-Analyzer/user-preferences.json` quand on quitte l'application.


### Utilisation des préférences globales {#use_global_prefs}

Pour connaitre la valeur d'une option globale — donc d'une préférence —, on utilise la même méthode que pour les options de l'analyse :

```javascript

var opt = current_analyse.options.get('<id de l’option>')

```

### Ajout de préférence analyse {#add_analyse_pref}

1. Dans le fichier `./app/js/system/Options.js`, ajouter l'option à la donnée `Options.DEFAULT_DATA`.


2. Traiter l'option dans `Option#onSetByApp` dans le fichier `system/first_required/Options.js` en s'inspirant des autres options.

3. Implémenter le menu (dans le menu "Options" en général) avec :

```javascript

{
    label: "<titre de l'option>"
  , id: 'ID-MENU-DE-L-OPTION'
  , type:'checkbox'
  , click:()=>{
      var c = ObjMenus.getMenu('ID-MENU-DE-L-OPTION').checked ? 'true' : 'false'
      execJsOnCurrent(`options.set('ID-DE-L-OPTION-REEL',${c})`)
    }
}

```

> Si on veut faciliter les choses, on mettre un id de menu de l'option identique à l'id de l'option elle-même, mais ça n'est pas obligatoire.

3. Traiter l'utilisation de l'option en se servant de la valeur de `current_analyse.options.get('<id_universel_option>')`.


### Horloges et durées {#temporal_fields}

On peut mettre `horlogeable` et `durationable` sur les balises `<horloge></horloge>` qui doivent être gérable au niveau des horloges (positions) et des durées.

Une horloge (balise `<horloge>`) doit obligatoirement posséder un identifiant unique dans la page.

Quand un champ possède l'une de ces deux classes :

* il est rendu inéditable (`disabled`)
* il est sensible au déplacement de la souris pour augmenter/diminuer le temps

Noter qu'il faut utiliser la méthode `UI.setHorlogeable(<container>, options)` ou `UI.setDurationable(<container>, options)` pour que les observers soient placés. **ATTENTION** de ne pas prendre un container trop grand, qui possèderait des éléments déjà horlogeables ou durationables.

On peut récupérer les horloges qui sont renvoyées et les régler :

```javascript
  var horloges = UI.setHorlogeable(<container>[, <option>])
  var h = horloges[<id horloge>]
  h.dispatch({time: <temps de départ>, ...})
```

On peut aussi implémenter soi-même l'horloge :

```javascript
  var h = new DOMHorloge()
  h.dispatch({
        time: <le temps de départ>
      , synchroVideo: true/false
      , parentModifiable: true/false
      , unmodifiable: true/false
    }).showTime()
```

`options` peut contenir `{synchro_video: true}` pour que l'horloge soit synchronisée avec la vidéo. Inutile alors de dispatcher cette donnée.

Si `unmodifiable` est mis à true, on n'indiquera pas lorsque l'horloge aura changé de temps. C'est le cas par exemple de l'horloge principale.

On utilise `parentModifiable` en indiquant le conteneur, qui peut recevoir la classe `modified` pour indiquer qu'il est modifiable (*visuellement* modifiable). C'est le cas par exemple pour les horloges des formulaires d'events. Les formulaires sont les « containers modifiables », qui vont recevoir la class `modified` quand l'horloge sera modifiée, ce qui aura pour effet de mettre l'horloge dans une autre couleur ainsi que le header et le footer du formulaire.

## Aspect visuel {#visual_aspect}

### Boutons principaux

Appliquer la classe `main-button` aux `button`s principaux, qui est défini dans `ui.css`.

### Empêcher la sélection

Utiliser la classe CSS `no-user-selection` pour empêcher un élément de l'interface d'être sélectionné lorsque l'on glisse la souris.

> Note : une fois cette classe appliquée, les textes contenus ne peuvent pas être sélectionnés par l'user.

### Boutons de fermeture {#boutons_close}

Pour faire un bouton rouge de fermeture « à la Mac », il suffit de placer dans l'entête de l'élément un `button` de classe `btn-close` :

```html

  <button type="button" class="btn-close"></button>

```

Avec les helpers :

```javascript
  var btn = DCreate('BUTTON', {class: 'btn-close', type:'button'})

```

Rien d'autre à faire pour qu'il apparaisse comme un bouton de fermeture et qu'il ferme la fenêtre voulue.

Si un traitement doit être opéré *avant* la fermeture de la boite, on peut implémenter la méthode `beforeHide` qui sera appelée avant. Si cette méthode renvoie `false`, le processus de fermeture est interrompue. **La méthode doit renvoyer `true` pour que la fermeture est bien lieu.**

Si une méthode `cancel` existe dans le propriétaire du bouton, c'est cette méthode qui sera utilisée plutôt que `hide` dans FWindow suivant de `onHide` dans le propriétaire.

### Boutons expand/collapse {#boutons_toggle_next}

On appelle les boutons qui permette d'ouvrir et de refermer un container (comme une liste par exemple) des boutons « toggle next » (« next » parce qu'ils s'appliquent par défaut au nœud suivant).

On implémente ces boutons simplement en inscrivant dans le code :

```html

<button class="toggle-next"></button>
<ul id="le-container-suivant" style="display:none;">
  <li>...</li>
</ul>

```

… puis en appelant la méthode `BtnToggleContainer.observe(cont)` où `cont` est le set jQuery qui contient le bouton en question.

Si le bouton est le dernier élément, on peut ajouter un div-clear après lui, pour qu'il ne soit pas rogné. Par exemple :

```html

<button class="toggle-next"></button>
<ul id="le-container-suivant" style="display:none;">
  <li>...</li>
</ul>
<div style="clear:both"></div>

```

Si l'on désire que le container soit ouvert, il suffit de forcer l'attribut `data-state` du bouton en lui donnant la valeur `opened` :

```html

<button class="toggle-next" data-state="opened"></button>
<ul id="le-container-suivant"><!-- sera ouvert -->
  <li>...</li>
</ul>

```

On peut viser un autre nœud que le nœud suivant grâce à l'attribut `container` du bouton :

```html

<button class="toggle-next" container="#monDiv"></button>
<!-- d'autres éléments ici -->
<ol id="monListing">
  <li>...</li>
</ol>

```

### Boutons d'aide {#boutons_daide}

Pour afficher un picto « ? » cliquable.

```javascript

  DCreate(AIDE, '<message d’aide à afficher>')

```

Pour observer ce bouton (régler le clic souris qui doit ouvrir le message), il faut appeler la méthode `UI.setPictosAide(container)` en envoyant le container du bouton.

### Élément toujours visible dans container scrollable {#rend_always_visible}

Pour qu'un élément soit toujours visible dans son parent scrollable, on doit utiliser la méthode `UI.rendVisible(element)`.

Ne pas oublier de mettre `position: relative` au container, donc à la liste.

---------------------------------------------------------------------

## Documents de l'analyse {#documents_analyse}

Les documents de l'analyse sont entièrement gérés, au niveau de l'écriture, par les modules contenus dans le dossier `./app/js/composants/PorteDocuments`. Ce dossier est le premier qui a été chargé par la nouvelle méthode `System#loadJSFolders` (par le biais de `FAnalyse.loadWriter`) qui travaille avec des balises `<script>` afin d'exposer facilement tous les objets, constantes et autres.

Ces documents permettent de construire l'analyse de trois façons différentes :

* en les rédigeant dans le *PorteDocuments* (qui s'ouvre grâce au menu « Documents »),
* en les peuplant grâce à l'[éditeur de données](#data_editor),
* en en créant le code de façon dynamique pour ce qui est des stats, des PFA et autres notes au fil du texte.

### Quatre types de documents {#les_types_de_documents}

Il faut comprendre qu'il y a 4 types de documents, même s'ils sont tous accessibles depuis le menu « Documents » de l'application.

1. Les documents entièrement rédigés, littéraires (introduction, synopsis). Ils peuvent être coller tels quels dans l'analyse, grâce à la commande `FILE` du [script d'assemblage][].
2. Les documents partiellement rédigés et partiellement automatisés (Fondamentales, Annexes avec les statistiques, etc.)
3. Les documents entièrement automatisés (PFA, au fil du film, scénier) qui se servent d'informations éparses — p.e. la définition des nœuds structurels au fil du film — pour se construire.
4. Les documents de données (snippets, diminutifs, infos du film et de l'analyse)

### Édition quelconque d'un fichier {#edit_any_file}

Le `PorteDocuments` permet d'éditer un fichier quelconque, par exemple une liste de valeurs programme, et même, pourquoi pas, un fichier de code.

On utilise alors la méthode `openAnyDoc`.

```javascript

  PorteDocuments.editDocument('<path/absolue/to/document.ext>')

```


### Sauvegarde protégée des documents {#saving_protected}

La sauvegarde protégée des documents est gérée par `system/IOFile.js`. L'utilisation est simple : on crée une instance `IOFile` du document en envoyant son path et on peut le sauver et le charger en utilisant `<instance>.save()` et `<instance>.loadIfExists()`.

@usage complet :

```javascript

  let iofile = new IOFile(<cheminFichier ou objetProprietaire>[, autrePath])

  [iofile.code = monCodeFinal // si objetProprietaire n'est pas défini]
  iofile.save({after: methode_appelee_apres_save})

  function methode_appelee_apres_load(code){
    // ...
  }

  iofile.loadIfExists(after: methode_appelee_apres_load_avec_code)

```

Pour fonctionner avec un `owner` (un propriétaire — une instance, un objet), il faut que ce propriétaire possède les propriétés `path` définissant le chemin d'accès au fichier — ou que le path soit défini en second argument — ainsi que la propriété `contents` ou la propriété `code` définissant son code final à sauver.

Exemple :

```javascript

class monObjet {
  get contents(){ return this._contents }
  get path() { return 'chemin/daccess/au/fichier.odt'}
  get iofile(){ return this._iofile || defP(this,'_iofile', new IOFile(this))}

  saveMe(){
    this.iofile.save({after: this.afterSaving.bind(this)})
  }
  afterSaving(){
    console.log("Le document est sauvé")
  }
  loadMe(){
    this.iofile.loadIfExists({after: this.afterLoading.bind(this)})
  }
  afterLoading(code){
    this._contents = code
  }
}

```

Si **le propriétaire n'est pas défini**, il faut explicitement définir le code de l'`iofile` :


```javascript

  this.iofile.code = "Mon code à enregistrer"
  this.iofile.save({after: ...})

```

> Noter qu'on indique le format que si l'extension du fichier ne correspond pas.

```javascript
// ...

function methode_apres_chargement(contenu_document){
  // ...
}
// Pour récupérer le document
iofile.loadIfExists({
  after: methode_apres_chargement // reçoit en argument le contenu du document
})

```

Le format du contenu — JSON, YAML, etc. — n'a besoin d'être précisé que s'il ne correspond pas à l'extension du fichier (du `path`). On l'indique alors dans l'argument :

```javascript

  this.iofile.save({after: ..., format: 'json'})

```

On peut mettre au format `raw` lorsque le format est reconnaissable par l'extension du `path`, mais qu'on ne veut pas que le code soit interprété.

```javascript

  this.iofile.load({after: ..., format: 'raw'}) // => code brut du fichier

```


---------------------------------------------------------------------

# Assemblage de l'analyse {#assemblage_analyse}

Cette partie traite de l'assemblage de l'analyse côté programmation.

Pour assembler l'analyse, l'application se sert principalement de la classe `FABuilder` (pour la construction) et de la classe `FAExporter` (pour le rapport).

## Script d'assemblage {#script_assemblage_analyse}

Le « script d'assemblage » définit la façon d'assembler les différents composants de l'analyse pour composer le document final.

## Messages de suivi {#assemblage_messages_suivis}

On peut envoyer des messages de suivi grâce à l'instance `report` du builder qui construit l'analyse. Cela consiste la plupart du temps à faire :

```javascript

this.report.add('mon message', 'mon type de message')

```

Les types de message sont :


| Type | Description               |
|-----------|---------------------------|
|           |                           |
| `title`             | Pour un titre             |
| `error`   | Pour signaler une erreur  |
| `notice`  | Message en bleu à remarquer |
| `warning` | Une alerte moins forte qu'error |
| `normal`  | Le type par défaut, neutre |
<!-- la ligne `title` contient les insécables qui donnent la dimension -->

---------------------------------------------------------------------

## Test de la l'application {#test_application}

Pour tester l'application en la programmant, le plus simple est d'utiliser les `Tests manuels`. Ce sont des tests qui sont semi-automatiques, c'est-à-dire que certaines opérations peuvent s'exécuter et se tester toutes seules, tandis que d'autres nécessitent une action réelle (jusqu'à ce que tout puisse être pris en charge, ce qui est le but à long terme).

---------------------------------------------------------------------

## Les « Hand-Tests », test manuels de l'application {#tests_manuels}

Les tests manuels — qu'on pourrait aussi appeler « tests semi-automatiques », sont composés de phases automatisées et de phases manuels que l'utilisateur — le programmeur — doit exécuter.

Tous les tests manuels sont définis dans le dossier `./Tests_manuels/`. On peut s'inspirer des tests présents pour en créer d'autres.

Chaque fichier définit plusieurs hand-tests.

Un hand-test, au minimum, requiert :

* Un `id`, identifiant unique dans le fichier.
* Un `libelle` pour afficher ce qu'il fait.
* Un `synopsis` qui est une liste d'actions (Array),
* Une liste de `checks` à faire pour valider l'essai.

Par exemple :

```YAML

---
  - id: mon_premier_test
    libele: Libellé de mon premier test, en titre
    description: C’est un tout premier test à faire
    synopsis:
      - ouvrir l'app
      - ouvrir l'analyse 'monAnalyse'
      - check: aucun event
      - check: aucun document
      - quitter l'app
    checks:
      - tout doit s’être bien passé
      - l'app ne doit plus être affichée
      - et moi non plus, d’ailleurs…

```

### Lancement des hand-tests {#running_hand_tests}

On lance les hand-tests en activant le menu « Outils > Lancer les tests manuels » (ou item similaire). L'item « Reprendre les tests manuels » (ou similaire) permet de reprendre les tests là où on s'était arrêté la dernière fois.


### Astuce pour toujours commencer par le test en cours (#tip_start_with_current_test)

Quand un test est en cours d'élaboration, ou en cours de jeu pendant le développement du code qu'il concerne, on peut le rejoindre dès le lancement des tests en lui donnant un nom commençant par exemple par un trait plat ou par un 0. Il passera alors toujours avant les tests suivants.

Il faudra seulement penser à retirer ce trait plat du nom, une fois les choses achevéees, pour pouvoir utiliser l'astuce pour le nouveau test courant.

Essayer par exemple en implémentant un fichier de tests qui s'appellerait `_mon_premier_test.yaml` et qui contiendrait :

```yaml
- id: mon_premier_test
  libelle: Essai d'un test au-dessus
  synopsis:
    - ouvrir l'application
  checks:
    - Ce test est lancé en premier.
```

### Passage au test suivant {#next_hand_test}

On peut passer au test suivant du fichier courant (ou le premier du fichier suivant si on est au dernier test du fichier) en cliquant le bouton « Test suivant » en bas de la fenêtre de test.

### Passage au fichier suivant {#next_file_hand_tests}

On peut passer au fichier de test suivant en cliquant le bouton « Fichier suivant » en bas de la fenêtre de test.

### Interrompre les tests {#interrompre_hand_tests}

On peut interrompre les tests manuels à tout moment en cliquant sur le bouton « FINIR » en bas de la fenêtre des tests.

On peut alors utiliser le menu « Outils > Poursuivre les tests » pour repartir là où on s'est arrêté.

Noter que si les boutons « Test suivant » ou « Fichier suivant » ont été utilisés, le menu « Poursuivre les tests » reconduira toujours au premier test qui n'a pas été validé.

### Composition des étapes des hand-tests (synopsis) {#compositing_hand_tests_steps}

Pour composer le *synopsis* d'un test, comprendre la suite de ses étapes (`steps`), il faut comprendre qu'il existe deux sortes d'étape :

* les steps automatiques,
* les steps manuelles.

Les secondes sont simplement composées de textes qui indiquent ce qu'il faut faire, sans que ces phrases signifie quelque chose pour l'application. Par exemple « glisser le petit icone à gauche vers la grosse partie de droite » ne signifiant rien pour les tests, ces tests l'afficheront simplement comme une étape à exécuter manuellement et attendront qu'on l'exécute pour passer à la suite.

Les premières, au contraire, les *steps automatiques*, s'exécutent comme leur nom l'indique de façon automatique, sans intervention du testeur.

Une étape automatique ne peut être définie qu'en fonction de l'application et ses besoins propres. Par exemple, pour le test de l'application **Film Analyzer** pour lesquels ces tests automatiques ont été créés, on trouve l'étape automatique `ouvrir l'analyse 'monAnalyse'` qui permet d'ouvrir de façon automatique l'analyse précisée, ici `monAnalyse` (c'est-à-dire, précisément, une analyse se trouvant dans le dossier `./analyses/tests/MANUELS/` de l'application **Film Analyzer**).

La première chose à faire, donc, pour le testeur, est de définir ces étapes. Voir la partie [implémentation des étapes automatiques](#developping_hand_tests), ci-dessous, pour voir comment procéder. Ces étapes seront définies dans le fichier `./app/js/composants/HandTests/required_xfinally/AUTOMATIC_STEPS.js`.

Il suffit ensuite d'utiliser ces étapes dans le `synopsis` ou les `checks`.

### Vérification dans le synopsis (check) {#checks_in_synopsis}

Il existe deux types de vérifications (*checks*) :

* les vérifications finales du test, pour voir si l'opération testée s'est déroulée conformément aux attentes,
* et les vérifications mineures en cours de synopsis, juste pour savoir si les choses se passent bien avant de poursuivre plus avant. Dans le synopsis, ces vérifications doivent se démarquer avec le préfixe `check:` (sans espace avant les deux points).

On peut trouver par exemple :

```yaml
- id: mon_test
  libelle: Un test avec check au cours du synopsis
  synopsis:
    - Vous devez faire ça
    - Et puis faire ça
    check: "Première vérification à faire : compter les events affichés dans le reader. Il doit y en avoir 3"
    check: 4 events
    check: aucun document
    - Poursuivre en faisant ça
    - Et terminer en faisant ça
  checks:
    - Vous devez être parvenu au bout
```

Ici, les vérifications `4 events` et `aucun document` sont des checks automatiques définis dans le fichier `AUTOMATIC_STEPS.js` dont il est question plus haut. En revanche, la vérification "Première verification [etc.]" est une vérification manuelle que le testeur doit accomplir.

---------------------------------------------------------------------

### Implémentation des hand-tests {#developping_hand_tests}

Les opérations automatiques sont définies dans le fichier `./app/js/composants/HandTests/required_xfinally/AUTOMATIC_STEPS.js`. Il suffit de les reprendre telles quelles dans le `synopsis` ou les `checks`.

#### Implémentation des checks {#implementer_checks}

Les étapes de check ont trois formats possibles :

* les étapes manuelles, qui seront affichées telles quelles au cours du tests et que le testeur doit accomplir manuellement,
* des checks automatiques normaux, définis dans le fichier `AUTOMATIC_STEPS.js` — par exemple `4 documents` —,
* des étapes (commandes ou checks) automatiques à interpréter, à évaluer, avec du code dynamique. Par exemple `{{event:12}} de type {{type:note}}` ou `créer une scène au début`.

Pour les deuxièmes, on trouve par exemple des choses comme `aucun event` qui vérifie qu'il n'y ait aucun event dans l'analyse courante, ou encore `aucun document`, `aucun brin`. On trouve aussi, pour les deuxièmes, des checks dynamiques qui peuvent préciser le nombre de choses attendues. Par exemple : `4 events`, `1 document`, `3 brins`. Ces éléments sont appelés les *éléments numérisables* de l'application.

Pour composer les troisièmes, cf. [Définir les checks dynamiques](#define_dynamique_checks) et [Commandes interprétables](#interpretable_commands).


#### Définir les *éléments numérisables* de l'application {#define_numerisable_elements}

Pour utiliser les *éléments numérisables* dans les checks de tests, il y a deux impératifs :

* définir leur nom,
* définir la façon de les dénombrer.

On les définit dans la constante `HandTests.AppElements` (dans le fichier `HandTests/require_finally/elements.js`). C'est une table qui contient aussi les méthodes `countMethod` et `getMethod` qui permettent respectivement de récupérer le nombre d'éléments et l'élément par son ID dans l'application.


#### Commandes interprétables {#interpretable_commands}

Les commandes interprétables permettent d'exécuter une action de façon automatique, pour rendre les tests plus rapide, en arrivant très rapidement à un état précis.

Leur format est toujours le suivant :

```
  - <action> (un|une) <objet> <lieu> avec <{paramètres}>

```

Par exemple :

```
  - créer une scène au début avec {décor:"Maison"}

```

ou

```

  - <action> <ordre> <objet>

```

Par exemple :

```

  - éditer le deuxième event

```


Noter que si on veut mettre une espace dans les paramètres, il faut mettre toute la commande entre guillemets :

```
  - "créer une scène au début avec {décor: 'Maison'}"

```

Les `action`s possibles sont :

```
  Formule  Formule
    1         2
    oui       non     créer       Pour créer l'objet
    oui       oui     afficher    Pour afficher l'objet ou le listing de l'objet
    oui       oui     détruire    Pour détruire l'objet
    oui       non     modifier    Pour modifier un objet
    non       oui     éditer      Pour mettre l'objet en édition

```

Les `objet`s possibles sont tous les events possibles, les brins ou les documents. Liste **non exhaustive** :

```
  scène
  noeud         Pour un noeud PFA
  note
  info
  procédé
  idée
  objectif
  obstacle
  moyen
  conflit
  personnage
  brin
  document

```

Les `lieu`x possibles sont :

```
  au début      Se place à 0:00:00
  au quart
  au tiers
  au milieu   
  au deux tiers
  au trois quart
  à la fin        => Une minute avant la fin
  à h:mm:ss     Avec ce format exact, même pour 12 secondes
  un peu plus loin    # Se place un peu plus loin, environ 1 mn pour un film
                      # de 2 heures
  plus loin           # Se place à 4/5 minutes pour un film de 2 heures

```

Les `paramètre`s sont tout simplement une table javascript à évaluer. Elle peut contenir des valeurs scalaire ou des fonctions. Par exemple :

```

  {decor: 'Maison', duree: FAEscene.get(12).duree}

```

Toutes les valeurs obligatoires non définies dans cette commande interprétable seront données par défaut.


#### Définir les checks dynamiques {#define_dynamique_checks}

Ce code de vérification est un langage qui ressemble à ça : `L'{{event:0}} possède un {{type:note}}`. Ici, on vérifie que l'event qui a pour identifiant `0` possède bien un `type` (donc une propriété de nom `type`) qui vaut `note`.

Cette partie est encore à l'état expérimental.

#### Toutes les commandes de test {#all_commands_of_the_tests}

Trouver ici un aperçu de toutes les commandes automatiques et semi-automatiques

```
  - ouvrir l'app                  # Lance Film Analyzor
  - /ouvrir l'analyse 'NOM_DOSSIER'/
  - verrouiller l'analyse
  - déverrouiller l'analyse
  - enregistrer l'analyse

  - /se rendre à 50:12/           # où '50:12' peut être remplacé par n'importe
                                  # quelle horloge valide pour le film.
  - /se rendre au début/          # Une des expressions de temps

  - enregistrer le document courant

  - afficher la liste des décors

  - afficher la liste des brins
  - ouvrir le document dbrins       # i.e. document des données des brins

  - éditer le premier event         # où 'premier' peut être deuxième, troisième
                                    # etc.
                                    # où 'event' peut être remplacé par n'importe
                                    # quel objet numérisable de l'application.

  - créer une scène au début avec {pitch:'Pitch de la scène'}
                                    # où 'scène' peut être remplacé par n'importe
                                    # quel objet de l'application
                                    # où 'au début' peut être remplacé par
                                    # 'au milieu', 'au trois quart', etc.
                                    # où {pitch: ...} peut être remplacé par tout
                                    # paramètres à donné à l'objet.

```

Tests

```
checks:
  - aucun event       Produit une failure s'il y a des events
  - aucun document    Produit une failure s'il y a des documents
  - aucun personnage  Produit une failure s'il y a des personnages
  - aucun brin        Produit une failure s'il y a des brins

```

---------------------------------------------------------------------

## Notes/explication {#notes_et_explications}

#### N0001

Il faut bloquer l'entrée de `FWindow::setCurrent` pour empêcher le comportement suivant :

* La fenêtre des images est ouverte (`FWindow::setCurrent` a mis le FAListing en fenêtre au premier plan),
* je clique sur le bouton 'edit' de la première image,
* => l'image se met en édition, donc le DataEditor s'afficher et la méthode `FWindow::setCurrent` est appelée pour le mettre au premier plan,
* MAIS le clique sur le bouton 'edit' a lui aussi généré une demande pour (re)mettre le FAListing en premier plan, qui s'exécute en même temps que le point précédent.

`currentizing` permet de bloquer le 'MAIS' ci-dessus.

#### N0002

Ne surtout pas tester les overlaps dans la méthode `FWindow::setCurrent` (avec `this.checkOverlaps(wf)`) car cette méthode est appelée aussi quand on ferme une fenêtre

=> Le check du chevauchement doit être invoqué au show de la fenêtre volante.

Ne surtout pas utiliser `e && stopEvent(e)` car, alors, lorsque l'on cliquerait sur un checkbox, rien ne se produirait.

#### N0003

Les « flags » des combinaison fléchées (arrows-combinaison) permettent de savoir comment traiter tous les raccourcis clavier qui permettent de se déplacer dans le film à l'aide des combinaisons fonctionnant avec flèche gauche/flèche droite.

Ces combinaisons étant définissables (avec la touche « g ») il faut les calculer.

Principe :

* Une combinaison correspond à un flag unique (un nombre) déterminé à partir de :
  * la touche flèche gauche ou flèche droite
  * l'utilisation ou non de la touche MÉTA,
  * l'utilisation ou non de la touche ALT,
  * l'utilisation ou non de la touche CTRL,
  * l'utilisation ou non de la touche SHIFT,
* Le type `GOTODATA` détermine le nom de l'option, simplement en ajoutant 'goto-' devant : `next-scene` correspond à la préférence globale `goto-next-scene`.
* Le type dans `GOTODATA` détermine le nom de la méthode de déplacement à utiliser, en ajoutant `goTo` et en titleisant le type. Par exemple, `next-scene` correspond à la méthode `goToNextScene`, `start-film` correspond à la méthode `goToStartFilm`.

#### N0004

Au départ, j'avais pensé utiliser les raccourcis des menus. Mais ils sont globaux, et ne peuvent être facilement désactivés (il faudrait utiliser, côté main-process, la méthode `globalShortcut.register` et ce serait lourd et confusionnant).

Donc, les raccourcis sont marqués dans les menus, mais dans le label, pas en `accelerator`, et c'est la gestion normale des shortcuts qui les traite.
