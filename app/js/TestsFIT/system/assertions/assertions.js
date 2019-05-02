'use strict'

/**
 * Assertions général

assert(<expression true>)
  Produit un succès si l'expression est vraie

 assert_error(<message>[, <type erreur>])
    Pour vérifier qu'une erreur a bien été produite.

assert_function(<fn name>[, <objet>])
    Produit un succès si <objet>.<fn name> est une fonction.
assert_object(<object name>[, <object])
  Produit un succès si <object|window>.<object name> est un objet (c'est vague)

assert_classes(<nodes>, <classes>) / inverse : assert_not_classes
    Pour vérifier que des éléments du DOM on la bonne classes

assert_position(<nodes>, <position>) / inverse : assert_not_position
    Pour vérifier que des éléments du DOM sont à la bonne position x et y

assert_visible(<node>)
 */
window.assert_function = function(fn_name, objet){
  var condition, ref ;
  if(undefined == objet){
    ref = fn_name;
    condition = fn_name && 'function' == typeof(objet[fn_name]);
  } else {
    if(objet.class){
      ref = `${objet.class}#${fn_name}`;
    } else if(objet.constructor.name) {
      ref = `${objet.constructor.name}#${fn_name}`;
    } else {
      ref = `${objet.name}`;
    }
    condition = objet && fn_name && 'function' == typeof(objet[fn_name])
  }
  assert(
    condition,
    `Right, ${ref} is a function`,
    `Hum… ${ref} should be a function (it's ${typeof(objet[fn_name])})`
  );
};
/**
 * Produit un succès si l'object +objet+ possède bien la propriété
 * +property_name+
 *
 */
window.assert_property = function(property_name, objet, options){
  assert(
      undefined !== objet[property_name]
    , `OK, ${property_name} is a property of ${objet}`
    , `Hum… ${property_name} should be a property of ${objet}…`
    , options
  )
}
window.assert_object = function(obj_name, objet, options){
  var condition, ref ;
  if(undefined == objet){
    ref = obj_name;
    condition = obj_name && 'object' == typeof(objet[obj_name]);
  } else {
    if(objet.class){
      ref = `${objet.class}#${obj_name}`;
    } else if(objet.constructor.name) {
      ref = `${objet.constructor.name}#${obj_name}`;
    } else {
      ref = `${objet.name}`;
    }
    condition = objet && obj_name && 'object' == typeof(objet[obj_name])
  }
  assert(
      condition
    , `Right, ${ref} is an object`
    , `Hum… ${ref} should be an object (it's ${typeof(objet[obj_name])})`
    , options
  );
};
// Produit un succès si l'appel à la fonction +fn+ ne produit pas d'erreur
// Un échec otherwise.
// Par exemple, si on veut tester que 'true = window' va générer une erreur,
// on peut faire : assert_no_erreur(function(){true=window})
window.assert_no_erreur = function(fn){
  try {
    fn();
    Tests.onSuccess("Aucune erreur générée.");
  } catch (err) {
    Tests.onFailure(`Une erreur a été générée : ${err}`);
  }
};
window.assert_error = function(err_msg, err_type){
  if (Array.isArray(err_msg)){
    // Plusieurs portions
    ret = matchErrors(err_msg) ;
    errs = err_msg.join(', ')
    assert(
        ret.ok
      , `Une erreur contenant « ${errs} » a bien été générée`
      , `Une erreur contenant « ${errs} » aurait dû être générée (pas trouvé : ${ret.not_found.join(', ')})`
    );
  } else {
    assert(
      matchError(err_msg, err_type),
      `L'erreur « ${err_msg} » a bien été générée.`,
      `L'erreur « ${err_msg} » aurait dû être générée.`
    );
  }
}
// Pour chercher plusieurs portions de message
window.matchErrors = function(err_msgs, err_type){
  var ret = {
    ok: true, not_found: new Array()
  }
  for(err of err_msgs){
    if (matchError(err, err_type)){continue};
    ret.ok = false ;
    ret.not_found.push(err);
  }
  return ret
}
window.matchError = function(err_msg, err_type){
  // console.log('-> matchError', err_msg);
  // console.log('Errors.messages.length:', Errors.messages.length);
  var rg = new RegExp(err_msg, 'i');
  for(var imsg = 0, len = Errors.messages.length; imsg < len ; ++ imsg){
    dmsg = Errors.messages[imsg] ;
    // console.log(dmsg);
    if (dmsg.msg.match(rg)) {
      if(undefined == err_type || dmsg.type == err_type){return true};
    }
  };
  return false ;
}

// Pour vérifier que des éléments DOM ont la bonne classe CSS
window.assert_classes = function(nodes, classes) {
  var i=0
    , icl=0
    , len
    , lencl
    , errs
    , node
    , classe
    , classes_str = classes.join(', ');
  if(undefined == nodes[0]){nodes = [nodes]};
  for(i,len=nodes.length;i<len;++i){
    node = nodes[i];
    errs = new Array();
    for(icl, lencl=classes.length;icl<lencl;++icl){
      classe = classes[icl];
      if($(node).hasClass(classe)){continue};
      errs.push(`le nœud ${node.id} devrait posséder la classe "${classe}" (sa class: "${node.className}")`);
    };
    assert(
      errs.length == 0,
      `le nœud ${node.id} possède les classes ${classes_str}`,
      errs.join(', ')
    );
 };
};
// Inverse de la précédente
window.assert_not_classes = function(nodes, classes) {
 var i=0, icl=0, errs = new Array(), node, classe ;
 if(undefined == nodes[0]){nodes = [nodes]}
 for(i,len=nodes.length;i<len;++i){
   node = nodes[i];
   for(icl, lencl=classes.length;icl<lencl;++icl){
     classe = classes[icl];
     if($(node).hasClass(classe)){
       errs.push(`le nœud ${node.id} ne devrait pas posséder la classe "${classe}").`);
       break;
     };
   };
   assert(
     errs.length == 0,
     `le nœud ${node.id} ne possède pas les classes`,
     errs.join(', ')
   );
 };
};


window.assert_isArray = function(foo, options){
  assert(
      Array.isArray(foo)
    , `OK, ${foo} est un Array`
    , `Hum… ${foo} devrait être un Array…`
    , options
  )
}
window.assert_isObject = function(foo, options){
  assert(
      (foo instanceof Object) === true
    , `OK, ${foo} est une table`
    , `Hum… ${foo} devrait être une table`
    , options
  )
}
