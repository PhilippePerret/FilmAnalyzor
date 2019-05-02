/**
Pour la gestion des messages affichés à l'écran
Version 1.0.4
Date    jan. 2019
Author  Philippe Perret <philippe.perret@yahoo.fr>
Alias : F

### 1.0.4
  Possibilité de cliquer sur une notification pour la fermer
  tout de suite.
### 1.0.3
    Pour empêcher d'utiliser la méthode `show` au lieu de `message` ou
  `notice`
### 1.0.2
  Notify peut recevoir duree:'auto' pour régler la longueur en fonction
  du contenu.

 */

const RC = `
`

const Flash = {
    built: false

  , onOK_method: null      // la méthode à appeler quand OK est cliqué (if any)
  , onCancel_method: null  // idem pour Renoncer
  //////////////////////////////////////////////////////////////////////////
  //  Méthodes d'affichage

  // Affiche d'une simple notification mais avec bouton pour
  // la fermer
  , notice: function(str){
      this.display(str, 'jqNotice');
    }
    /**
     * Une notification, donc un message qui se ferme tout seul
     *
     * +options+ peut définir :duree, la durée en secondes d'ouverture
     * du message (5 secondes par défaut). La valeur par défaut est 'auto',
     * qui permet de calculer le temps d'affichage en fonction de la longueur
     *
     * @alias: message
     */
  , notify: function(str, options){
      if(!options){options={}}
      if(!options.duree){options.duree = 'auto'}
      if(options.duree == 'auto'){options.duree = str.length * 0.08}
      else { options.duree -= 0.5 } // laps ouverture/fermeture
      this.display(str, (options.error?'jqWarning':'jqNotice'), {no_buttons: true});
      this.timer = setTimeout($.proxy(Flash,'denotify'), options.duree*1000);
      return !options.error
    }
  , denotify: function(){
      clearTimeout(this.timer);
      delete this.timer;
      this.close();
    }
    // Affichage d'une erreur
    /**
     *
     * Si c'est une "vraie" qui est envoyée, on l'affichage en console, aussi
     */
  , error: function(str){
      if ('undefined' !== typeof(str.message)){
        console.error(str)
        str = str.message
      }
      this.display(str, 'jqWarning');
      return false
    }
    // Pour poser une question
  , ask: function(msg, args){
    this.onOK_method = args.onOK ;
    this.display(msg, 'jqAsk');
  }

  // L'affichage commun de n'importe quel type de texte
  , display: function(msg, jqIn, options) {
      if(!this.built){this.build()};
      jqIn = this[jqIn];
      this.reset();
      jqIn.html(this.treat_message(msg)).show();
      if(options && options.no_buttons){
        this.hide_buttons()
        // Mais on peut cliquer sur la notification pour la fermer
        jqIn.on('click',this.denotify.bind(this))
      }
      else { this.show_buttons() };
      this.open();
    }

  , open: function(){
      this.old_onkeypress = window.onkeypress ;
      window.onkeypress = $.proxy(Flash,'onKeypress');
      this.show();
    }
  , close: function(){
      window.onkeypress = this.old_onkeypress;
      this.hide();
    }

  , show: function(bad) {
      if(undefined === bad){
        this.jqObj.show();
      } else {
        throw("Il faut utiliser la méthode `notice` ou `message`, pas la méthode `show`, pour afficher un message.")
      }
    }
  , hide: function() {
      this.jqObj.fadeOut();
      // this.jqObj.hide();
    }
  , hide_buttons: function(){
      $('section#flash-buttons').hide();
    }
  , show_buttons: function(){
      $('section#flash-buttons').show();
    }
  , reset: function() {
      this.jqObj.hide();
      this.jqNotice.html('').hide();
      this.jqWarning.html('').hide();
      this.jqAsk.html('').hide();
    },

  /////////////////////////////////////////////////////////////////
  // MÉTHODES ÉVÈNEMENTIELLES

  onOK: function(){
    this.close();
    if(this.onOK_method){
      this.onOK_method();
    }
    this.reset_all();
  },
  onCancel: function(){
    this.close();
    if(this.onCancel_method){
      this.this.onCancel_method();
    }
    this.reset_all();
  },

  reset_all: function(){
    this.onOK_method      = null ;
    this.onCancel_method  = null ;
    // Noter que les champs de texte sont vidés à l'appel
    // de l'affichage. ALors que cette méthode est appelée
    // en fin de cycle.
  },

  onKeypress:function(ev){
    if(ev.keyCode == 13){
      this.onOK();
      return stop(ev);
    } else if (ev.keyCode == 27) {
      // escape
      this.onCancel();
      return stop(ev);
    }
    // console.log(`which:${ev.which}, keyCode:${ev.keyCode}`);
  },
  /////////////////////////////////////////////////////////////////
  // MÉTHODES FONCTIONNELLES

  /**
   * Méthode de traitement cosmétique du message.
   */
  treat_message: function(msg){
    var rg = new RegExp(RC, 'g');
    msg = msg
            .replace(rg, '<br>')
            .replace(/^( +)/g, function(t,p){var l=p.length;r='';while(r.length<l){r+='&nbsp;'};return r;});

    return msg;
  },
  /////////////////////////////////////////////////////////////////
  // MÉTHODES DE CONSTRUCTION //

  build: function(){
    $('body').append(`
      ${this.css}
      <div id="flash" style="display:none;">
        <div id="flash-notice" class="msg" style="display:none;"></div>
        <div id="flash-warning" class="msg" style="display:none;"></div>
        <div id="flash-ask" class="msg" style="display:none;"></div>
        <section id="flash-buttons">
          <button id="cancel-btn" class="btn" onclick="$.proxy(Flash,'onCancel')()">Annuler</button>
          <button id="ok-btn" class="btn" onclick="$.proxy(Flash,'onOK')()">OK</button>
        </section>
      </div>
    `);
    this.built = true ;
  },
};
Object.defineProperties(Flash,{
  jqObj:      {get: function(){return $('#flash')}},
  jqNotice:   {get: function(){return $('#flash #flash-notice')}},
  jqWarning:  {get: function(){return $('#flash #flash-warning')}},
  jqAsk:      {get: function(){return $('#flash #flash-ask')}},
  jqButtons:  {get: function(){return $('#flash #buttons')}},
  css: {get: function(){
    return `
      <style type="text/css">
      </style>
    `
  }}
});
const F = Flash ;

Flash.message = Flash.notice
