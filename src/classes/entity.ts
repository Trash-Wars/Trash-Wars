/////////////////////////////

import goldCrownIcon from '../assets/items/goldCrown.png'
import greenCrownIcon from '../assets/items/greenCrown.png'
import metalGlovesIcon from '../assets/items/metalGloves.png'
import tickleMittensIcon from '../assets/items/tickleMittens.png'
import wizardHatBlueIcon from '../assets/items/wizardHatBlue.png'
import wizardHatGreenIcon from '../assets/items/wizardHatgreen.png'

/////////////////////////////

import simpleBowIcon from '../assets/items/longbow_1.png'
import { Tile } from './shared-types';
import axeIcon from '../assets/battle_axe1.png';

/////////////////////////////

import goblinIcon from '../assets/enemies/goblin_base.png';
import goblinTankIcon from '../assets/enemies/goblin_shield.png';
import gnomeWizardIcon from '../assets/enemies/gnome.png';

export class Entity {
  constructor(
    name: string,
    emoji: string,
  ) {
    this.name = name;
    this.emoji = emoji;
    this.isSolid = true;
  }
  className: string | undefined;
  idName: string | undefined;
  tile: Tile | undefined;
  name: string;
  position: [number, number] | undefined;
  emoji: string;
  team: 'friendly' | 'neutral' | 'hostile' | undefined;
  isSolid: boolean;
  changeTeams(newTeam: 'friendly' | 'neutral' | 'hostile'): void {
    this.team = newTeam;
  }

  getAdjacentTiles(): Set<Tile> | undefined {
    if (!this.tile) return undefined;
    return this.tile.edges;
  }

  moveToPosition(tile: Tile): this {
    if (!this.tile) {
      return this.setTile(tile);
    }
    this.tile.contents.splice(this.tile.contents.indexOf(this), 1);
    return this.setTile(tile);
  }

  setTile(tile: Tile): this {
    this.tile = tile;
    this.tile.contents.push(this)
    this.position = tile.position;
    return this;
  }
  cleanup() {
    this.tile = undefined;
  }
}

export class Item extends Entity {
  constructor(
    name: string,
    emoji: string,
    description: string
  ) {
    super(name, emoji)
    this.description = description;
  }
  description: string;
}

export class Apparel extends Item {
  constructor(
    name: string,
    emoji: string,
    description: string,
    armor: number,
  ) {
    super(name, emoji, description);
    this.armor = armor;
    this.className = 'apparel';
    this.idName = '';
  }
  armor: number;
}

export class Weapon extends Item {
  constructor(
    name: string,
    emoji: string,
    description: string,
    damage: number,
    attackSpeed: number,
  ) {
    super(name, emoji, description)
    this.damage = damage;
    this.attackSpeed = attackSpeed;
    this.className = 'weapon';
    this.idName = '';
  }
  damage: number;
  attackSpeed: number;

  use(parent: Raccoon) {
    console.log(`${this.name} deals ${this.damage} damage ${this.attackSpeed} times. Used by ${parent.name}`);
  }
}

export class Axe extends Weapon {
  constructor() {
    super('Axe', axeIcon, 'An axe', 5, 4)
  }

  use(parent: Raccoon) {
    const origin = parent.position;
    if (!origin) return;
    let enemyTile: Tile | undefined;
    parent.getAdjacentTiles()!.forEach((neighbor: Tile) => {

      if (neighbor.position[0] === origin[0] + 1) {
        enemyTile = neighbor;
      }
    });
    if (!enemyTile) return;
    let solid: Mob | undefined;
    if (enemyTile.contents.length !== 0) solid = enemyTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile

    if (solid) {
      console.log(`${this.name} is attacking ${solid.name}`);
      solid.takeDamage(this.damage, parent);
      return;
    }// ^ attacks the solid if one was found
  }
}

//getTile(pos: [x,y])
export class SimpleBow extends Weapon {
  constructor() {
    super('Simple bow', simpleBowIcon, 'Simple, yet deadly', 3, 3)
  }
  use(parent: Raccoon) {
    const origin = parent.position;
    if (!origin) return;
    let enemyTile: Tile | undefined;
    parent.getAdjacentTiles()!.forEach((neighbor: Tile) => {
      console.log(neighbor)
      if (neighbor.position[0] === origin[0] + 1) {
        enemyTile = neighbor;
      }
    });
    if (!enemyTile) return;
    let solid: Mob | undefined;
    if (enemyTile.contents.length !== 0) solid = enemyTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile

    if (solid) {
      console.log(`${this.name} is attacking ${solid.name}`);
      solid.takeDamage(this.damage, parent);
      return;
    }// ^ attacks the solid if one was found
  }
}


export class SpentSoupCan extends Weapon {
  name = "Spent Soup Can"
  emoji = "https://via.placeholder.com/150"
  damage = 3
  attackSpeed = 3
  description = "an empty soup can"
}

class CoolShades extends Apparel {
  name = "Cool Shades"
  emoji = "https//via.placeholder.com/150"
  //health = 2
  armor = 1
  description = "an empty case"
}

export class TopHat extends Apparel {
  constructor() {
    super(
      "Top Hat",
      "https://via.placeholder.com/150",
      "an empty case",
      1
    )
  }
}

export class Mob extends Entity {
  constructor(name: string, emoji: string, health: number, description: string | undefined) {
    super(name, emoji)
    this.health = health;
    this.description = description
  }
  health: number;
  description: string | undefined
  takeDamage(damage: number, attacker: Entity | undefined): void {
    // ^ attacker is optional
    if (this.health <= 0) return;
    this.health = this.health - damage;
  }
}

export class Raccoon extends Mob {
  constructor(
    name: string,
    emoji: string,
    health: number,
    description: string
  ) {
    super(name, emoji, health, description);
    this.team = 'friendly';
    this.className = 'raccoon';
    this.idName = '';
    // this.description=description
  }
  // description: string | undefined;
  hat: Apparel | undefined;
  weapon: Weapon | undefined;

  useWeapon() {
    if (!this.weapon) return;
    this.weapon.use(this);
  }

  changeWeapon(newWeapon: Weapon) {
    if (this.weapon) {
      const oldWeapon = this.weapon;
      // place oldWeapon back in player inventory
    }
    // remove newWeapon from player inventory
    this.weapon = newWeapon;
  }

  changeApparel(newApparel: Apparel) {
    if (this.hat) {
      const oldApparel = this.hat;
      // place oldApparel back in player inventory
    }
    // remove newApparel from player inventory
    this.hat = newApparel;
  }


}

export class Enemy extends Mob {

  constructor(
    name: string,
    emoji: string,
    health: number,
    damage: number,
    description: string,
  ) {
    super(name, emoji, health, description);
    this.team = 'hostile';
    this.className = 'raccoon';
    this.idName = '';
    this.damage = damage;
  }

  damage: number;

  attack(target: Mob) {
    //play damage animation on target
    if (target.team === this.team) return; // prevents team-killing and allows attacking neutral
    target.takeDamage(this.damage, this);
  };

  advance(): this | undefined {
    if (!this.position) return;
    let targetTile: Tile | undefined;
    this.getAdjacentTiles()!.forEach((neighbor: Tile) => {
      if (neighbor.position[0] === this.position![0] - 1) targetTile = neighbor;
    });
    if (!targetTile) return;
    // ^ Finds adjacent tile

    let solid: Mob | undefined;
    if (targetTile.contents.length !== 0) solid = targetTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile

    if (solid) {
      console.log(`${this.name} is attacking ${solid.name}`);
      this.attack(solid);
      return;
    }// ^ attacks the solid if one was found

    return this.moveToPosition(targetTile);
    // ^ move to tile if unoccupied
  };
}

export class GoblinBasic extends Enemy {
  constructor() {
    super('Goblin', goblinIcon, 10, 3, 'goblin description');
  }
}
export class GoblinTank extends Enemy {
  constructor() {
    super('Goblin Tank', goblinTankIcon, 15, 4, 'goblin, but in a tank');
  }
  takeDamage(damage: number, attacker: Entity | undefined): void {
    const damageReduction = 3;
    const damageAfterReduction = damage - damageReduction;
    const damageTaken = damageAfterReduction >= 0 ? damageAfterReduction : 0;
    this.health = this.health - damageTaken;
    if (this.health >= 0) {
      console.log(`${this.name} died!`);
    }
  }
}

export class GnomeWizard extends Enemy {
  constructor() {
    super('Gnome Wizard', gnomeWizardIcon, 5, 2, '');
  };

  getDiagonal(origin: Tile): Tile {
    let targetTile: Tile = origin;
    let hostTile: Tile = origin;
    targetTile.edges.forEach((neighbor: Tile) => {
      if (neighbor.position[0] === targetTile.position[0] - 1) hostTile = neighbor;
    });
    // ^ finds the next tile forward
    let coinflip: Tile[] = [];
    hostTile.edges.forEach((neighbor: Tile) => {
      const hasSolid: Entity | undefined = neighbor.contents.find(entity => entity.isSolid)
      if (neighbor.position[1] === hostTile.position[1] - 1 && !hasSolid) coinflip.push(neighbor);
      if (neighbor.position[1] === hostTile.position[1] + 1 && !hasSolid) coinflip.push(neighbor);
    });
    // ^ checks each neighbor if they contain a solid and are above or below, and pushees to coinflip if valid tile
    if (coinflip.length === 0) return origin;
    // ^ gnome stays in place if no valid diagonal tiles
    return coinflip[Math.round(Math.random() * coinflip.length)];
    // ^ randomly selects a valid tile (which could be just a single tile)
  }

  advance(): this | undefined {
    if (!this.tile) return;
    let movementTile: Tile = this.getDiagonal(this.tile);
    // ^ Finds diagonal tile or returns its own tile
    this.moveToPosition(movementTile);

    let solid: Entity | undefined = undefined;
    let stack = [movementTile];
    while (stack.length > 0) {
      let current = stack.pop()!;
      let held: Entity | undefined;
      current.edges.forEach((neighbor: Tile) => {
        const left = current.position[0] - 1
        if (neighbor.position[0] === left) {
          const found: Entity | undefined = neighbor.contents.find(entity => entity.isSolid);
          if (found) {
            held = found;
          } else {
            stack.push(neighbor);
          }
        }
      });
      if (held) {
        solid = held;
        break;
      }
    }
    if (!solid) return;
    // this should be game-loss as the Gnome shoots your trash
    if (solid instanceof Mob && solid.team !== this.team) {
      solid.takeDamage(this.damage, this);
    }
    // ^ attacks the solid if one was found
    return;
    // ^ move to tile if unoccupied
  };
}
