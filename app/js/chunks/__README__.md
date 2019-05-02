# chunks

Ce dossier permet de réduire la quantité de code dans les modules, en séparant les codes qui ne sont pas utilisés souvent (qui peuvent même être supprimés après avoir servi).

On ne peut l'utiliser, pour le moment, que pour les méthodes d'instance.

Soit la classe `maClasse`.

Soit une méthode de cette classe qui s'appelle `maMethode`

```javascript
class maClasse {
  maMethode(){

  }
}
```

Plutôt que de définir le code dans la méthode, on le définit dans :

```

  ./app/js/chunks/maClasse/maMethode.js

```

Donc dans ce dossier.

Dans la classe, la méthode se réduit à :

```javascript
class maClasse {
  maMethode(args){
    (this._maMethode||requiredChunk(this,'maMethode'))(args)
    // éventuellement :
    this._maMethode = null
  }
}
```

Dans le fichier `..../chunks/maClasse/maMethode.js`, on définit :

```javascript

  'use strict'

  let maMethode /* ou autre nom */ = function(args){
    this.property = "propriété de l'instance"
    var my = this
    $(buttons).each(function(o){ o.on('click', my.fonctionClick) })
  }

  module.exports = maMethode /* ou autre nom */

```

Noter que le `let maMethode` permet de faire une recherche sur la définition de cette méthode, de façon plus simple.
