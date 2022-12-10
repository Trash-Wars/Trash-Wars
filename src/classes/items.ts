import axeIcon from '../assets/battle_axe1.png'

export class Item {
  name?: string;
  description?: string;
  image?: string;
}

export class Apparel extends Item {
  armor?: number
  health?:number
}


export class Weapon extends Item {
  damage?: number;
  attackSpeed?: number;

  use() {
    console.log(`${this.name} deals ${this.damage} damage ${this.attackSpeed} times`);
  }
}

export class Axe extends Weapon {
  name = "axe"
  damage = 5
  attackSpeed = 4
  description = "A wedge attached to the end of a lever arm"
  image = axeIcon
}

export class SpentSoupCan extends Weapon {
  name = "Spent Soup Can"
  damage= 3
  attackSpeed= 3
  description= "an empty soup can"
  image= "https://via.placeholder.com/150"
}

export class CoolShades extends Apparel {
  name= "Cool Shades"
  health= 2
  armor= 1
  description= "an empty case"
  image= "https//via.placeholder.com/150"
}

class TopHat extends Apparel  {
  name= "Top Hat"
  health= 2
  armor= 1
  description= "an empty case"
  image= "https://via.placeholder.com/150"
}

// finalDamage = weaponDamage - armorValue
//damage taken = damage - armor
// criticals? evasion? & damage reduction?
export const allItemsArr = [Axe, SpentSoupCan, CoolShades, TopHat]

