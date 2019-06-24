'use strict'

/**
  Pour requérir un module en ayant un backtrace en cas d'erreur.

  Le mieux est de toujours envoyé `__dirname` en second argument et de définir
  le +rpath+ en fonction de l'endroit courant.
      let maConstante = tryRequire('./insamefolder', __dirname)

**/
global.tryRequire = function(rpath, folder){
  try {
    isDefined(folder) && ( rpath = [folder,rpath].join(path.sep) )
    return require(rpath)
  } catch (e) {
    if ( NONE !== typeof(log) ) {
      log.error("[LOG] ERROR REQUIRE AVEC LE PATH", rpath)
      log.error(e)
    } else {
      console.error("[CONSOLE] ERROR REQUIRE AVEC LE PATH", rpath)
      console.error(e)
    }
  }
}

function confirm(msg, options){
  options = options || {}
  let mbox = new MessageBox(isString(msg) ? Object.assign(options, {message: msg}) : msg)
  mbox.show()
}
/**
  Contrairement à confirm, cette méthode s'utilise avec await :
  if ( await confirmer(...) ){'
    * Si on a choisi oui *
  }' else {'
    * si on a choisi non *
  }
**/
function confirmer(msg, options){
  options = options || {}
  let mbox = new MessageBox(isString(msg) ? Object.assign(options, {message: msg}) : msg)
  return new Promise((ok,ko)=>{
    mbox.methodOnOK =     () => {ok(true)}
    mbox.methodOnCancel = () => {ok(false)}
    mbox.show()
  })
}
// Demande une réponse
// On utilise `confirm` parce que la seule différence, c'est que `args`
// définit `defaultAnswer` qui permet de savoir que c'est un prompt
function prompt(msg, args){ return confirm(msg, args) }

window.isUndefined = function(foo){ return STRundefined === typeof(foo) }
// function isDefined(foo){ return false === isUndefined(foo) }
window.isDefined = function(foo){ return false === isUndefined(foo) }

window.isBoolean = function(foo){return STRboolean === typeof foo }
window.isNumber = function(foo){return STRnumber === typeof(foo)}
window.isNotNumber = function(foo){return false === isNumber(foo)}

window.isNull = function(foo){ return null === foo }
window.isNotNull = function(foo){ return isFalse(isNull(foo)) }
window.isNullish = function(foo){ return isNull(foo) || isUndefined(foo) }
window.isNotNullish = function(foo){ return false === isNullish(foo) }

window.isFalse = function(foo){ return false === foo }
window.isNotFalse = function(foo) { return isFalse(isFalse(foo))}
window.not = function(foo){ return false == foo }

window.isTrue = function(foo){ return true === foo }
window.isNotTrue = function(foo){return isFalse(isTrue(foo))}

window.isEmpty = function(foo){
  if(!foo) return true
  if(isDefined(foo.length) /* string ou array */){
    return 0 == foo.length
  } else if (isObject(foo)){
    return 0 == Object.keys(foo).length
  }
}
window.isNotEmpty = function(foo){
  if(!foo) return false
  return false === isEmpty(foo)}
window.isNotAscii = function(str){ return str.replace(/[a-zA-Z0-9_]/g,'') != '' }
window.isFunction = function(foo){ return STRfunction === typeof(foo) }
window.isNotFunction = function(foo){ return false === isFunction(foo) }
window.isString = function(foo)  { return STRstring === typeof(foo) }
window.isNotString = function(foo){return false === isString(foo)}
window.isObject = function(foo)  { return STRobject == typeof(foo) && !isArray(foo) }
window.isArray = function(foo)   { return Array.isArray(foo) }

// Fonction utiles pour le dom

window.isTextarea = function(foo){
  if(isDefined(foo.length)) foo = foo[0] // jquerySet
  if(isDefined(foo.tagName)) return foo.tagName === 'TEXTAREA'
  return false
}

/**
  Retourne false si l'élément +domE+ ne possède pas l'attribut +attr+ ou,
  si +valOpt+ est fourni, si la valeur n'est pas égale à cette valeur.

  @param {jqSet}  jqObj   Obligatoirement un set jQuery
  @param {String} attr    L'attribut recherché.
  @param {String} valOpt  La valeur optionnellement recherchée

  @return {Boolean|String} true/false ou la valeur de attr si +valOpt+ n'est pas
                            fourni.
**/
function isDOMElementWithAttribute(jqObj, attr, valOpt){
  if(isUndefined(jqObj)) return false
  if(isNotFunction(jqObj.attr)) return false
  if(isUndefined(jqObj.attr(attr))) return false
  if (isDefined(valOpt)){
    return jqObj.attr(attr) == valOpt
  } else {
    return jqObj.attr(attr)
  }
}

function asPourcentage(expected, actual){
  return `${pourcentage(expected,actual)} %`
}
function pourcentage(expected, actual){
  return Math.round(100 * (100 * actual / expected)) / 100
}

/**
 * Retourne la fonction voulue
 *
 * Note : pour le moment, ça ne fonctionne que pour des instances. Il faudrait
 * faire un test pour voir si bindee.constructor existe.
 *
 * @usage
    methode(arg1, arg2)CROCHET_OUVERT
      (this._methode || requireChunk(this, 'methode')).bind(this)(arg1, arg2)
    CROCHET_FERME

    La méthode doit être définie dans ./js/chunks/<this.constructor>/<methode>.js de
    la façon suivante :
    module.exports = function(arg1, arg2){
      //... code de la fonction
    }
    Pour la clarté
 */
function requiredChunk(bindee, methodName){
  bindee.constructor.prototype[`_${methodName}`] = require(`./js/chunks/${bindee.constructor.name}/${methodName}.js`)
  return bindee[`_${methodName}`].bind(bindee) // sera déjà bindée
}

/**
  * Pour pouvoir utiliser la tournure
    this._propriete || defP(this, '_propriete', valeur)
    return this._propriete
  */
window.defP = function(obj, prop, val){
  obj[prop] = val
  return val
}
// function defP(obj, prop, val){
//   obj[prop] = val
//   return val
// }

/**
  Remplace la tournure :
    if (undefined === objet.property) objet.property = default_value
  Et retourne la valeur de la propriété
  Note : quand c'est possible, préférer :
    `variable = variable || valeurDefaut`
**/
function defaultize(objet, property, default_value){
 isDefined(objet[property]) || ( objet[property] = default_value)
 return objet[property]
}

/**
 *
  Pour pouvoir utiliser des tournures comme :
    try {
      maCondition || raise(messageDerreur)
    } catch(e){
      console.log(e) // affiche le messageDerreur
    }
  … dans des blocs try

  Note : parce que `maCondition || throw(message d'erreur)` est
  impossible.
 */
function raise(msg){throw(msg)}

// Pour mettre dans le presse-papier
function clip(str){
  const { clipboard } = electron.remote
  clipboard.writeText(str) ;
  F.notify(`${str} -> presse-papier`)
};
/**
 * Méthode qui reçoit l'identifiant d'un élément DOM et retourne sa valeur
 * ou null s'il est vide.
 * Note : il faut impérativement passer un ID, avec ou sans le dièse.
 * +options+
 *  :type   Peut définir le format précis de retour, quand la donnée existe
 *          'number'  => retourne un Int
 *          'float'   => retourne un flottant
 *          'horloge'   =>  C'est une horloge (donc une balise <horloge>) et il
 *                          faut retourner le nombre de secondes et frames
 *          'duree'     =>  C'est une durée (donc une balise <duree>) et il
 *                          faut retourner des secondes et frames.
 */
function getValOrNull(domId, options){
  if(undefined === options) options = {}
  if(domId.substr(0,1)!='#') domId = `#${domId}`
  let field = $(`${domId}`)
    , domField = field[0]
  if(field.length === 0 || field.val() === null) return null

  var value ;
  switch (options.type) {
    case 'horloge':
    case 'duree':
      return parseFloat(field.attr('value'))
    default:
      try {
        if(field.is(':checkbox')){
          return field[0].checked ? field.val() : null
        } else {
          value = field.val().trim()
        }
      } catch (e) {
        console.error(`[getValOrNull] Impossible d'obtenir la valeur de ${domId} : `, e)
        return null
      }
  }
  return valOrNull(value)
}

function valOrNull(value, options){
  value = value.trim()
  if ( value === "" ) return null
  else if(options && options.type === 'number')  return parseInt(value,10)
  else if(options && options.type === 'float')   return parseFloat(value)
  return value
}

function DGet(DOMId){
  return document.getElementById(DOMId)
}

/**
  Faciliteur pour créer un élément DOM (qui est retourné)

  @param {String} typeElement     Le tag, en fait
  @param {Object} params          Définition de la balise. Avec :

      id      Identifiant à donner à l'élément
      class   La class CSS à appliquer
      style   L'attribut style
      inner   L'innerHTML, en dur
      append  Le ou les éléments DOM à ajouter
      value   La valeur, pour des OPTIONs par exemple
      attrs   Les attributs à définir (hash: attr: valeur, attr: valeur, ...)
              Si une valeur est strictement égale à NULL, l'attribut n'est pas
              inscrit (utile par exemple pour les checked)

  Pour obtenir un picto "?" qui doit afficher une aide, on utilise simplement :
  DCreate(AIDE, "Message d'aide à afficher, sans guillemets doubles droits.")

  Il faut que la méthode qui construit appelle UI.setPictosAide(<container>)

**/
function DCreate(typeElement, params){
  // console.log("DCreate params:", params)
  if ( typeElement === AIDE ) {
    typeElement = IMG
    params = {class:'picto-aide', alt:'?', src:'img/picto_info_dark.png', attrs:{'data-message':params}}
  }
  var e = document.createElement(typeElement)
  if(undefined === params) return e
  if(params.id)     e.id = params.id
  if(params.class)  e.className = params.class
  if(params.style)  e.setAttribute('style', params.style)
  if(params.type)   e.type = params.type
  if(params.inner)  e.innerHTML = params.inner
  if(params.src)    e.src = params.src
  if(params.alt)    e.setAttribute('alt', params.alt)
  if(undefined !== params.value)  e.value = params.value
  if(undefined !== params.disabled)  e.disabled = params.disabled
  if(params.append){
    if(Array.isArray(params.append)){
      params.append.forEach(el => e.appendChild(el))
    } else {
      e.appendChild(params.append)
    }
  }
  if(params.attrs){
    for(var attr in params.attrs){
      if(params.attrs[attr] === null) continue
      e.setAttribute(attr, params.attrs[attr])
    }
  }
  return e
}

/**
  Retourne un Helper (de drag) qu'il est sûr de garder au-dessus de tous
  les autres éléments
  Cf. le manuel de développement pour l'utilisation car c'est très particulier
**/
function DHelper(inner, data) {
  var hdata = {}
  for(var k in data){ hdata[`data-${k}`] = data[k]}
  let helper = DCreate(DIV,{class:'draghelper', inner:inner, attrs:hdata})
  $(document.body).append(helper)
  return helper
}
/**
  Retourne
**/
function DLibVal(obj, property, libelle, widths, options){
  let ghostProp = `_div${property}`
  if(undefined === obj[ghostProp] && obj[property]){
    if(undefined === libelle) libelle = property.titleize()
    let css = 'libval'
    if(options && options.class) css = `${css} ${options.class}`
    else if(undefined !== widths) css += ` ${widths /* p.e. w40-60 */}`
    else css += ' normal'
    obj[ghostProp] = DCreate('DIV', {class: css, append:[
        DCreate((widths ? SPAN : 'LABEL'), {class: (widths ? 'label' : null), inner: libelle})
      , DCreate(SPAN, {class:'value', inner: DFormater(obj[property])})
    ]})
  }
  return obj[ghostProp]
}

function zIndex(jqSet, zindex, opts){
  isDefined(opts) || (opts = {})
  jqSet.css('z-index', zindex)
  opts.deep && jqSet.find('*').css('z-index', zindex)
}


function DFormater(str, opts){
  if(isUndefined(FATexte._dformater)){
    let fatexte =  new FATexte('')
    FATexte._dformater = fatexte.formate.bind(fatexte)
  }
  return FATexte._dformater(`${str}`, opts)
}

/**
 * Pour rendre le selecteur +jqId+ visible (visibility)
 */
function toggleVisible(jqId, v){
  $(jqId).css('visibility', v ? STRvisible : STRhidden)
}

// Pour écouter un objet
// p.e. listen(btnPlay, STRclick, Controller, 'start')
function listen(cible, ename, objet, method, param){
  if('string'===typeof(cible)){cible = DGet(cible)}
  try {
    if(undefined === param){
      cible.addEventListener(ename, objet[method].bind(objet))
    } else {
      cible.addEventListener(ename, objet[method].bind(objet, param))
    }
  } catch (e) {
    console.error("Impossible d'écouter le DOM élément défini ci-dessous :", e)
    console.error({
      cible: cible, ename: ename, method: method, objet: objet, param: param
    })
  }
}
function listenClick(cible, objet, method, param){listen(cible,STRclick,objet,method, param)}
function listenMDown(cible, objet, method, param){listen(cible,'mousedown',objet,method, param)}
function listenMUp(cible, objet, method, param){listen(cible,'mouseup',objet,method, param)}


const $ = require('jquery')
$.fn.extend({
  insertAtCaret: function(myValue) {
    if(undefined === myValue || null === myValue) return
    this.each(function() {
      if (document.selection) {
        this.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      } else if (this.selectionStart || this.selectionStart == '0') {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) +
          myValue + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
    return this;
  }
});
