'use strict'
/**
  Simulation des menus
**/

/**
  Pour simuler le choix d'un menu
  Cf. le manuel
**/
global.chooseMenu = function(which){
  let menu = FITMenus.search(which)
  menu || raise(`Impossible de trouver un menu correspondant à '${which}'…`)
  menu.click()
}

const FITMenus = {
  name: 'FITMenus'
, get Menus(){
    return this._Menus || (this._Menus = electron.remote.Menu.getApplicationMenu())
  }
, search(which){
    const my = this
    return my.searchById(which) || my.searchInMap(which) || my.searchInMenus(which)
  }
, searchById(which){
    return this.Menus.getMenuItemById(which)
  }
, searchInMap(which){
    if ( undefined === this.Map ) this.Map = Tests.config['map-menus'] || null
    if ( this.Map && this.Map[which]) {
      console.log("this.Map[which] = ", this.Map[which])
      return this.searchById(this.Map[which])
    } else return null
  }
, searchInMenus(which){
    // En dernier recours, on cherche dans tous les menus
    let args      = which.split('::')
      , subMenu   = this.Menus
      , menuPath  = []
    // console.log("--- menus", this.Menus)
    for ( var arg of args ) {
      menuPath.push(arg) // pour le message d'erreur
      subMenu = this.searchLabelInMenu(subMenu, arg)
      subMenu || raise(`Aucun menu ne correspond à '${menuPath.join('::')}'…`)
    }
    return subMenu
  }

, searchLabelInMenu(menu, label){
    let items
    if ( menu.submenu ) items = menu.submenu.items
    else items = menu.items
    for ( var item of items ) {
      if ( item.label == label ){
        return item
      }
    }
  }
}
