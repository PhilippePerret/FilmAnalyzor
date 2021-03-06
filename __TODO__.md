# SUR LE GRILL

### Traiter :

RÉFLEXIONS SUR LES FITests
- Ne pourrait-on pas distinguer les opérations des vérifications ? Ça ne changerait pas grand-chose au niveau programmation peut-être, mais ça pourrait éclaircir le code.
  Un autre avantage serait qu'on pourrait mettre les choses dans l'ordre qu'on voudrait. L'application de tests appellerait toujours dans l'ordre : `preliminaires`, `tests_preliminaires`, `operation`, `verification`, mais on pourrait, dans la définition du case, commencer par la vérification, ensuite mettre l'opération et seulement à la fin les préliminaires, qui sont moins importants que le reste.
Par exemple :

```javascript

      this.case("Un cas étudié", async () => {
          preliminaires(() => {
            /* ... les préliminaires à exécuter */
            })
          tests_preliminaires( () => {
            /* ... les tests à faire sur l'état initial */
          })

          await operation( async () => {
            /* ... L'opération proprement dite */
          })

          verifications( () => {
            /* les vérifications après l'opération */
          })

        })

```

* Garder toujours le curseur visible dans le banc-timeline (faire l'essai en zoomant et en passant du début à la fin du film)

* Traiter les observeurs de keyup/keydown différemment en fonction du propriétaire (rappel : l'observer de mutations met dans la propriété "data-owner-id" l'identifiant du DOMElement qui contient le champ de saisie. C'est 'writer' lorsque c'est le writer)

Faire un controleur pour chaque partie de l'interface et notamment pour la colonne de droite qui doit s'ouvrir/se refermer, recevoir un élément à afficher, etc.
  - FAIT Il faut maintenant l'utiliser.

* Documenter la façon de charger un tool complexe (ou même n'importe quel objet) en utilisant la technique de mode_banc_timeline.js : on définit l'objet (const BancTimeline = {...}) puis on requiert tous les éléments du dossier en faisant :
  Object.assign(BancTimeline, require('./dossier/fichier'))
On peut même imaginer avoir plusieurs objets et plusieurs dossiers à l'intérieur du dossier principal.
Par exemple :

```javascript

  // Fichier principal tool/montool.js
  const MaClasse = {/* ... */}
  const MaSousClasse = {/* ... */}

```

Puis, dans un dossier `tool/montool/ma_classe` :

```javascript

  module.exports = {
    /* extenstion de MaClasse */
  }

```

Dans le fichier principal :

```javascript

Object.assign(MaClasse, require('./montool/ma_classe/fichier'))

Object.assign(MaSousClasse, require('./montool/ma_sous_classe/fichier'))

```

Avec possibilité de boucle pour charger tous les fichiers voulus.


* BAN TIMELINE
  - Faire le menu "Banc Timeline" en reprenant TOUS les raccourcis
  - Implémenter les méthodes onkeyup et onkeydown lorsque l'on est dans des champs d'édition (reprendre les méthodes utilisées ailleurs et les mettre dans `banc_timeline/observers_methods.js`)

* Script d'assemblage
  - traiter les brins (pouvoir les glisser depuis la liste)
    + mettre juste un élément, seulement clickable, pour l'explication, dans la liste
  - voir comment on peut faire des "blocs" si nécessaire
  - traiter l'insertion d'images (on doit pouvoir les glisser de puis leur liste, mais alors, pourquoi ne pas faire ça avec le reste ?)

* Banctimeline
  - surveiller onresize de la fenêtre principale et recalculer la taille de l'interface
  - pouvoir déplacer les events (drag) et changer leur temps (resize)

  - Raccourci pour passer en revue les stop-points

* Puisque System.loadTruc inscrit des balises <script> dans le document, on peut l'utiliser pour charger tous les scripts, sans avoir à faire de require et toute la complication qui va avec

- Réimplémenter le check des résolutions des QRD pour qu'il se fasse seulement quand toutes les classes sont chargées — + quand on vient d'en créer une. Il faut appeler `FAEqrd#checkResolution()`. Voir aussi sur les procédés à résolution ?

* DATAEDITOR
  - Faire un fichier pfa alt (les mettre dans min.js)
  - Faire la même chose pour les variables ?

* CHECK ANALYSE
  - Poursuivre le check de la validité des données (app/js/tools/analyse_checker.js)

* Poursuivre l'utilisation de first_requirements.js pour retirer du code dans analyser.html

* Quand l'analyse de Her sera suffisamment conséquente, on s'en servira pour avoir une analyse de test qui contienne à peu près tout. Notamment pour tester les sorties, les affichages.

- Checker la résolution quand on modifie le procédé (pour le moment, ça n'est traité à la création et à l'instanciation)
  - Si la résolution ne commence pas par une balise de temps, il faut considérer que c'est l'explication de la non résolution.

* HANDTESTS
  - Il faut créer le test de la création de chaque type d'event. Peut-être qu'on peut même l'automatiser presque entièrement avec les hand-tests.
    - traitement des expressions régulières ('{{event:0}} de type {{type:note}}')
  - [Implémentation] Bien documenter l'utilisation des expressions régulières dans les étapes de tests
    - se servir de `ouvrir l'analyse`
    - bien documenter l'utilisation de l'asynchronicité avec un `return null` qui
      interrompt le test, et la méthode qui doit donc explicitement appeler les
      marques de réussite ou d'échec (HandTests.markSuccess/markFailure)
  - Poursuivre le traitement des vérifications (check) automatiques avec les `{{sujet:sujet_id}}`.


* Mettre en place aussi des checks pour les procédés pour qu'il y ait tout, au final : installation (toujours obligatoire) et résolution (payoff) (peut-être les afficher comme les QRD, en bas à droite)
  - les procédés particuliers sans résolution doivent s'inscrire en bas à droite

* Développer l'objet `FAStats` utilisé pour la première fois pour les brins (FABrin#stats)
  - mais aussi : `scenesCount`
  -> L'utiliser pour tous les objets qui peuvent l'utiliser

* [AMÉLIORATIONS]
  - En fait, il faut jouer sur les `asTruc` pour faire des formatages différents, et jouer sur les `options` pour demander l'affichage ou non des notes. Pour les notes, il faut envoyer un `option.notes: false` pour qu'elles ne soient pas affichées (déjà implémenté)
  - construction du graphique de la dynamique narrative
    liste des OOC
  - Pour les décors, il faudra compter le temps général du décor principal, et le temps des sous-décors

* [ESSAIS]
  - Poursuivre les essais de javascript dans les ebooks en utilisant un lien vers un autre endroit du livre. Si ça ne fonctionne pas, développer les liens hypertextuels normaux.

* [VÉRIFICATIONS]

* PUBLICATION
  - Bien étudier la documentation de Calibre (ebook-convert) pour savoir comment régler la page de couverture, les données, etc.

* ASSEMBLAGE DE L'ANALYSE
  =======================
  + Indiquer : les films étrangers — américains, coréens, espagnol, danois, etc. — sont toujours visionnés et analysés dans leur langue originale dans le respect de l’effort sonore artistique initial.
    => Mention dans le script d'assemblage
    Comme le script d'assemblage devient un peu complexe, essayer un truc qui fonctionnerait par élément qu'on glisserait déposerait.
  + Rappels :
    - S'inspirer du scénier pour tout gérer :
    - Mettre toujours un id dans les titres de chapitres
    - Mettre des sections, comme section#scenier, section#fondamentales, etc. mais "sortir" les titres, sinon ils n'apparaitraient pas dans la toc.
  - Utiliser la méthode FADocument::findAssociations pour récupérer les associations avec des documents et les traiter dans l'affichage.
  - Réfléchir aux liens (qui pour le moment fonctionnent avec des méthodes javascript `show<Thing>`). Il faudrait, dans l'idéal, pouvoir conduire quelque part et revenir. Si l'on part du principe qu'un objet ne peut pas être trop lié, on peut avoir `[1]` qui conduit à la référence `[1]` et la référence `[1]` qui ramène au lien. Dans l'idéal, un bouton 'revenir', programmé par javascript, permettrait de revenir :
    - quand on clique sur `[12]`, ça appelle une méthode javascript qui :
      + conduit à la référence `12` (disons une scène dans le scénier final)
      + définit le retour dans la référence `12` pour qu'il ramène là où on a cliqué.

* Pour l'estimation de l'avancée de l'analyse :
  On pourrait imaginer que chaque composant calcule lui-même, lorsqu'il est édité, son niveau d'avancement et l'enregistre dans un fichier qui sera lu tout simplement par la barre d'état.
  Par exemple, lorsque l'on édite les fondamentales, elles s'autoévaluent par rapport aux données fournies.
  Cela permettrait :
    - d'avoir une évaluation beaucoup plus fine
    - de ne pas être obligé de tout recharger pour estimer l'avancée
  => Imaginer une classe AutoEvaluator qui appelerait, pour chaque composant, une méthode 'autoEvaluate' qui retournerait :
    - une valeur globale de pourcentage
    - des descriptions plus précises de ce qui est fait et ce qui
      reste à faire.
    - ces valeurs seraient enregistrées


# EN COURS DE DÉVELOPPEMENT

* faire les styles associés aux liens utilisant ces méthodes (`lktime`, `lkscene`, `lkevent`, `lkdoc`). Mais attention : ne pas en faire trop. Discrète différence.

* Pour la FATimeline
  - faire des instances FACursor

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.

# TODO LIST

* Une procédure de fix de l'analyse, lorsqu'elle comporte de graves erreurs. Ça peut arriver par exemple lorsqu'on définit des events et des brins associés, et qu'on oublie d'enregistrer les events de l'analyse.
  Ça ne doit plus se produire avec l'enregistrement automatique de l'analyse

* Développer le protocole d'analyse avec la possibilité d'avoir le détail de la démarche à adopter.

* Quand il y a un trop grand nombre de rapports, détruire les plus anciens
  -> Checker à chaque ouverture de l'analyse.

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Rapports (class FAReport). Pouvoir recharger des rapports qui se trouvent dans le dossier 'reports' de l'analyse.
* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps

* Script d'assemblage : pouvoir insérer une image avec `IMAGE <image path>`
  - Corriger dans FAEvent
  -> documenter
  - Sinon, dans un document, l'insérer en markdown normal : `![alt iamge](path/to/image.format)`

* Faire un fichier `metadata.yml` pour les métadonnées du livre (pour les epubs fait avec pandoc)

* Développer l'affichage de l'état de l'analyse (la version détaillée).
  - voir aussi la note sur le fait que chaque élément puisse produire sa propre analyse de son état.

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type). Ou les deux.

* Mettre en place un système de Tips qui s'afficheront au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**
  - Et si on imaginait des div qui n'apparaissent que lorsqu'on presse la touche MÉTA ? En fonction du contexte, on les ajoute partout où il faut dans le document, tout le temps.

* On doit pouvoir changer la taille horizontale/verticale des flying-windows (deux pictos, peut-être ajoutés dans le 'header' du code construit dans le owner, qui permettent de le faire ? ou alors une bordure plus grande ?)

* Implémenter la redéfinition des temps des events lorsqu'un temps de début de film est redéfini.

* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)



# PEUT-ÊTRE UN JOUR

* Pouvoir entrer l'année de l'histoire et définir les âges des personnages en donnant leur date de naissance.
* API qui permettrait de récupérer les data des films online (au format json).
