# Manuel des tests de l'application

* [Création d'une analyse pour les tests](#fixture_analyse)
  * [Obtenir les éléments de l'analyse-fixture](#get_elements_analyse)
* [Fixtures](#les_fixtures)
  * [Fixtures d'Events quelconque (`FITEvents<Type>`)](#fixtures_events)
  * [Fixtures Scènes `FITEventsScenes`](#fixtures_scenes)
  * [Fixtures Documents `FITDocuments`](#fixtures_documents)
  * [Fixtures Brins `FITBrins`](#fixtures_brins)
* [Composition de la donnée `associates`](#associates_data_composition)

## Création d'une analyse pour les tests {#fixture_analyse}

On crée une analyse-fixture — un dossier de fausse analyse — en créant une instance `FITAnalyse` en appelant la méthode `FITAnalyse.create()` :

```javascript

const ca = FITAnalyse.create()

```

Si la méthode `create` ne reçoit aucun argument comme ci-dessus, ce sera une analyse créée avec toutes les valeurs par défaut, et un nombre aléatoires d'éléments (events, brins, etc.).

Sinon, on peut définir toutes les valeurs en ajoutant un hash :

```javascript

const ca = FITAnalyse.create({
    folder: 'MonPremierTest'
  , events: 4 // ou la liste des events
  , // etc.
})

```

Les propriétés principales sont les suivants :

`folder`
: Nom du dossier de l'analyse fixture, dans `analyses/FITests/`

`title`
: Titre de l'analyse

`events`
: Liste `Array` des events (fixtures obtenues à l'aide de [FITEvents<Type>](#fixtures_events))
: OU nombre d'events quelconques à obtenir.

`scenes`
: Liste `Array` des scènes (fixtures obtenues à l'aide de `FITEventsScenes`)
: OU nombre de scènes quelconques à obtenir.

`notes`, `idees`, etc.
: Liste `Array` des types d'events précisés
: OU nombre de ces events.

`brins`
: Liste `Array` des brins (fixtures obtenues à l'aide de [`FITBrins`](#fixtures_brins))
: OU nombre de brins à obtenir.

`documents`
: Liste `Array` des documents (fixtures obtenues à l'aide de [`FITDocuments`](#fixtures_documents))


On peut également définir :

`path`
: Le path complet au dossier depuis la racine de l'application
: doit obligatoirement commencer par `analyses/FITests/`.
: Il est préférable d'utiliser `folder`

`version`
: Version courante de l'analyse (`0.0.1` par défaut).

`locked`
: Mettre à `true` si l'analyse doit être verrouillée.

`filmStartTime`
: Temps de début du film, en nombre de secondes.

`filmEndTime`
: Temps de fin du film, en nombre de secondes.
: La vidéo servant pour les tests durant 10 minutes, le temps maximal est 10 * 60 = `600`.

`videoPath`
: Path de la vidéo à utiliser. `../Drive-10mn-light.mp4` par défaut.

`lastCurrentTime`
: Dernier temps courant à la fermeture de l'analyse.

`stopPoints`
: Liste `Array` des trois derniers stop-points.


### Obtenir les éléments de l'analyse-fixture {#get_elements_analyse}

Cette partie décrit comment obtenir les brins, les documents, les events, etc. d'une analyse fixturée pour les tests, surtout lorsqu'elle a été créée sans aucune donnée.

On les obtient très facilement dans des listes (`Array`) à l'aide de :

```javascript

const ca = FITAnalyse.create()

ca.personnages  // => liste des FITPersonnages
ca.documents    // => liste des FITDocument
ca.brins        // => liste des FITBrin
ca.events       // => liste des FITEvent<Type>

```

> Bien noter que pour le moment, ce sont des listes, pas des dictionnaires.

---------------------------------------------------------------------

## Fixtures {#les_fixtures}

Des *factories* permettent de produire tous les éléments de l'analyse, pour les tests.

### Fixtures d'Events quelconque (`FITEvents<Type>`) {#fixtures_events}

On crée un event de type quelconque à l'aide de la formule :

```javascript

const e = new FITEvent<Type>()

```

Par exemple, pour une note :

```javascript

const e = new FITEventNote()

```

On peut ou non transmettre des données par un `hash` en premier paramètre :

```javascript

const e = new FITEventNote({prop:val, prop:val, ...})

```

Chaque type attend une liste propre de propriétés qui dépendent de sa classe dans l'application.

Les données communes sont :

`id`
: L'identifiant unique de l'event. Il vaut mieux le laisser calculer par la fixture elle-même.

`time`
: Le temps en secondes où se situe l'event (temps vidéo).

`titre`
: Le titre de l'event, pour son affichage simple.

`content`
: Le contenu textuel de l'event, souvent sa description.

`associates`
: Les éléments de l'analyse associés à l'event. Cf. [Composition de la donnée `associates`](#associates_data_composition)

### Fixtures Scènes `FITEventsScenes` {#fixtures_scenes}

### Fixtures Documents `FITDocuments` {#fixtures_documents}

Pour obtenir une fixture de document, il suffit de faire :

```javascript

const ca  = FITAnalyse.create()
const doc = FITDocument.create()

```

On peut aussi lui transmettre des données :

```javascript

const ca  = FITAnalyse.create()
const doc = FITDocument.create(ca, {
  titre: ...
  //...
})

```

… avec les données qui peuvent être :

`titre`
: Le titre du document, celui qui appartra en haut du texte, précédé par un dièse.

`contents`
: Le contenu textuel du document, hors du titre.

`filename`
: Le nom du fichier, mais seulement si c'est un document type, par exemple `introduction.md` (on peut omettre '.md').
: Dans le cas d'un custom-document, il faut laisser cette donnée vide afin que la classe puisse attribuer un numéro inexistant.

### Fixtures Brins `FITBrins` {#fixtures_brins}

Pour obtenir une fixture de brin, on utilise :

```javascript

const ca    = FITAnalyse.create()
const brin  = FITBrin.create(ca)

```

Noter que cela crée et enregistre le fichier `analyse_files/dbrins.yaml` qui consigne toutes les données des brins.

On peut définir des données avec :

```javascript

const ca    = FITAnalyse.create()
const brin  = FITBrin.create(ca, {
  id: ...
  //...
})

```

Les données qu'on peut définir sont :

`id`
: L'identifiant, un string du style `mon_identifiant`
: Note : il doit impérativement être unique. Il vaut mieux le laisser trouver par la fixture.

`titre`
: Le titre humain du brin

`type`
: L'ID du type du brin, existant ou non.
: Les types sont définis dans `./app/js/data/btypes_brins.yaml`.

`description`
: La description humaine (`String`) du brin.

`associates`
: Les éléments associés au brin. Cf. [Composition de la donnée `associates`](#associates_data_composition).


## [Composition de la donnée `associates` {#associates_data_composition}

La donnée `associates` qui peut être utilisée pour associer tout élément de l'analyse est un `hash` où la clé est le type singulier de l'élément (p.e. `document` ou `brin`) et la valeur la liste des identifiants des éléments en question.

Par exemple :

```javascript

associates:{
    'brin': ['lepremier','un_autre']
  , 'event': [12, 24, 345]
  , 'document': ['custom-23', 'introduction']
}

```

Au moment de la création de l'élément, ces associés ne doivent pas forcément exister, mais il faudra les créer à un moment ou à un autre. Sauf, bien entendu, si le test porte sur l'inexistance, justement, d'un associé.

Si les associés doivent être définis plus tard, on peut utiliser la méthode-propriété `associates` pour les définir :

```javascript

var ca = FITAnalyse.create()
var br = FITBrin.create(ca)
var el = FITDocument.create(ca)

br.associates = {'document': [el.id]}

```
