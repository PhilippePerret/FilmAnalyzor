# SUR LE GRILL

### Traiter :

  - Vérifier que les trois temps soient bien enregistrés (startFilmTime, endFilmTime et
    endGenericFilmTime — ou similaire)

* CHECK ANALYSE
  - Poursuivre le check de la validité des données (app/js/tools/analyse_checker.js)

* Quand l'analyse de Her sera suffisamment conséquente, on s'en servira pour avoir une analyse de test qui contienne à peu près tout. Notamment pour tester les sorties, les affichages.

- Checker la résolution quand on modifie le procédé (pour le moment, ça n'est traité à la création et à l'instanciation)
  - Si la résolution ne commence pas par une balise de temps, il faut considérer que c'est l'explication de la non résolution.


* [BUGS]
  cf. les listes sur ghi

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

* Développer la méthode `FAEvent.as('<format>', FLAG)` (et même *LES* méthodes as puisque tout élément possède maintenant cette méthode).
  Note : il faut la développer pour tous les types d'events (pour le moemnt, elle sert juste pour les scènes)

* PUBLICATION
  - Bien étudier la document de Calibre (ebook-convert) pour savoir comment régler la page de couverture, les données, etc.

* ASSEMBLAGE DE L'ANALYSE
  =======================
  + Indiquer : les films étrangers — américains, coréens, espagnol, danois, etc. — sont toujours visionnés et analysés dans leur langue originale dans le respect de l’effort sonore artistique initial.
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

* API qui permettrait de récupérer les data des films online (au format json).
