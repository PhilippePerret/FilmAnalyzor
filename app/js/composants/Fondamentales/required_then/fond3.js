'use strict'

class OppositionFondamentale extends Fondamentale {
  constructor(fonds, ydata){
    super(fonds, ydata)
  }
// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  this.opposition   && els.push(this.divOpposition)
  this.description  && els.push(this.divDescription)
  this.antagoniste  && els.push(this.divAntagoniste)
  this.antagonisme  && els.push(this.divAntagonisme)
  this.obstacles    && els.push(this.divObstacles)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'helper
get divOpposition() {return this.libvalDiv('opposition')}
get divAntagoniste(){return this.libvalDiv('antagoniste')}
get divAntagonisme(){return this.libvalDiv('antagonisme')}
get divObstacles()  {return this.libvalDiv('obstacles')}

// ---------------------------------------------------------------------
// Données propres
get opposition(){return this._opposition||defP(this,'_opposition', this.ydata.opposition)}
get antagoniste(){return this._antagoniste||defP(this,'_antagoniste', this.ydata.antagoniste)}
get antagonisme(){return this._antagonisme||defP(this,'_antagonisme', this.ydata.antagonisme)}
get obstacles(){return this._obstacles||defP(this,'_obstacles', this.ydata.obstacles)}
get Ufactor(){return this.ydata.Ufactor}
get Ofactor(){return this.ydata.Ofactor}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'opposition fondamentale'}
get id(){return 3}
}
