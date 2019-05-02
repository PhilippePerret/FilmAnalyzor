'use strict'
/**
  Ce module n'est pas destiné à être introduit dans l'analyse, il sert
  à faire des essais de formatage est de mise en forme.

  Pour l'utiliser, tout ex-commenter dans le script d'assemblage et
  ajouter ou décommenter la ligne `BUILD test mef`.
  Puis lancer les commandes pour produire un PDF, un Kindle et un ePub.

**/

module.exports = function(options){
  var my = this
  my.log("* Production du document pour le test de la mise en page…")
  let str = ''

  // Les styles à tester
  str += `
<style type="text/css">
body {
  width:14.8cm;
  margin:0;
  background-color:white;
  border:1px dashed blue;
}

/* Avec des div flottants pour le label */
div.LVFloat {
  width:100%;
}
div.LVFloat > label:nth-child(1){
  display:block;
  float:left;
  width:2.5cm;
  background-color:#CCFFFF;
}
div.LVFloat > div:nth-child(2) {
  width:8.7cm;
  margin-left:3.1cm;
  background-color:#FFFFCC;
}

/* Avec un grid */
div.LVGrid {
  display:grid;
  grid-template-rows: auto;
  grid-template-columns: 70px 400px;
}
div.LVGrid > label {
  grid-row: 1;
  grid-column:1;
  background-color:pink;
}
div.LVGrid > span.value {
  grid-row:1;
  grid-column:2;
  background-color:stealblue;
}


/* Avec une fausse table */
div.table {
  display:table;
}
div.table > div {
  display:table-row;
}
div.table > div > div {
  display:table-cell;
  padding:4px 0;
}
div.table > div > div:nth-child(1) {
  width:60px;
  background-color:#CCFFCC;
}
div.table > div > div:nth-child(2) {
  width:400px;
  background-color:pink;
}

pre {
  font-family:monospace;
  font-size:10.7pt;
  white-space:pre;
}
svg text.label {
  max-width: 18%;
  word-wrap: break-word;
  display:block;
  background-color:pink;
}
svg text.value {
  max-width: 70%;
  word-wrap: break-word;
  display:block;
}
</style>
  `

  // Le code HTML
  str += `
<p class="explication">Je vais tester la mise en page.</p>
<p class="explication">Lancer la fabrication avec CMD-MAJ-A (ou le menu), et demander la sortie au format PDF, Kindle, ePub.</p>


<h1>Avec une image SVG</h1>
<svg width="100%" height="50">
  <text x="0" y="15" class="label">Un label</text>
  <text x="20%" y="15">La valeur</text>
</svg>
<svg width="100%" height="50">
  <text x="0" y="15" class="label">Un label un peu trop long</text>
  <text x="20%" y="15">La valeur très longue elle aussi pour voir comment elle va réagir au niveau des lignes.</text>
</svg>

<h1>Test avec le div 'libval normal' (inline-block)</h1>
<div class="libval normal">
  <label>Le label</label>
  <span class="value">La valeur</span>
</div>
<div class="libval normal">
  <label>Un label un peu trop long</label>
  <span class="value">Et une valeur beaucoup trop longue aussi qui devrait s'étirer sur plusieurs lignes et vraiment sur plusieurs lignes.</span>
</div>

<h1>Test avec le div en grid</h1>
<div class="LVGrid">
  <label>Le label</label>
  <span class="value">La valeur</span>
</div>
<div class="LVGrid">
  <label>Un label un peu trop long</label>
  <span class="value">Et une valeur beaucoup trop longue aussi qui devrait s'étirer sur plusieurs lignes et vraiment sur plusieurs lignes.</span>
</div>

<h1>Test avec le div display:table</h1>
<div class="table">
  <div>
    <div>Un label</div><div>Une valeur de cellule</div>
  </div>
  <div>
    <div>Un label trop grand</div><div>Une valeur de cellule très longue qui doit absolument déborder sur plusieurs lignes pour être vraiment appréciée à sa juste valeur.</div>
  </div>
</div>


<h1>Test avec un div flottant pour le label</h1>
<div class="LVFloat">
  <label>Le label</label>
  <div>La donnée</label>
</div>
<div class="LVFloat">
  <label>Le label trop long</label>
  <div>Une valeur très longue qui doit absolument déborder sur plusieurs lignes pour être vraiment appréciée à sa juste valeur.</div>
</div>


<h1>À l'« ancienne » (pre)</h1>

<pre>
18                  40
Un label            Une valeur
un label trop       Une valeur sur plusieurs lignes|
long qu'on coupe    pour voir comment ça passerait à
                    la ligne avec des valeurs comme|
                    ça.
</pre>

  `

  return str
}
