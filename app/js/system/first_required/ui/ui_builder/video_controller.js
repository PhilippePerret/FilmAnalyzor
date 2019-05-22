'use strict'

const VideoControllerBuilder = {
/**
  Méthode principale de construction
**/
build(){
  UI.sectionVideo.append(
      this.buildHeader()
    , this.buildBody()
    , this.buildToolBox()
    , this.buildFooter()
  )
  // UI.sectionVideo.append(this.buildBody())
  // UI.sectionVideo.append()
}

, buildHeader(){
    return DCreate(DIV, {id:'section-video-header', class:'no-user-selection', append:[
        // Horloge principale
        DCreate(HORLOGE, {class: 'main-horloge horloge horlogeable', inner: '0:00:00.0'})
        // Espace pour indiquer la scène courante
      , DCreate(SPAN, {id:'mark-current-scene', inner:'...'})
    ]})
  }

/**
  Le corps même de la section vidéo
**/
, buildBody(){
    return DCreate(DIV, {id:'section-video-body', append:[
        DCreate('VIDEO', {id:'section-video-body-video-1', class:'video no-user-selection time', append:[
          DCreate('SOURCE', {id: `video-1-src`, type: 'video/mp4', attrs:{src:'./img/novideo.mp4'}})
      ]})
    ]})
  }

, buildFooter(){
    return DCreate(DIV, {id:'section-video-footer', append:[
        // Le DIV principal contenant les boutons de contrôle
        DCreate(DIV, {class: 'div-nav-video-buttons no-user-selection'})
        // La boite de navigatoire
      , this.buildControllerBox()
    ]})
  }

, buildToolBox(){
    return DCreate(DIV,{id:'bt-video-toolbox', append:[
        DCreate(SPAN,{id:'mode-shortcuts-span', append:[
          DCreate(LABEL,{inner:'Mode raccourcis'})
        , DCreate(SPAN,{id:'banctime-mode-shortcuts',inner:'INTERFACE'})
        ]})
      ]})

}

, buildControllerBox(){
    let btns = [], suf, dbtn, rac, attrs

    let spanHorlogeReal = DCreate(SPAN, {class:'real-horloge horloge tiny fleft discret', inner: '0:00:00.0'})

    // Les boutons rewind et forward, etc.
    for(suf of VideoController.CTRL_BUTTONS.tiny_buttons){
      [suf, rac] = suf.split(':')
      attrs = {src: `./img/btns-controller/btn-${suf}.png`}
      isDefined(rac) && ( attrs.title = rac)
      btns.push(
          DCreate(BUTTON, {type: STRbutton, class: `controller btn-${suf}`, append:[
          DCreate(IMG, {attrs:attrs})
        ]})
      )
    }
    let divTinyBtns = DCreate(DIV, {class:'vcontroller-tiny-btns no-user-selection', append: btns})

    // Les boutons principaux du controller de vidéo
    btns = []
    for(suf in VideoController.CTRL_BUTTONS.main_buttons){
      dbtn = VideoController.CTRL_BUTTONS.main_buttons[suf]
      btns.push(
        DCreate(BUTTON, {type:STRbutton, class: `main btn-${suf}`, attrs:{title:dbtn.title}, append:[
          DCreate(IMG, {attrs:{src: `./img/btns-controller/btn-${suf}.png`}})
        ]})
      )
    }
    let divMainBtns = DCreate(SPAN, {class: 'vcontroller-main-btns no-user-selection', append:btns})

    let divControlBox = DCreate(SPAN, {class:'video-controller no-user-selection', id: `video-controller-1`, append:[
      spanHorlogeReal, divTinyBtns, divMainBtns
    ]})

    return divControlBox
  }

}// /VideoControllerBuilder

module.exports = function(){
  let my = this
  VideoControllerBuilder.build()
}
