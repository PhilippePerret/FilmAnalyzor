'use strict'

FAPersonnage.dataEditor = {
  type: 'personnage'
/**
  Définition des champs d'édition d'un élément
**/
, dataFields: [
    {label:'Id', type:'text', prop:'id', exemple:'a-zA-Z_', required:true}
  , {label:'Pseudo', type:'text', prop:'pseudo', required:true}
  , {label:'Prénom', type:'text', prop:'prenom'}
  , {label:'Nom', type:'text', prop:'nom'}
  , {label:'Age(s)', type:'text', prop:'ages', exemple:'12 ou [23, 68]'}
  , {label:'Description', type:'textarea', prop:'description', validityMethod:null, required:true}
  , {label:'Dimensions', type:'textarea', prop:'dimensions', aide:'1 par ligne (&lt;type&gt;: &lt;description&gt;)', exemple:'religieuse: @T croit en Dieu.\nprofessionnelle: @T travaille pour lui.'}
  ]
/**
  Méthode qui sera appelée quand on enregistrement l'élément édité
**/
, onSave: function(){F.notify("Implémentation de la méthode onSave requise")}
, onRemove: function(){F.notify("Implémentation de la méthode onRemove requise")}

}
