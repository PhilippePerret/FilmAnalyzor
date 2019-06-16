# Manuel des tests

* [Introduction](#introduction)
* [Configurer les tests](#configurer_les_tests)
* [Définition d'une feuille de test](#define_test_sheet)
* [Liste des tests à lancer](#tests_list)
* [Exécutions avant et après les tests](#before_and_after_tests)
* [Textes écrits dans le suivi](#textes_suivis)
* [Les Assertions](#les_assertions)
  * [Création d'assertions](#create_new_assertions)
    * [Options des assertions](#options_of_assert_function)
* [Méthodes pratiques](#les_methodes_pratiques)
* [Textes écrits dans le suivi](#textes_suivis)
  * [Cas entièrement à implémenter (`pending`)](#pending)
  * [Test à implémenter plus tard (`tester`)](#test_to_define)
  * [Exécution d'une action (`action`)](#exec_action)

# Introduction {#introduction}

Pour utiliser les FIT-Tests (persos) comme ici, on doit :

* mettre le dossier `TestsFIT` dans un dossier librairie de l'application,
* le requérir avec `require("./path/to/fitests/folder/")`.
* définir dans le fichier `TestsFIT/config.json` la configuration et notamment le dossier qui contient les tests. cf. [Configurer les tests](#configurer_les_tests)
* Dans `package.json` de l'application, on ajoute :
  ```javascript
  "scripts":{
    //...
    "testsfits": "MODE_TEST=true npm start"
    //...
  }
  ```
* On peut définir dans `./support/` les fichiers et méthodes utiles aux tests de l'application courante.
* On définit la méthode `App.runtests()` de cette manière (on peut définir une autre méthode dans un autre objet, mais alors il devra être accessible et utilisé pour lancer les tests) :
  ```javascript
  App.runtests = function(){
      if ( NONE === typeof(Tests) ) {
        return System.loadComponant('TestsFIT', this.runTests.bind(this))
      } else {
        Tests.MAINFOLDER = path.join(APPFOLDER,'app','js','composants','TestsFIT')
      }
      Tests.initAndRun()
    }
  ```
* On définit les tests dans le dossier `TEST_FOLDER` désigné dans les `config.js`.

#### Pour lancer les tests :

Le plus simple est de faire une menu qui appelle la méthode `App.runtests()`.

On lance l'application et on ouvre la console dev dans laquelle on tape :

```bash

  App.runtests()

```

Note : le fichier `config.js` va permettre de filtrer les tests à passer. Cf. [Liste des tests à lancer](#tests_list) pour le détail.

---------------------------------------------------------------------

## Configurer les tests {#configurer_les_tests}

On configure les tests dans le fichier `FITests/config.json`.

`TEST_FOLDER`
: Dossier général contenant tous les tests de l'application.
: Par défaut c'est un dossier `__TestsFIT__` à la racine de l'application.

`onlyFolders`
: Liste des seuls dossiers, dans `TEST_FOLDER`, qu'il faut traiter.
: Ou null.

`random`
: Si true, les tests et les cas sont traités en ordre aléatoire.
: Noter que pour les cas, ce sont seulement les cas d'un même test qui sont mélangés.

`fail-fast`
: Si true, les tests s'arrêtent à la première failure rencontrée. Sinon, on va jusqu'au bout des tests.

`regFiles`
: Expression régulière à utiliser pour filtrer les fichiers de test.
: Elle sera escapée, dont inutile de le faire.

`regNames`
: Expression régulière à utiliser pour filtrer les tests à jouer.

`regCases`
: Expression régulière à utiliser pour filtrer les cas à jouer.
: On peut utiliser par exemple "ONLY" et ajouter « ONLY » au seul cas qu'on veut traiter pour ne traiter que lui.


---------------------------------------------------------------------

## Définition d'une feuille de test {#define_test_sheet}

On appelle « feuille de test » un fichier `js` définissant le ou les tests à exécuter pour un cas particulier (ou toute l'application, si elle est simplissime).

La structure de ce fichier est :

```javascript
'use strict'

var t = new Test("Le titre du test (affiché en titre)")

t.case("Un cas particulier du test", async () => {
  // ici les tests et assertions
})

t.case("Un autre cas particulier du test, asynchrone", () => {
  // Ici les tests des autres cas

  // Pour gérer l'asynchronicité
  await expect(domId).toExistsInDom({success: 'Le truc existe', onlySuccess:true})
  // ... on poursuit les tests avec…

})

t.case("Un cas avec une attente", async () => {

  await wait(2000)
  // Le code à exécuter 2 secondes plus tard

})

// etc.

module.exports = [t]

```

Noter, dans le deuxième et le troisième cas, l'utilisation d'une fonction `async` pour pouvoir utiliser `await`.

## Les Assertions {#les_assertions}

Les assertions s'utilisent de cette manière :

```javascript

  expect(<sujet>).<to be|have|...>(<quelque chose>)

```

Par exemple, pour tester qu'une fonction existe pour un objet :

```javascript

  expect(object).toHaveFunction('functionName')
```

Toutes les assertions utilisables sont définies dans le dossier `required/Expect/`, dans des fichiers dont le nom commence par `assertions`.

On peut définir dans le fichier `assertions_app.js` les assertions propres à l'application testée.

### Création d'assertions {#create_new_assertions}


* dans sa dernière partie elle invoque la méthode générique `assert` qui attend ces arguments :
    ```javascript
    assert(
        condition
      , "<message si condition true>" // ou `false` pour ne pas mettre de message
      , "<message si condition false"
      [, options]
    )
    ```
Les options peuvent déterminer par exemple que le message ne doit s'afficher que si la condition est `false`.

Par exemple, si je veux définir :

```javascript

  expect(actual).toEqual(expected)

```

J'implémente :

```javascript


TODO : À FAIRE

  assert(
      conditionTrue
    , options.success || `${actual} est bien égal à ${expected}`
    , options.failure || `${actual} devrait être égal à ${expected}`
    , options
  )
}
```

### Options des assertions {#options_of_assert_function}

`onlyFailure`
: si `true`, le succès reste silencieux, seul la failure écrit un message.

`onlySuccess`
: si `true`, la failure reste silencieuse, seul le succès écrit un message.

On peut aussi mettre explicitement `success:false` ou `failure:false` dans les options (dernier argument de l'assertion) pour indiquer de ne pas écrire de message.


## Méthodes pratiques {#les_methodes_pratiques}

### wait(`<durée>`, `<message>`)

Permet d'attendre avant de poursuite.

```javascript

t.case("Un cas d'attente", async function(){
  // ...

  await wait(3000, "J'attends 3 secondes")
  //... on peut poursuivre 3 secondes plus tard

})

```

### Méthode `waitFor`

Attend qu'une condition soit vraie (premier argument) avant de poursuivre.

```javascript

  waitFor(this_condition_must_be_true[, options])
  .then(fn_poursuivre)
  .catch(fn_error)

```

`options` peut définir un `timeout` qui produira une erreur s'il est atteint. Sinon, on utilise le timeout général défini (`Tests.TIMEOUT`).


### Méthodes pratiques sur les fichiers/dossier {#handy_method_on_files}

`removeFile(<fpath>[, <humanName>])`
: Permet de détruire le fichier `fpath` désigné par `humanName`.
: Par exemple : `removeFile('./mon/fichier.js', "Mon fichier")`
: Note : la fonction produit une erreur fatale si le fichier n'a pas pu être détruit.

## Liste des tests à lancer {#tests_list}

Pour filtrer les tests à lancer, on se sert du fichier `config.js`

La propriété `config.onlyFolders` permet de définir les seuls dossiers à traiter. C'est une liste de chemins relatifs depuis le `TEST_FOLDER`.

La propriété `{RegExp} config.regFiles` permet de définir une expression régulière pour filtrer les noms de fichiers.

La propriété `{RegExp} config.regNames` permet de définir une expression régulière pour filtrer les noms de tests (définis quand on instancie un nouveau test avec `new Test("<nom du test>")`).


## Exécutions avant et après la suite entière de tests {#before_and_after_tests}

Pour le code à évaluer avant le test courant, voir [exécution avant et après le test courant](#before_and_after_testseul)

Pour définir le code à jouer avant ou après l'ensemble de la suite de **tous les tests**, on utilise, *dans n'importe quel fichier test*, la méthode `beforeTests` et `afterTests`.

Par exemple :

```javascript
'use strict'

// Mon premier test

beforeTests(function(){
  // ... ici le code à exécuter avant tous les tests
})
afterTests(()=>{
  // ... ici le code à exécuter après la suite de tous les tests
})
```

Noter que si la méthode est appelée à deux endroits différents, une exception sera levée pour prévenir les comportements inattendus.

Si la méthode `beforeTests` retourne une promesse, les tests ne seront lancés qu'à l'exécution de ce code beforeTests. Cela permet, par exemple, de charger de grosses données avant de commencer (un film par exemple).

> Noter que si le fichier définissant ces codes n'est pas chargé car filtré, les méthodes ne seront pas invoquées. Cf. l'astuce ci-dessous pour palier cet inconvénient.

Astuce : le plus simple est de définir ces méthodes dans un fichier du dossier `TestsFIT/support`, car ces fichiers sont toujours chargés.

## Exécution avant et après le test courant {#before_and_after_testseul}

Pour jouer du code avant et après la feuille de test courant, le test courant, utiliser :
```javascript

  var t = new Test("mon test")
  t.beforeTest(<promesse>)
  t.case(...)
  t.case(...)
  t.afterTest(<promesse>)

```

Le cas classique, dans Film-Analyzer, consiste à charger une analyse de film avant de procéder aux tests. On procède ainsi :

```javascript

var t = new Test("Mon test sur une analyse")

t.beforeTest(FITAnalyse.load.bind(FITAnalyse, 'dossier/test'))

t.case("Premier test", ()=>{
  //... Je peux exécuter ici un tests sur l'analyse chargée, après son
  //... chargement.
})

```

## Textes écrits dans le suivi {#textes_suivis}

En dehors des messages des assertions elles-mêmes, on peut trouver ces textes dans le suivi du tests :

* [Cas entièrement à implémenter (`pending`)](#pending)
* [Test à implémenter plus tard (`tester`)](#test_to_define)
* [Exécution d'une action (`action`)](#exec_action)
<!-- Reporter aussi au-dessus si ajout -->

### Cas entièrement à implémenter (`pending`) {#pending}

On utilise le mot-clé-fonction `pending` pour déterminer un cas entièrement à implémenter.

```javascript

  t.case("Mon tests pas implémenté", ()=>{
    pending("Faire ce test plus tard")
  })
```

Noter que contrairement à [`tester`](#test_to_define), qui n'influence pas le résumé total des tests à la fin (sa couleur), ce `pending` empêche les tests de passer au vert.

### Test à implémenter plus tard (`tester`) {#test_to_define}

Lorsqu'un test ponctuel — à l'intérieur d'un cas long — est compliqué ou délicat et qu'on ne veut pas l'implémenter tout de suite, on peut le remplacer par le mot-clé-fonction `tester`.

```javascript
  tester("<message du test à faire>")
```

C'est le message `<message du test à faire>` qui apparaitra en rouge gras dans le suivi des tests, indiquant clairement que ce test sera à implémenter.

On peut se servir de ce mot-clé, par exemple, pour définir rapidement tous les tests à faire. Puis les implémenter dans un second temps.


### Exécution d'une action (`action`) {#exec_action}

Pour mettre en valeur une action à exécuter (et s'assurer qu'elle fonctionne), on peut utiliser le mot-clé-fonction `action` :

```javascript
  action("L'action que je dois faire", ()=>{
    // Le code de l'action, par exemple :
  })
```

Par exemple :

```javascript
  action("L'utilisateur clique sur le bouton OK", () => {
    $('#monBoutonOK').click()
  })
```

De cette manière, dans l'énoncé des tests, on peut suivre toutes les actions accomplies.