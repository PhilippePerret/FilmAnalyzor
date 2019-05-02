'use strict'
/**
 * Les préférences, côté Renderer
 */

const Prefs = {
    class: 'Prefs'
    /**
      * Pour obtenir une ou des préférences.
      * +foo+ peut être :
      *  - une clé string de préférence.
      *  - une liste de clés ['<clé 1>', '<clé 2>',..., '<clé N>']
      *  - une table définissant les valeurs par défaut
      *    [crochet ouvrant]
      *       <clé 1>: <valeur 1>,
      *       <clé 2>: <valeur 2>,
      *       ...
      *    [crochet fermant]
      *
      * Dans les deux derniers cas, c'est la table qui est retournée. Pour le
      * premier, c'est simplement la valeur, ou undefined.
      */
  , get:function(foo){
      return ipc.sendSync('get-pref', foo)
    }
    /**
      * Définir les préférence.
      *
      * +tbl+ Soit une liste array avec
      *          [
      *            {key: <kpref>, type:<'user'|'analyse'>, value: <value>}
      *            {key: <kpref>, type:<'user'|'analyse'>, value: <value>}
      *            ...
      *          ]
      * Soit une table :
      *  {
      *     <kprey>:{type: <'user'|'analyse'>, value: <value>}
      *     <kprey>:{type: <'user'|'analyse'>, value: <value>}
      *     ...
      *   }
     */
  , set:function(tbl){
      // console.log("-> Prefs#set (renderer)", tbl)
      return ipc.sendSync('set-pref', tbl)
    }
}
