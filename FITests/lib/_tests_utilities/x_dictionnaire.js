'use strict'
/**
  Juste pour ajouter des explications
**/

/*
  @method assertion(..., options)
  @id options_assertions
  @description Contenu des `options`, dernier paramètre des assertions.
  @provided
    :success {String} Le message personnalisé à afficher en cas de succès.
    :failure {String} Le message personnalisé à afficher en cas d'échec.
    :ref {Boolean} Si true, on affiche la valeur et le type du sujet entre parenthèses après sa valeur humaine.
    :onlyReturn   {Boolean} Si true, aucun résultat de test n'est écrit, on renvoie simplement la valeur de l'assertion (`true` ou `false`).
    :onlyFailure  {Boolean} Si true, on ne produit un résultat qu'en cas d'échec
    :onlyFailure  {String}  Si défini, le message à afficher en cas d'échec. Pas de résultat en cas de succès.
    :onlySuccess  {Boolean} Si true, on ne produit un résultat qu'en cas de succès, pas d'échec.
    :onlySuccess {String} Si défini, le message à afficher en cas de succès, pas de résultat en cas d'échec.
  @usage expect(...).to(..., {onlyReturn:true})

 */
