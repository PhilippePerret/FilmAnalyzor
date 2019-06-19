# Manuel des tests

* [Introduction](#introduction)
* [Utilisation des FITests](#utilisation)
* [Configurer les tests](#configurer_les_tests)
* [Définition d'une feuille de test](#define_test_sheet)
  * [Syntaxe `describe`](#describe_syntax)
  * [Mot clé `not`](#not_keyword)
  * [Mot clé `strictly`](#strictly_keyword)
  * [Les Assertions](#les_assertions)
* [Liste des tests à lancer](#tests_list)
* [Exécutions avant et après](#before_and_after_methods)
  * [Exécutions avant et après les tests](#before_and_after_tests)
  * [Exécution avant et après le test courant](#before_and_after_testseul)
  * [Code à exécuter avant ou après chaque cas](#before_and_after_each_case)
* [Textes écrits dans le suivi](#textes_suivis)
* [Les Assertions](#les_assertions)
  * [Création d'assertions](#create_new_assertions)
  * [Options des assertions](#options_assertions)
  * [Sujets complexes (`expect(sujet)`)](#complexes_subjects)
* [Méthodes pratiques](#les_methodes_pratiques)
  * [Simuler des touches clavier](#simulate_keyboard)
  * [Exécution d'une action (`action`)](#exec_action)
* [Textes écrits dans le suivi](#textes_suivis)
  * [Cas entièrement à implémenter (`pending`)](#pending)
  * [Test à implémenter plus tard (`tester`)](#test_to_define)

# Introduction {#introduction}

Les « FITests » (« From Inside Tests ») permettent de lancer des tests de l'intérieur même de l'application. De ce fait, leur utilisation est simplissime en regard des autres tests qui, pour les tests unitaires, d'intégration et fonctionnels nécessite toujours des réglages particuliers.

# Utilisation des FITests {#utilisation}

Pour utiliser les FIT-Tests (persos) comme ici, on doit :

* mettre le dossier `TestsFIT` dans un dossier librairie de l'application,
* le requérir avec `require("./path/to/fitests/folder/")`.
* créer un dossier `__TestsFIT__` à la racine de l'application pour définir les tests,
* définir dans le fichier `./__TestsFIT__/config.json` la configuration des tests. cf. [Configurer les tests](#configurer_les_tests)
* Dans `package.json` de l'application, on ajoute :
  ```javascript
  "scripts":{
    //...
    "testsfits": "MODE_TEST=true npm start"
    //...
  }
  ```
* On peut définir dans `./__TestsFIT__/support/` les fichiers et méthodes utiles aux tests de l'application courante.
* On définit la méthode `App.runtests()` de cette manière (on peut définir une autre méthode dans un autre objet, mais alors il devra être accessible et utilisé pour lancer les tests) :
  ```javascript
  App.runtests = function(){
      NONE === typeof(Tests) && ( global.Tests = require('./path/to/folder/fitests') )
      Tests.run()
    }
  ```
* On définit les tests dans le dossier `./__TestsFIT__/`.

#### Pour lancer les tests :

* Le plus simple est de faire un menu qui appelle la méthode `App.runtests()` (ou directement la méthode `Tests.run()` si l'objet `Tests` est déjà requis).
* On peut aussi lancer l'application et ouvrir la `console dev` dans laquelle on tape `App.runtests()`.

Note : le fichier `config.json` va permettre de filtrer les tests à passer. Cf. [Liste des tests à lancer](#tests_list) pour le détail. Pour le moment, on ne peut pas le faire en ligne de commande.

---------------------------------------------------------------------

## Configurer les tests {#configurer_les_tests}

On configure les tests dans le fichier `./__TestsFIT__/config.json`.

`onlyFolders`
: Liste des seuls dossiers, dans `./__TestsFIT__/`, qu'il faut traiter.
: Ou null.

`random`
: Si true, les tests et les cas sont traités en ordre aléatoire.
: Noter que pour les cas, ce sont seulement les cas d'un même test qui sont mélangés.

`fail_fast`
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

t.case("Un cas particulier du test", async /* [1] */ () => {
  // ici les tests et assertions
  // [1] Si le cas contient des assertions asynchrones ou des waits.
})

t.case("Un autre cas particulier du test, asynchrone", async () => {
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

Noter l'utilisation d'une fonction `async` pour pouvoir utiliser `await`.

### Syntaxe `describe` {#describe_syntax}

On peut utiliser aussi la syntaxe en `describe` qui ne nécessite pas d'export :

```javascript

describe("Nom du test", () => {

  this.before(() => {/* à faire au début (Promise) */})
  this.after(()=> {/* à faire à la fin (Promise) */})

  this.case("nom du cas", async () => {

    /* ... les tests ici ... */

  })

  this.case("Autre cas", async () => {
    //...
  })

})

```

### Mot clé `not` {#not_keyword}

On utilise le mot clé `not` pour inverser le sens de l'assertion.

```javascript

expect(2+6).equals(7)
// => échec

expect(2+6).not.equals(7)
// => succès

```

### Mot clé `strictly` {#strictly_keyword}

On utilise le mot clé `strictly` pour demander une comparaison stricte.

```javascript

expect('12').equals(12)
// => succès

expect('12').strictly.equals(12)
// => échec

```

## Les expectations {#les_expectations}

On appelle ici « expectation » la partie d'une assertion complète. Elle se résume à :

```javascript

expect(sujet[, options])

```

Le sujet peut être un [sujet complexe](#complexes_subjects) ou tout autre élément qui peut être comparé.

`options`, pour le moment, ne sert qu'à décrire comment sera présenté le sujet dans les messages. Au plus simple, on peut mettre simplement en string la valeur dont l'on veut voir désigner le sujet.

Par exemple :

```javascript

expect(2+2).is(4)
//=> écrit "4 est bien égal à 4"

expect(2+2,'2+2').is(4)
// ou
expect(2+2,{sujet:'2+2'}).is(4)
// => écrivent "2+2 est bien égal à 4"

```

## Les Assertions {#les_assertions}

Les assertions s'utilisent de cette manière :

```javascript

  expect(<sujet|valeur>).<assertion>(<valeur attendue>)

```

Par exemple, pour tester qu'une fonction existe pour un objet, on utilise l'assertion `responds_to` :

```javascript

  expect(object).responds_to('functionName')

```

Toutes les assertions utilisables sont définies dans le dossier `required/Assertions/`.

On peut définir dans le dossier `support/assertions` les assertions propres à l'application testée.


### Création d'assertions {#create_new_assertions}

On crée les nouvelles assertions, propres à toute l'application dans le dossier `__TestsFIT__/support`, à l'aide de :

```javascript

const MesAssertions = {
  uneAssertion(){
    //...
  }
, uneAutreAssertion(){
    //...
  }
}

FITExpectation.add(MesAssertions)

```

Noter qu'avec la définition ci-dessus, les assertions seront utilisables pour n'importe quel sujet. Pour faire des assertions propres à des sujets particuliers, utiliser les [sujets complexes](#complexes_subjects).

Ensuite, on peut tout simplement faire :

```javascript

describe("En utilisation mes assertions", function(){
  this.case("J'utilise la première", async () => {
    expect('monsujet').uneAssertion()
  })
  this.case("J'utilise la seconde", async () => {
    expect('monsujet').not.uneAutreAssertion({onlyFailure:true})
  })
  this.case("J'utilise la seconde", async () => {
    expect('monsujet').strictly.unestrict({onlySuccess:true})
  })
})
```

### Codage de l'assertion

Une assertion est composée de deux parties :

```javascript

affirmation(expected[, options]){
    /**
      Estimation, comparaison de la valeur actuelle et attendue
      éventuellement en fonction de 'not' et 'strictly'
      Cette partie doit définir `pass` qui sera TRUE si c'est un succès
      (quelle que soit la valeur de 'not') et FALSE si c'est un échec.
    **/
    const estimation = ...
    const pass = this.positive === estimation
    /**
      La deuxième partie produit l'assertion proprement dite, qui
      sera écrite dans le rapport d'erreur comme un succès ou un échec
      Le plus simple est de faire :
    **/
    const msgs = this.positivise('<verbe>', '<complément>')
    // => retourne un objet contenant l'affirmation pour un succès et pour
    //    un échec. Par exemple {success: 'est plus grand que'}, {failure
    //    'devrait être plus grand que'}.
    const expe = ... // on compose la valeur attendue
    // On compose le template pour faire les deux messages échec/succès
    const temp = `${this.subject} %{msg} ${expe}`
    const succ_msg = T(temp, {msg: msgs.success})
    const fail_msg = T(temp, {msg: msgs.failure})
    // Et finalement on appelle la méthode générique
    assert(pass, succ_msg, fail_msg, options)
}

```

Version encore plus courte :

```javascript

affirmation(expected, options){
  const esti = ...
  const pass = this.positive === esti
  const expe = ... // expected à écrire
  const msgs = this.assertise('<verbe>', '<complément>', this.subject, expe)
  assert(pass, ...msgs, options)
}

```

Les options peuvent déterminer si le message ne doit s'afficher que si la condition est `false`, pas exemple, avec `onlyFailure:true`. Cf. [Options des assertions](#options_assertions).

### Rédaction des messages positifs et négatifs

Pour simplifier la rédaction des messages de la méthode `assert`, on peut utiliser les méthodes `assertise` et `positivise` des instances de `FITExpectation` qui connait déjà un certain nombre de verbes. On lui envoie un verbe de base qu'elle doit connaitre (par exemple « est »), optionnellement un complément, et elle revoit les deux messages de succès (`success`) et d'échec (`failure`).

> Comme la méthode `positivise` est une méthode de l'instance `FITExpectation`, donc de l'expectation elle-même, elle sait si l'assertion est positive ou non et renvoie le message en conséquence.

Par exemple, avec une assertion négative (`not`) :

```javascript

this.positivise('est', 'égal à')

// => {
//      success: "n'est pas égal à"
//      failure: "ne devrait pas être égal à"
//    }
```


Je peux donc définir :

```javascript

  expect(actual).strictly_equals(expected)

```

J'implémente :

```javascript

equals(expected, options){
  const esti = this.strict ? (this.sujet === expected) : (this.sujet == expected)
  const pass = this.positive === esti
  const msgs = this.assertise('est', 'égal à', actual, expected)
  assert(pass, ...msgs, options)
}
```

### Options des assertions {#options_assertions}

> Note : pour les [sujets complexes](#complexes_subjects), on peut définir toutes ces valeurs dans la propriété `options`.

`onlyFailure`
: si `true`, le succès reste silencieux, seul la failure écrit un message.

`onlySuccess`
: si `true`, la failure reste silencieuse, seul le succès écrit un message.

`success`, `failure`
: On peut aussi mettre explicitement `success:false` ou `failure:false` dans les options (dernier argument de l'assertion) pour indiquer de ne pas écrire de message.

`noRef`
: si `true`, on n'indique pas la valeur du sujet dans certaines assertions.
: Par exemple, pour l'égalité, au lieu du message "La somme (2+2:number) est juste", on obtiendra "la somme est juste".


### Sujets complexes (`expect(sujet)`) {#complexes_subjects}

Les « sujets complexes » sont une des fonctionnalités les plus puissantes des *FITests*. Il permet de définir un comportement propre à l'application de façon très simple.

Les « sujets complexes » permettent de définir des sujets propres à l'application — donc des éléments à mettre en premier argument d'un `expect` — avec tout ce qu'il faut pour les estimer. Imaginons par exemple qu'une classe `EventForm` permette de générer des formulaires (instances). Soit `EventForm.current`, dans l'application, la propriété qui retourne l'instance du formulaire au premier plan, le formulaire courant. On peut faire un sujet de ce formulaire courant :

```javascript

// Dans un fichier de `__TestsFIT__/support/`
const sub = new FITSubject("Le formulaire courant")

global.CurrentForm = sub // pour l'exposer

```

On va pouvoir déterminer plusieurs propriétés de cet instance dont les plus générales sont :

* la valeur (le premier argument habituel de `expect`) : `sub.value = ...`
* le nom (à marquer dans les messages) : `sub.subject_message = "..."`
* les assertions : `sub.assertions = ... objet contenant les assertions`.
* Les options : `sub.options = {prop:value, prop:value, ...}`

Par exemple :

```javascript

const sub = new FITSubject("Mon formulaire courant")
sub.value = EventForm.current // retourne l'instance du formulaire courant
sub.subject_message = "Le formulaire courant"
sub.options = {noRef: true}
sub.assertions = {
  est_ouvert(){
    //... on teste pour voir s'il est ouvert
    assert(
      ok, ...
    )
  }
, est_bien_rempli(){
    // ...
  }
// etc.
}

```

Dans le cas où la valeur doit changer dynamiquement, on peut faire une sous-classe de `FITSubject`.

```javascript

class MonSousSujet extends FITSubject {
  constructor(){
    super(this.name)
    this.name = 'Mon sous-sujet'
    ///...
    this.value = // une valeur dynamique, par exemple la fenêtre courante
    this.assertions = {
      est_bien(){
        //...
        assert(/*...*/)
      }
    , est_avant(quoi){/* ... */}
    }
  }
}

Object.defineProperties(global,{
  // Créera une nouvelle instance à chaque appel
  MonSousSujet:{get(){return new MonSousSujet()}}
})

```

Il suffit ensuite de l'utiliser comme :

```javascript

  const subj = MonSousSujet // une instance toute fraiche, donc avec la fenêtre
  expect(subj).est_bien()
  expect(subj).est_avant('ca')
```

---------------------------------------------------------------------

## Méthodes pratiques {#les_methodes_pratiques}

### wait(`<durée>`, `<message>`)

Permet d'attendre avant de poursuite.

```javascript

t.case("Un cas d'attente", async () => {
  // ...

  await wait(3000, "J'attends 3 secondes")
  //... on peut poursuivre 3 secondes plus tard

})

```

### Méthode `waitFor`

Attend qu'une condition soit vraie (premier argument) avant de poursuivre.

```javascript

  await waitFor(this_condition_must_be_true[, options])

```

`options` peut définir un `timeout` qui produira une erreur s'il est atteint. Sinon, on utilise le timeout général défini (`Tests.TIMEOUT`).


### Méthodes pratiques sur les fichiers/dossier {#handy_method_on_files}

`removeFile(<fpath>[, <humanName>])`
: Permet de détruire le fichier `fpath` désigné par `humanName`.
: Par exemple : `removeFile('./mon/fichier.js', "Mon fichier")`
: Note : la fonction produit une erreur fatale si le fichier n'a pas pu être détruit.

## Liste des tests à lancer {#tests_list}

Pour filtrer les tests à lancer, on se sert du [fichier de configuration `config.json`](#configurer_les_tests).

## Exécutions avant et après {#before_and_after_methods}

Noter la simplicité du nommage :

* `before_tests` concerne le code à jouer avant tous les tests (`tests` au pluriel)
* `before_test` (ou `before`) concerne le code à jouer avant un test particulier (`test` au singulier)
* `before_case` concerne le code à jouer avant les cas (correspond au `before_each` des autres frameworks de test).

### Exécutions avant et après la suite entière de tests {#before_and_after_tests}

Pour le code à évaluer avant le test courant, voir [exécution avant et après le test courant](#before_and_after_testseul)

Pour définir le code à jouer avant ou après l'ensemble de la suite de **tous les tests**, on implémente les méthodes `beforeTests` et `afterTests` respectivement dans les fichiers `./__TestsFIT__/before_tests.js` et `./__TestsFIT__/after_tests.js`.

Par exemple :

```javascript

// Dans before_tests.js
'use strict'

module.exports = async /* ou pas */ () => {
  alert("Je dois afficher ça.")
}
```

Les deux méthodes, par défaut, sont considérées comme asynchrones.

Par exemple, pour attendre deux secondes avant de lancer les tests, permettant au testeur de mettre l'application au premier plan :

```javascript
// Dans ./__TestsFIT__/before_tests.js

'use strict'
module.exports = function(){
  Console.bluebold("Merci d'activer l'application")
  return new Promise((ok,ko)=> {setTimeout(ok,2000)})
  // ou :
  // return wait(2000)
}

```

### Exécution avant et après le test courant {#before_and_after_testseul}

Pour jouer du code avant et après la feuille de test courant, le test courant, utiliser les méthodes `after` (ou `after_test`) et `before` (ou `before_test`) :

```javascript

  var t = new Test("mon test")

  t.before(<promesse>)
  t.after(<promesse>)

  t.case(...)
  t.case(...)

```

Le cas classique, dans Film-Analyzer, consiste à charger une analyse de film avant de procéder aux tests. On procède ainsi :

```javascript

var t = new Test("Mon test sur une analyse")

t.before(FITAnalyse.load.bind(FITAnalyse, 'dossier/test'))

t.case("Premier test", ()=>{
  //... Je peux exécuter ici un tests sur l'analyse chargée, après son
  //... chargement.
})

```

### Code à exécuter avant ou après chaque cas {#before_and_after_each_case}

Pour exécuter du code asynchrone ou non avant et après chaque cas, on utilise les méthodes de test `before_case` et `after_case` :

```javascript

const test = new Test("Mon test")

test.before_case( () => { /* code à exécuter avant chaque cas */ })
test.after_case( () => { /* code à exécuter avant chaque cas */ })

```

## Simuler des touches clavier {#simulate_keyboard}

Pour simuler des touches clavier, on utilise :

```javascript

keyPress('<touche>'[, {options}])

keyUp(idem)

keyDown(idem)

```

On met dans les `options` les modifiers, par exemple `keyDown('n',{metaKey:true})`.

Pour des tests plus clairs, on peut les utiliser en combinaison des actions :

```javascript

action("On joue CMD+N puis on confirme avec la touche Entrée", ()=>{
    keyPress('n', {metaKey:true})
    keyPress('Enter')
  })

```

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

L'action peut être aussi asynchrone et doit alors être précédée du mot clé `await` :

```javascript

  await action("Je fais une action asynchrone", async () => {
    keyPress('n')
    wait(1000)
    keyPress('i')
  })

```


---------------------------------------------------------------------

## Textes écrits dans le suivi {#textes_suivis}

En dehors des messages des assertions elles-mêmes, on peut trouver ces textes dans le suivi du tests :

* [Cas entièrement à implémenter (`pending`)](#pending)
* [Test à implémenter plus tard (`tester`)](#test_to_define)
<!-- Reporter aussi au-dessus si ajout -->

### Cas entièrement à implémenter (`pending`) {#pending}

On utilise le mot-clé-fonction `pending` pour déterminer un cas entièrement à implémenter.

```javascript

  t.case("Mon tests pas implémenté", ()=>{
    pending("Faire ce test plus tard")
  })
```

> On peut ne rien mettre en paramètre, ce qui indiquera "TODO" dans les tests.

Noter que contrairement à [`tester`](#test_to_define), qui n'influence pas le résumé total des tests à la fin (sa couleur), ce `pending` empêche les tests de passer au vert.

### Test à implémenter plus tard (`tester`) {#test_to_define}

Lorsqu'un test ponctuel — à l'intérieur d'un cas long — est compliqué ou délicat et qu'on ne veut pas l'implémenter tout de suite, on peut le remplacer par le mot-clé-fonction `tester`.

```javascript
  tester("<message du test à faire>")
```

C'est le message `<message du test à faire>` qui apparaitra en rouge gras dans le suivi des tests, indiquant clairement que ce test sera à implémenter.

On peut se servir de ce mot-clé, par exemple, pour définir rapidement tous les tests à faire. Puis les implémenter dans un second temps.
