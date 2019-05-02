# Film Analyzer
# Manuel d'utilisation

* [Présentation générale](#presentation_generale)
* [Videos](#concernant_la_video)
  * [Taille de la vidéo](#video_size)
* [L'analyse de film](#lanalyse)
  * [Protocole d'analyse](#analyse_protocole)
  * [Verrouillage de l'analyse](#verrouillage_analyse)
* [Les Events](#les_events)
  * [Création des « Events »](#create_events)
  * [Les events « Scènes »](#les_events_scenes)
    * [Décors dans les events « Scènes »](#decors_in_scenes)
  * [Les events « Notes »](#les_events_notes)
* [Gestion des temps](#gestion_des_temps)
  * [Déplacements à l'aide de la Timeline](#move_with_timeline)
  * [Déplacements par parties/zones](#move_by_parts_and_zones)
  * [Passer en revue les 3 derniers points d'arrêt](#passe_revue_stop_points)
  * [Récupération du temps courant](#get_current_time)
  * [Réglage du temps et de la durée de l'event](#set_event_time)
    * [Réglage du temps](#reglage_du_point_temporel)
    * [Réglage de la durée](#reglage_de_la_duree)
    * [Réglage de la durée des scènes](#reglage_de_la_duree_des_scenes)
* [L'Interface](#linterface)
  * [Fonction « One-Key-Pressed »](#one_key_pressed_feature)
  * [Indication des parties et zones courantes](#indication_parties_zones_courantes)
  * [Comportement du bouton STOP](#le_bouton_stop)
  * [Se déplacer rapidement à une scène particulière](#move_to_a_scene)
* [Définir le Paradigme de Field Augmenté du film](#define_film_pfa)
* [Les Documents](#les_documents)
  * [Quatre types de documents](#types_de_documents)
  * [Diminutifs](#les_diminutifs)
  * [Variables dans les documents](#variables_dans_les_documents)
  * [Les snippets](#les_snippets)
  * [Rédaction des documents](#redaction_documents)
* [Assemblage de l'analyse finale](#assemblage_analyse)
* [Publication online](#publication_online)

Ce manuel décrit l'utilisation de l'application **FilmAnalyse** qui permet d'effectuer avec confort — et plus que ça — des analyses de films.

## Présentation générale {#presentation_generale}

## Videos {#concernant_la_video}

Les vidéos utilisées peuvent être au format `mp4`, `ogg` et `webm`.

Si la durée de la vidéo est inférieure à 30 secondes environ, il y aura des problèmes au niveau des affichages. Il est bon, en règle générale, de choisir des vidéos d'au moins une minute.

### Taille de la vidéo {#video_size}

On peut régler la taille de la vidéo à l'aide des sous-menus du menu « Vidéo > Taille > ». On trouve dans cette partie des réglages standard, « Petite », « Normale » ou « Large », ou un réglage personnalisé fin.

Pour régler la vidéo très facilement à la taille voulue, on peut utiliser aussi [la fonctionnalité « One-Key-Pressed »](#one_key_pressed_feature) (« Une touche pressée ») :

* maintenir la touche « v » appuyée
* jouer sur les flèches HAUT et BAS pour augmenter ou réduire respectivement la taille.

Noter que cette taille sera enregistrée avec l'analyse et qu'elle sera donc appliquée chaque fois que l'analyse sera chargée. Cela signifie aussi que chaque analyse peut posséder sa propre taille de vidéo.

---------------------------------------------------------------------


## L'analyse de film {#lanalyse}

L'*analyse de film* est le but ultime de l'application **Film Analyzer**, avec une orientation précise pour les eBooks.

### Protocole d'analyse {#analyse_protocole}

Grâce au menu « Affichage > Protocole de l'analyse », on peut avoir une idée de la démarche à suivre pour produire une analyse de film et son livre.

### Verrouillage de l'analyse {#verrouillage_analyse}

Pour ne perdre aucune donnée ou ne pas modifier l'analyse lorsque par exemple on la fait lire à quelqu'un d'autre ou on la partage par l'application, on peut verrouiller les données grâce au menu « Analyse > Verrouiller ».

Cela empêche tout modification des données, à commencer par les *events* et les documents.

---------------------------------------------------------------------

## Les Events {#les_events}

Dans **Film Analyzer**, l'*Event* est l'élément de base, l'*atome* de l'analyse. Il signifie « évènement » en français, mais on préfère la version courte anglaise.

On pourrait dire que *tout est event* dans **Film Analyzer**. Un procédé est un event, une scène est un event, une note est un event, etc.

### Création des « Events » {#create_events}

Pour créer les *events*, on peut utiliser les boutons qui se trouvent en bas à gauche de la fenêtre, ou les menus dans « Event > Nouveau > … » ou les raccourcis clavier à base de `ALT-CMD` (on trouve dans les menus les lettres qui correspondent à chaque event, mais de façon générale, c'est la première lettre).

Une fois une de ces procédures adoptées, le formulaire de l'event s'ouvre et il suffit de le remplir.

### Les events « Scènes » {#les_events_scenes}

Ils permettent de définir les scènes du film. Ce sont des *events* particulier dans le sens où leurs informations sont très particulières (effet, lieu, etc.) et ils sont souvent les conteneurs d'autres éléments.

La scène, à la base, se définit par un *pitch* et un *résumé*. À la création de la scène, on remarque que le pitch, à mesure qu'on le rentre, se copie dans le résumé de la scène. Cela a une incidence directe sur l'affichage : si le résumé commence exactement comme le pitch, ce pitch n'est pas ajouté dans l'affichage complet des scènes. En revanche, il permet d'en faire un affichage réduit.

#### Décors dans les events « Scènes » {#decors_in_scenes}

On choisit le décor et le sous-décor de la scène à l'aide de deux menus qui se peuplent dynamiquement en fonction des lieux ajoutés. Un nouveau lieu principal est créé dès qu'un nouveau décor est entré dans le champ (attention, cette valeur est sensible à la casse, ce qui signifie que le décor « Maison » est totalement différent du décor « maison »). Idem pour les sous-décors.

On peut indiquer **deux décors** ou plus pour une même scène en utilisant le signe esperluette (« & »). La procédure la plus simple est la suivante :

* choisir le premier décor/sous-décor,
* => il s'inscrit dans le champ
* ajouter '&' à la fin du champ
* choisir le second décor/sous-décor,
* => il s'ajoute au premier décor/sous-décor
* répéter l'opération avec tous les décors voulus.

Noter que pour une scène qui contient plusieurs décors/sous-décors, chacun d'entre eux se partagera le temps en fonction du nombre total de décors/sous-décors. Par exemple, si la scène se passe dans deux décors différents, chacun d'eux « héritera » de la moitié du temps de la scène. Si trois sous-décors composent la scène, chaque sous-décor se partagera un tiers du temps de la scène. Etc.

### Les events « Notes » {#les_events_notes}

Les events de type « notes » sont des events particuliers puisqu'ils s'affichent comme des notes dans un texte, c'est-à-dire avec un indice en exposant après un mot, qui renvoie à une définition ou une explication plus bas — normalement en pied de page.

On utilise cependant ces notes de la même manière que pour les autres types d'event :

* on crée la note au temps voulu,
* on place le curseur dans le texte de l'autre event que la note doit affecter,
* on glisse la note — par exemple depuis le reader — sur le champ de texte.

Une marque `{{event:XXX}}` est alors insérée à l'endroit du curseur, qui sera remplacé lors de la compilation par l'indice de la note en exposant, et la note — ou *les* notes seront inscrites sont le texte concerné.

---------------------------------------------------------------------

## Gestion des temps {#gestion_des_temps}

### Déplacements à l'aide de la Timeline {#move_with_timeline}

Le moyen le plus rapide pour se déplacer dans le film — donc dans la vidéo — est sans doute la « Timeline », la ligne de temps.

On peut l'afficher en activant le menu « Affichage > Timeline » (ou en jouant CMD-MAJ-T).

![Image de la Timeline]()

La Timeline se présente comme une longue bande représentant l'écoulement le temps, du départ du film à gauche à la fin à droite. Il suffit de glisser la souris sur la partie inférieure de cette bande pour se déplacer dans le temps.

### Déplacements par parties/zones {#move_by_parts_and_zones}

À côté de l'horloge principale de la vidéo se trouve l'[indication des parties et zones](#indication_parties_zones_courantes) dans lesquelles on se trouve. Pour passer d'une partie à l'autre, on peut cliquer sur le nom, soit en haut (grands actes), soit en bas (zones), en fonction du paradigme absolu (à gauche) ou du paradigment relatif (à droite) s'il est défini.

En tenant la touche `CMD` pressée, on parcourt les parties et les zones en arrière.


### Passer en revue les 3 derniers points d'arrêt {#passe_revue_stop_points}

![Points d'arrêt](../app/img/btns-controller/btn-points-arrets.png)

Ce bouton permet de passer en revue les trois derniers points d'arrêt de la vidéo.

 *stricto sensu*, il s'agit en fait des trois points de redémarrage. Donc, pour les définir, il suffit de choisir la position précise à l'arrêt, puis de cliquer sur le bouton PLAY.

 > Note : ces trois points d'arrêt sont enregistrés dans les données de l'analyse et peuvent donc être retrouvés en rechargeant l'analyse.

 #### Verrouillage des points d'arrêt

 Plus pratique encore, on peut décider de verrouiller ces points d'arrêt, pour qu'ils ne soient pas remplacés par de nouveaux points d'arrêts si l'on redémarre le film à une autre position. Pour se faire, il suffit que l'option « Verrouillage des points d'arrêt » soit cochée dans les options.

### Récupération du temps courant {#get_current_time}

Pour coller rapidement un temps courant dans un champ d'édition, il suffit de cliquer sur le bouton « Temps courant » qui affiche le résultat et le colle dans le presse-papier.

Mais il y a même plus simple en glissant la vidéo (qui se transforme en horloge) sur le champ de saisie voulu. Cela place une balise `{{time: <le temps>}}` qui sera ensuite formatée convenablement suivant le support voulu.

Ou, si l'on se trouve dans un champ d'édition du formulaire, il suffit de jouer la combinaison clavier `CMD T`.

### Réglage du temps de l'event {#set_event_time}

#### Réglage du temps {#reglage_du_point_temporel}

Pour éditer le temps d'un event — i.e. le modifier, on peut s'y prendre de cette manière :

* éditer l'event en cliquant sur son bouton d'édition dans sa ligne d'outil dans le reader,
* cliquer sur l'horloge de position et déplacer la souris — horizontalement — pour changer le temps. Noter que la vidéo se change en conséquence
* utiliser la touche MAJ appuyée pour se déplacer rapidement dans le temps,
* utiliser la touche CTRL appuyée pour régler en finesse le temps,
* double-cliquer sur l'horloge pour remettre le temps initial (permet aussi, à l'ouverture du formulaire, de rejoindre tout de suite l'event dans le film),
* relâcher la souris lorsque le bon temps est trouvé,
* enregistrer les changements.

#### Réglage de la durée {#reglage_de_la_duree}

On peut régler la durée d'un event quelconque en modifiant son horloge de durée, de la même manière que pour l'horloge :

* éditer l'event en cliquant sur son bouton d'édition dans le lecteur (ou autre affichage de l'event),
* cliquer dans l'horloge de durée et déplacer la souris horizontalement pour changer le temps,
* la vidéo suit la fin de la durée, par caler précisément le temps,
* utiliser la touche MAJ appuyée pour se déplacer rapidement dans le temps,
* utiliser la touche CTRL appuyée pour régler en finesse le temps,
* relâcher la souris lorsque la bonne durée est trouvée,
* enregistrer les changements en cliquant sur le bouton adéquat.

#### Réglage de la durée des scènes {#reglage_de_la_duree_des_scenes}

Si l'option « Calcul automatique de la durée des scènes » est coché dans le menu « Options », le calcul de la durée des scènes se fait automatiquement à la création des scènes. Dès que la scène N est créée, on calcule la durée de la scène N-1 d'après son temps.

---------------------------------------------------------------------

## Interface {#linterface}

### Fonction « One-Key-Pressed » {#one_key_pressed_feature}

La fonctionnalité « One Key Pressed » (littéralement « Une touche pressée ») permet de régler un grand nombre de choses en maintenant une touche pressée.

Note : pour le moment (04/2019), cette fonctionnalité n'est utilisée que pour modifier la taille de la vidéo à l'aide de "v" appuyée et les touches flèche haut/bas.

### Indication des parties et zones courantes {#indication_parties_zones_courantes}

À côté de l'horloge principale de la vidée se trouve l'indication de la partie (haut) et de la zone (bas) dans laquelle on se trouve dans le film. La première colonne, à gauche, indique les parties et les zones de façon absolue, dans le Paradigme de Field Augmenté, tandis que la seconde, à droite, indique ces parties et ces zones par rapport au film courant, si ces éléments sont définis.

Voir comment se [déplacer par parties/zones](#move_by_parts_and_zones) grâce à ces indications, en cliquant dessus.


### Comportement du bouton STOP {#le_bouton_stop}

Le bouton STOP a trois comportement différents, dans l'ordre de priorité :

1. la première pression ramène au temps de départ précédent — et s'arrête,
2. la deuxième pression ramène au début du film, s'il est défini,
3. la troisième pression ramène au début de la vidéo.


### Se déplacer rapidement à une scène particulière {#move_to_a_scene}

Pour se déplacer rapidement à une scène particulière, le mieux est d'utiliser l'*Eventers* qui affiche, par défaut, toutes les scènes :

* ouvrir l'*Eventer* par le menu « Events > Nouvel eventer… » (ou faire `CMD MAJ E`),
* trouver la scène dans le listing qui s'affiche,
* cliquer sur son petit bouton play dans les outils au-dessus de la scène.

---------------------------------------------------------------------

## Définir le Paradigme de Field Augmenté du film {#define_film_pfa}

Pour définir le PFA du film, on crée des events de type **Nœud STT**. Il suffit de choisir le type du nœud dans le premier menu et de décrire en quoi le temps courant correspond au nœud concerné.

Une fois suffisamment de nœud définis, on peut demander l'affichage du paradigme en actionnant le menu « Affichage > Paradigme de Field Augmenté ».


## Les Documents {#les_documents}

Une analyse, en plus des [events][] qui permettent de définir des éléments précis du film, est composée de [documents](#types_de_documents) de types différents. On peut tous les atteindre depuis le menu « Documents » de l'application **Film-Analyzer**.

### Quatre types de documents {#types_de_documents}

Il faut comprendre qu'il y a 4 types de documents, même s'ils sont tous accessibles depuis le menu « Documents » de l'application.

1. **Documents TEXTUELS**. Ce sont des documents entièrement rédigés, littéraires (introduction, synopsis). Ils peuvent être coller tels quels dans l'analyse, grâce à la commande `FILE` du [script d'assemblage][].
2. **Documents SEMI-TEXTUELS**. Les documents partiellement rédigés et partiellement automatisés (Fondamentales, Annexes avec les statistiques, etc.)
3. **Documents AUTOMATISÉS**. Les documents entièrement automatisés (PFA, au fil du film, scénier) qui se servent d'informations éparses — p.e. la définition des nœuds structurels au fil du film — pour se construire.
4. **Documents DATA**. Les documents de données (snippets, diminutifs, infos du film et de l'analyse)

Quels que soient les documents textuels, leur toute première ligne doit définir leur titre, après un signe dièse (« # »).

Tous les documents peuvent utiliser des [variables](#variables_dans_les_documents) ou des [diminutifs](#les_diminutifs) qui simplifient grandement la rédaction et évitent certaines erreurs.


### Les Diminutifs {#les_diminutifs}

Les diminutifs du film, par exemple les noms de personnage, se définissent dans le document « Diminutifs » qu'on peut atteindre par le menu « Documents ».

Dans le texte, il suffit de précéder ce diminutif d'un arobase.

Si l'on définit le diminutif suivant dans `diminutifs.yaml` :

```yaml

diM_24: |
  Un diminutif peut contenir des lettres maj/min, des chiffres
  et le caractère underscore.
DIM_24: Il est sensible à la casse

```
Alors on peut utiliser dans le texte :

```text

  C'est @dim_24 et @DIM_24.

```

… qui sera remplacé par :

```text

  C'est Un diminutif peut contenir des lettres maj/min, des chiffres
  et le caractère underscore et Il est sensible à la casse.

```

### Variables dans les documents {#variables_dans_les_documents}

On peut placer des variables dans les documents à l'aide de la syntaxe :

```markdown

  {{variable-name}}

```

Ces variables concernent en tout premier lieu les données générales de l'analyse. Ils sont définis dans le document « Documents > Informations »

On trouve par exemple :

`{{title}}`
: Titre complet du film

`{{authors}}`
: Auteurs du film.
: Ce sont des noms formatés séparés par des virgules.

`{{analystes}}`
: Analystes du film.
: Ce sont des noms formatés séparés par des virgules.

`{{date}}`
: Date du film.

Mais on peut trouver dans ce document toutes les variables qu'on jugera utile pour l'analyse courante.

### Les snippets {#les_snippets}

Les snippets permettent de rédiger beaucoup plus vite le texte en permettant d'écrire le simple début d'un mot, et d'en obtenir la suite en jouant la touche TABULATION. Par exemple, si le snippet `f:film` est défini, il suffit de taper « f » suivi de la touche TABULATION pour écrire « film ».

Les snippets se définissent dans le document de même nom, qu'on peut atteindre par le menu « Documents ». On en définit autant qu'on veut, pour chaque analyse. Si l'on veut utiliser les snippets d'une autre analyse, il suffit de l'ouvrir et de copier-coller le code des snippets dans la nouvelle.

### Rédaction des documents {#redaction_documents}

Le `Writer` de l'application permet de rédiger tous les documents de l'analyse. Il suffit de le choisir dans le menu « Documents » et il s'ouvre en édition. Tous les [types de documents](#types_de_documents) peuvent s'ouvrir de cette manière.

On utilisera des [variables](#variables_dans_les_documents) les [diminutifs](#les_diminutifs) et les [snippets](#les_snippets) pour se faciliter l'écriture et éviter certaines erreurs.

Pour faire référence à des *events* de tout type, il suffit de prendre ces *events* et de les glisser dans le texte. Une référence sera écrite au curseur. La nature et l'aspect de cette référence est fonction du type de l'*event* et peut varier beaucoup d'un type à l'autre. On reconnait les balises à leur forme `{{event: <id de l'event>}}`. Si l'*event* est une scène, il apparaitra de cette manière : `{{scene: <id event>}}` (noter que ça n'est pas le *numéro de la scène*, mais bien l'*identifiant de l'event* qui est inscrit).

ASTUCE : On peut voir tout de suite l'aspect que prendra la référence — et la modifier au besoin — en demandant la visualisation en direct du texte (case à cocher « Visualiser » dans le pied de page du `Writer`).

## Assemblage de l'analyse finale {#assemblage_analyse}

L'assemblage de l'analyse finale se fait à partir du *script d'assemblage* défini dans les documents. S'il n'est pas défini, c'est le script par défaut qui sera utilisé (`./app/analyse_files/building_script.md`).

Chaque ligne de ce *script d'assemblage* définit une commande à jouer. Cette commande est composée de la commande elle-même, qui est toujours le premier mot en majuscule, suivi des arguments à utiliser.

Les deux premières type sont :

* `FILE`. Elle permet d'inclure un texte dans l'analyse à l'endroit voulu.
* `BUILD`. Elle demande la construction d'un composant de l'analyse, tel que le paradigme de Field, le diagramme dramatique ou autres statistiques.

### Commande `FILE`

En argument de la commande `FILE`, on peut trouver tous les types de document du menu des documents. On pourra donc faire, par exemple :

```
FILE Introduction
FILE Lecon_tiree
```

En fait, ces fichiers se trouvent dans le dossier `analyse_files` de l'analyse. Tout fichier contenu par ce dossier peut être inclus de cette manière dans l'analyse. S'il existe par exemple un fichier s'appelant `grande_note.md`, alors on pourra utiliser la commande :

```
FILE Introduction
FILE grande_note
FILE Lecon_tiree
```

… pour le charger à l'endroit voulu dans le fichier, ici entre l'introduction et la leçon tirée du film. Toute hiérarchie peut être utilisée, si les documents se trouvent dans des sous-dossiers. Par exemple :

```
FILE dossier1/sous-dossier2/mon_fichier_markdown
```

La seule exigence pour le moment est que le fichier doit être au format Markdown (étendu).

## Publication online {#publication_online}

Sur Kindle, la page de couverture ne doit pas être jointe au .mobi. Elle doit être :

* format JPEG ou TIFF
* ratio hauteur:largeur de 1.6:1 (c'est-à-dire 1600 en hauteur pour 1000 en largeur)
  Préconisé : 2560px x 1600px (mais 4500 pour les tablettes…)
* < 50Mo
* Détail : [Aide KDP](https://kdp.amazon.com/fr_FR/help/topic/G200645690)

Taille recommandé par Apple (à vérifier) :

*  1400x1873 pixels

Rapport pour les smartphones :

* 11/18

Pour la couverture de l'epub :

* cover.jpg (obligatoire)
* 600 x 1000 environ
