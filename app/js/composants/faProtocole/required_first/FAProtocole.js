'use strict'
/**

  Class FAProtocole
  -----------------
  Pour gérer le protocole d'analyse d'une analyse

  L'instance s'obtient par `current_analyse.protocole`
**/

class FAProtocole {
/**
  Données du protocole : `FAProtocole.DATA` -- cf. data_protocole.js
**/
constructor(analyse){
  this.analyse = this.a = analyse
  this.loadData()
  this.modified = false
}

/**
  Méthode appelée par le checkbox quand on le clique
**/
onCheckStep(e){
  this.data[e.target.value] = true
  this.modified = true
}

// Retourne la dernière étape atteinte (titre humain)
lastStep(){
  var last = null
  for(var dstep of FAProtocole.DATA.steps){
    if(dstep.type === 'separator') continue
    if(this.data[dstep.id] === true) last = dstep.libelle
    if(dstep.steps){
      for(var dsousStep of dstep.steps){
        if(this.data[dsousStep.id]===true) last = dsousStep.libelle
      }
    }
  }
  dstep = null
  dsousStep = null
  return last
}

// Retourne true si l'étape d'identifiant +step_id+ (cf. DATA) est
// effectuée (checkée)
isChecked(step_id){
  return this.data[step_id] === true
}

// Les données
setData(d){ this.data = d || {}}
loadData(){
  if(fs.existsSync(this.path)){
    this.data = JSON.parse(fs.readFileSync(this.path,'utf8'))
  } else {
    this.data = {}
  }
}

// Miscelleanous

show(){this.fwindow.show()}
saveAndHide(){
  this.save()
  this.fwindow.hide()
}
save(){
  if(this.modified){
    this.iofile.save({after: this.endSave.bind(this)})
  } else {
    // console.log("Protocole non modifié.")
  }
}
endSave(){
  this.modified = false
}

// À la fermeture de la fenêtre, on enregistre les changements
// enregistrés
onHide(){
  if(this.modified){
    this.save()
  } else {
    // console.log("Pas d'enregistrement des données du protocole.")
  }
}

build(){
  var my = this
    , domElements = []
    , sousSteps   = []
    , cbSteps     = []

  cbSteps.push(DCreate('button', {class:'btn-close', type:'button'}))
  cbSteps.push(DCreate('H2', {inner:'protocole d’analyse'}))

  for(var dstep of FAProtocole.DATA.steps){
    if (dstep.type === 'separator'){
      cbSteps.push(DCreate('DIV', {class: 'separator'}))
    } else {
      if (dstep.steps){
        sousSteps = []
        for(var dsstep of dstep.steps){
          sousSteps.push(this.buildStep(dsstep))
        }
      } else { sousSteps = null }
      cbSteps.push(this.buildStep(dstep, sousSteps))
    }
  }

  domElements.push(
    DCreate('DIV', {class:'body', append:cbSteps})
  )

  domElements.push(
    DCreate('DIV', {class:'footer', append:[
      DCreate('BUTTON', {id:'protocole-btn-ok', type:'button', inner:'Enregistrer', class:'main-button small'})
    ]})
  )
  return domElements
}

/**
On observe tous les checkboxes pour enregistrer les modifications
qu'on enregistrera à la fermeture de la fenêtre.
**/
observe(){
  this.fwindow.jqObj.find('input[type="checkbox"]').on('click', this.onCheckStep.bind(this))
  this.fwindow.jqObj.find('#protocole-btn-ok').on('click', this.saveAndHide.bind(this))
}

// ---------------------------------------------------------------------
//  Méthodes de propriétés

get iofile(){return this._iofile||defP(this,'_iofile',new IOFile(this))}
get path(){return this._path||defP(this,'_path', path.join(this.a.folder,'protocole.json'))}

// ---------------------------------------------------------------------
//  Méthodes fonctionnelles

buildStep(dstep, sousSteps){
  var step_id = `protocole-step-${dstep.id}`
  var els = [
    DCreate('INPUT', {type:'checkbox', id: step_id, value: dstep.id, attrs:{checked: this.isChecked(dstep.id)?'CHECKED':null}})
  , DCreate('LABEL', {inner: dstep.libelle, attrs:{for: step_id}})
  ]
  if (sousSteps) {
    els.push(DCreate('DIV', {class: 'protocole-sous-steps', append: sousSteps}))
  }
  return DCreate('DIV', {class:'protocole-step', append:els })
}
get fwindow(){return this._fwindow||defP(this,'_fwindow', new FWindow(this,{id:'protocole'}))}
}
