# Film-Analyzer
# Manuel de développement

* [Point d'entrée](#point_dentree)
* [Principes généraux](#principes_generaux)
  * [Fonctionnalité « One Key Pressed »](#one_key_pressed_feature)
* [Essais/travail du code](#travail_code_sandbox_run)
* [Chargement de dossier de modules](#loading_modules_folders)
  * [Chargement de dossiers JS au lancement de l'application](#load_folders_at_launching)
* [Création/modification des events](#creation_event)
  * [Mise en forme des events](#event_mise_en_forme)
  * [Bouton Play/Stop des events](#bouton_playstop_event)
  * [Actualisation automatique des horloges, time et numéro](#autoupdate_horloge_time_numera)
  * [Actualisation automatique du numéro de scène courante](#autoupdate_scene_courante)
  * [Enregistrement des events](#saving_events)
* [Travail avec les events](#working_with_events)
  * [Filtrage des events](#filtering_events)
* [Ajout de préférences globales](#add_global_prefs)
  * [Utilisation des préférences globales](#use_global_prefs})
* [Ajout de préférence analyse](#add_analyse_pref)
* [Horloges et durées](#temporal_fields)
* [Aspect visuel](#visual_aspect)
  * [Boutons de fermeture](#boutons_close)
  * [Boutons expand/collapse](#boutons_toggle_next)
* [Documents de l'analyse](#documents_analyse)
  * [Quatre types de documents](#les_types_de_documents)
  * [Sauvegarde protégée des documents](#saving_protected)
* [Assemblage de l'analyse](#assemblage_analyse)
  * [Script d'assemblage](#script_assemblage_analyse)
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

Permet de régler des choses en tenant une touche appuyée. Par exemple, quand on tient la touche « v » appuyée, on peut régler des choses concernant la vidéo. Avec les flèches haut/bas, on peut régler sa taille.

Cette fonctionnalité est principalement définies dans le fichier `app/js/common/KeyUpAndDown.js`, dans l'objet `KeyUpAndDown`. La touche pressée est captée dans `onKeyDown` et mise dans la propriété `keyPressed` de l'objet. Si on la relève tout de suite, `keyPressed` est effacée dans `onKeyUp`. Si, en revanche, d'autres touches sont pressées avant que la touche ne soit relevée, on peut offrir des traitements.

On peut définir dans la propriété `methodOnKeyPressedUp` de l'objet `KeyUpAndDown` la méthode qui doit être appelée quand on relève la touche. Cela permet de ne pas multiplier un traitement coûteux à répétition. Par exemple, sans cette méthode, avec la touche « v » appuyée, on changerait la taille de la vidéo **et on l'enregistrerait dans le fichier `options.json`** chaque fois que la touche flèche haut ou bas serait appuyée. Puisque c'est une touche « à répétition » (i.e. qu'on peut maintenir pour répéter la touche), l'enregistrement serait appelé de façon intensive. Au lieu de ça, la taille de la vidéo n'est enregistrée que lorsqu'on relève la touche (cf. dans la fichier `KeyUpAndDown.js` le détail de cette implémentation).

---------------------------------------------------------------------

## Essais/travail du code {#travail_code_sandbox_run}

Pour faciliter le travail, on peut utiliser `Sandbox.run` qui est appelée quand l'application est prête. Dans la méthode `run` de la Sandbox — qui se trouve dans le fichier `./js/system.sandbox.js` — on définit le code à ajouter.

Par exemple, quand je travaillais sur le MiniWriter, plutôt que de chaque fois lancer l'application, afficher les events, choisir un event, le mettre en édition, activer l'option « Utiliser le Mini-Writer pour les textes » et cliquer sur le champ contenu du premier event, j'ai utilisé :

```javascript
Sandbox.run = function(){
  current_analyse.editEvent(0)
  MiniWriter.new(DGet('event-0-content'))
}
```


## Chargement de dossier de modules {#loading_modules_folders}

On peut charger des modules en inscrivant leur balise `<script>` dans le document grâce à la méthode `System.loadJSFolders(mainFolder, subFolders, fn_callback)`.

L'avantage de ce système — contrairement à `require` —, c'est que tout le contenu du code est exposé à l'application. Si une classe `FADocument` est définie, elle sera utilisable partout, à commencer par les modules chargés.

C'est cette formule qu'on utilise par exemple pour charger le *FAWriter* qui permet de rédiger les textes.

### Chargement de dossiers JS au lancement de l'application {#load_folders_at_launching}

Grâce au module `system/App.js`, on peut charger des dossiers javascript sans les coder en dur dans le fichier HTML de l'application.

Il suffit de les inscrire dans la constante `AppLoader::REQUIRED_MODULES` et ils sont chargés de façon asynchrone.

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



## Ajout de préférences globales (appelées aussi "options globales") {#add_global_prefs}

Ces préférences sont définies dans le menu « Options » jusqu'à définition contraire.

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

3. Demander le réglage de l'option, au chargement de l'application, dans le fichier `.../main-process/Prefs.js:170` :

```javascript

  // dans .../main-process/Prefs.js

  , setMenusPrefs(){
      //...

      ObjMenus.getMenu('<id_indispensable_et_universel>').checked = this.get('<id_indispensable_et_universel>')
      // En considérant que le menu et l'id de l'option sont identiques, ce
      // qui est préférable.
    }

```

Si la valeur par défaut doit être false, il n'y a rien d'autres à faire. Sinon, il faut définir sa valeur par défaut dans `Prefs` (fichier `.../main-process/Prefs.js:140` comme ci-dessus) :

```javascript

  // dans .../js/main-process/Prefs.js
  loadUserPrefs:function(){
    //...
    } else {
      this.userPrefs = {
        //...
        '<id_indispensable_et_universel>': true
      }
    }
  }

```

### Utilisation des préférences globales {#use_global_prefs}

Pour connaitre la valeur d'une option globale, on utilise la même méthode que pour les options de l'analyse :

```javascript

var opt = current_analyse.options.get('<id de l’option>')

```

### Ajout de préférence analyse {#add_analyse_pref}

1. Dans le fichier `./app/js/system/Options.js`, ajouter l'option à la donnée `Options.DEFAULT_DATA`.

2. Demander le réglage de l'option dans `FAnalyse#setOptionsInMenus` dans le fichier `common/FAnalyse.js` en s'inspirant des autres options.

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

… puis en appelant la méthode `BtnToggleNext.observe(cont)` où `cont` est le set jQuery qui contient le bouton en question.

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


## Documents de l'analyse {#documents_analyse}

Les documents de l'analyse sont entièrement gérés, au niveau de l'écriture, par les modules contenus dans le dossier `./app/js/composants/faWriter`. Ce dossier est le premier qui a été chargé par la nouvelle méthode `System#loadJSFolders` (par le biais de `FAnalyse.loadWriter`) qui travaille avec des balises `<script>` afin d'exposer facilement tous les objets, constantes et autres.

Ces documents permettent de construire l'analyse de deux façons différentes :

* en les rédigeant dans le *FAWriter* (qui s'ouvre grâce au menu « Documents »)
* en en créant le code de façon dynamique pour ce qui est des stats, des PFA et autres notes au fil du texte.

### Quatre types de documents {#les_types_de_documents}

Il faut comprendre qu'il y a 4 types de documents, même s'ils sont tous accessibles depuis le menu « Documents » de l'application.

1. Les documents entièrement rédigés, littéraires (introduction, synopsis). Ils peuvent être coller tels quels dans l'analyse, grâce à la commande `FILE` du [script d'assemblage][].
2. Les documents partiellement rédigés et partiellement automatisés (Fondamentales, Annexes avec les statistiques, etc.)
3. Les documents entièrement automatisés (PFA, au fil du film, scénier) qui se servent d'informations éparses — p.e. la définition des nœuds structurels au fil du film — pour se construire.
4. Les documents de données (snippets, diminutifs, infos du film et de l'analyse)


### Sauvegarde protégée des documents {#saving_protected}

La sauvegarde protégée des documents est gérée par `system/IOFile.js`. L'utilisation est simple : on crée une instance `IOFile` du document en envoyant son path et on peut le sauver et le charger en utilisant `<instance>.save()` et `<instance>.loadIfExists()`.

@usage complet :

```javascript

  let iofile = new IOFile(cheminFichier[, objetProprietaire])

  [iofile.code = monCodeFinal // si objetProprietaire n'est pas défini]
  iofile.save({after: methode_appelee_apres_save})

  function methode_appelee_apres_load(code){
    // ...
  }

  iofile.loadIfExists(aflter: methode_appelee_apres_load_avec_code)

```

Pour fonctionner avec un `owner` (un propriétaire — une instance, un objet), il faut que ce propriétaire possède les propriétés `path` définissant le chemin d'accès au fichier ainsi que la propriété `contents` ou la propriété `code` définissant son code final à sauver.

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

Pour assembler l'analyse, l'application se sert principalement de la classe `FABuilder` et de la classe `FAExporter`.

## Script d'assemblage {#script_assemblage_analyse}

Le « script d'assemblage » définit la façon d'assembler les différents composants de l'analyse pour composer le document final.

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
