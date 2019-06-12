'use strict'


class PersonnageFondamental extends Fondamentale {
constructor(fonds, ydata){
  super(fonds, ydata)
  this.fonds = fonds
}

// ---------------------------------------------------------------------
//  Méthodes d'export

/**
  Pour ajouter les éléments DOM à la méthode `export` principale
**/
addElementsTo(els){
  els.push(this.divPseudo)
  this.divDescription && els.push(this.divDescription)
  return els
}

// ---------------------------------------------------------------------
// Méthodes d'Helpers
get divPseudo(){return this.libvalDiv('pseudo')}

// ---------------------------------------------------------------------
// Données propres
get pseudo(){return this.ydata.pseudo}
get perso_id(){return this.ydata.perso_id}
get Ufactor(){return this.ydata.Ufactor}
get Ofactor(){return this.ydata.Ofactor}
// Donnée nécessaire pour l'utilisation avec le data-editor, mais ça n'est
// vraiment pas propre… C'est indispensable puisqu'on ne peut pas avoir des
// données en dehors des panneaux et que chaque panneau est une fondamentale
// particulière. Donc on a été obligé de mettre le path permettant de retrouver
// le groupe de fondamentales donc il est question dans le premier panneau donc
// dans cette première fondamentale
get path(){return this.fonds.path}

// ---------------------------------------------------------------------
// Données générales
get type(){return 'personnage fondamental'}
get id(){return 1}
}
