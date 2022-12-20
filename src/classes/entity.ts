/////////////////////////////

import goldCrownIcon from '../assets/items/goldCrown.png'
import knightHelmetIcon from '../assets/items/helmet_5.png'
import jesterIcon from '../assets/items/cap_jester.png'

/////////////////////////////

import simpleBowIcon from '../assets/items/longbow_1.png'
import axeIcon from '../assets/items/battle_axe1.png';
import katanaIcon from '../assets/items/katana.png'
import scytheIcon from '../assets/items/scythe_1_new.png'
import spearIcon from '../assets/items/spear_1.png'
import arbalestIcon from '../assets/items/arbalest_2.png'

/////////////////////////////

import raccIcon from '../assets/raccoon_sprite.png';
import goblinIcon from '../assets/enemies/goblin_base.png';
import goblinTankIcon from '../assets/enemies/goblin_shield.png';
import gnomeWizardIcon from '../assets/enemies/gnome.png';
import pulsatingLumpIcon from '../assets/enemies/pulsating_lump.png'
import ravenIcon from '../assets/enemies/raven.png'
import skeletonIcon from '../assets/enemies/skeletal_warrior_new.png'
import wraithIcon from '../assets/enemies/wraith.png'
import impIcon from '../assets/enemies/imp.png'
import devilIcon from '../assets/enemies/red_devil_new.png'
import { Tile } from './shared-types';

export class Entity {
  constructor(
    name: string,
    sprite: string,
  ) {
    this.name = name;
    this.sprite = sprite;
    this.isSolid = true;
  }
  className: string | undefined;
  idName: string | undefined;
  tile: Tile | undefined;
  name: string;
  position: [number, number] | undefined;
  sprite: string;
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
    sprite: string,
    description: string
  ) {
    super(name, sprite)
    this.description = description;
  }
  description: string;
}

export class Apparel extends Item {
  constructor(
    name: string,
    sprite: string,
    description: string,
    armor: number,
  ) {
    super(name, sprite, description);
    this.armor = armor;
    this.className = 'apparel';
    this.idName = '';
  }
  armor: number;
}

export class Weapon extends Item {
  constructor(
    name: string,
    sprite: string,
    description: string,
    damage: number,
    attackSpeed: number,
  ) {
    super(name, sprite, description)
    this.damage = damage;
    this.attackSpeed = attackSpeed;
    this.className = 'weapon';
    this.idName = '';
  }
  damage: number;
  attackSpeed: number;

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
      this.dealDamage(solid, parent);
      return;
    }// ^ attacks the solid if one was found
  }

  dealDamage(target: Mob, parent: Raccoon) {
    for (let i = 0; i < this.attackSpeed; i++) {
      target.takeDamage(this.damage, parent);
    }
  }
}

export class Axe extends Weapon {
  constructor() {
    super('Axe', axeIcon, 'An axe', 9, 1)
  }
}

export class Katana extends Weapon {
  constructor() {
    super('Katana', katanaIcon, 'Folded one thousand times', 5, 2);
  }
}

export class Scythe extends Weapon {
  constructor() {
    super('Scythe', scytheIcon, `Don't fear the reaper`, 4, 1);
  }
  use(parent: Raccoon) {
    const origin = parent.position;
    const hitList: Tile[] = [];
    if (!origin) return;
    let targetTile: Tile | undefined;
    parent.getAdjacentTiles()!.forEach((neighbor: Tile) => {

      if (neighbor.position[0] === origin[0] + 1) {
        targetTile = neighbor;
        hitList.push(neighbor);
      }
    });
    if (!targetTile) return;
    targetTile.edges.forEach((neighbor: Tile) => {
      if (neighbor.position[1] === targetTile!.position[1] - 1) hitList.push(neighbor);
      if (neighbor.position[1] === targetTile!.position[1] + 1) hitList.push(neighbor);
    });
    //let solid: Mob | undefined;
    //if (enemyTile.contents.length !== 0) solid = enemyTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile
    hitList.forEach((tile: Tile) => {
      const target = tile.contents.find(entity => entity.isSolid);
      if (target && target instanceof Mob) {
        console.log(`${this.name} is attacking ${target.name}`);
        this.dealDamage(target, parent)
      };
    });// ^ attacks the solid if one was found
  }
}

export class Spear extends Weapon {
  constructor() {
    super('Spear', spearIcon, `It's pointy!`, 4, 2)
  }
  use(parent: Raccoon) {
    const origin = parent.position;
    const hitList: Tile[] = [];
    if (!origin) return;
    let targetTile: Tile | undefined;
    parent.getAdjacentTiles()!.forEach((neighbor: Tile) => {

      if (neighbor.position[0] === origin[0] + 1) {
        targetTile = neighbor;
        hitList.push(neighbor);
      }
    });
    if (!targetTile) return;
    targetTile.edges.forEach((neighbor: Tile) => {
      if (neighbor.position[0] === targetTile!.position[0] + 1) hitList.push(neighbor);
    });
    //let solid: Mob | undefined;
    //if (enemyTile.contents.length !== 0) solid = enemyTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile
    hitList.forEach((tile: Tile) => {
      const target = tile.contents.find(entity => entity.isSolid);
      if (target && target instanceof Mob) {
        console.log(`${this.name} is attacking ${target.name}`);
        this.dealDamage(target, parent)
      };
    });// ^ attacks the solid if one was found
  }
}

export class SimpleBow extends Weapon {
  constructor() {
    super('Simple bow', simpleBowIcon, 'Simple, yet deadly', 4, 1)
  }
  use(parent: Raccoon) {
    let solid: Entity | undefined = undefined;
    let stack = [parent.tile];
    while (stack.length > 0) {
      let current = stack.pop()!;
      let held: Entity | undefined;
      current.edges.forEach((neighbor: Tile) => {
        const right = current.position[0] + 1
        if (neighbor.position[0] === right) {
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
    if (solid instanceof Mob && solid.team !== this.team) {
      this.dealDamage(solid, parent)
    }
  }
}

export class Arbalest extends Weapon {
  constructor() {
    super('Arbalest', arbalestIcon, 'A mighty siege weapon', 5, 1)
  }
  use(parent: Raccoon) {
    const hitList: Entity[] = [];
    let stack = [parent.tile];
    while (stack.length > 0) {
      let current = stack.pop()!;
      let held: Entity | undefined;
      current.edges.forEach((neighbor: Tile) => {
        const right = current.position[0] + 1
        if (neighbor.position[0] === right) {
          const found: Entity | undefined = neighbor.contents.find(entity => entity.isSolid);
          if (found) {
            held = found;
          } else {
            stack.push(neighbor);
          }
        }
      });
      if (held) {
        hitList.push(held);
      }
    }
    hitList.forEach((target: Entity) => {
      if (target instanceof Mob) {
        console.log(`${this.name} is attacking ${target.name}`);
        this.dealDamage(target, parent)
      };
    });
  }
}


export class JesterHat extends Apparel {
  constructor() {
    super("Jester Cap", jesterIcon, "God gives his silliest battles to his most tragic of clowns", 6)
  }
}

export class GoldCrown extends Apparel {
  constructor() {
    super("Royal Crown", goldCrownIcon, "A very regal crown", 1)
  }
}

export class KnightHelmet extends Apparel {
  constructor() {
    super(
      "Knight Helmet",
      knightHelmetIcon,
      "an knight's helmet",
      4
    )
  }
}


export class Mob extends Entity {
  constructor(name: string, sprite: string, health: number, description: string | undefined) {
    super(name, sprite)
    this.health = health;
    this.description = description;
    this.maxHealth = health;
  }
  health: number;
  maxHealth: number;
  description: string | undefined
  takeDamage(damage: number, attacker: Entity | undefined): void {
    // ^ attacker is optional
    if (this.health <= 0) return;
    this.health = this.health - damage;
    console.log(this.name, "took damage")
    // this.damageAnimation()
    this.idName = 'damage';
    setTimeout(() => {
      this.emptyIdName()
    }, 100)
  }

  emptyIdName():void {
    console.log(this.idName)
    this.idName='hello'
    console.log(this.idName)
  }
 
}

export class Claws extends Weapon {
  constructor() {
    super('Raccoon claws', raccIcon, 'Claws', 1, 1)
  }
}
export class Raccoon extends Mob {
  constructor(
    name: string,
    health: number,
    description: string
  ) {
    super(name, raccIcon, health, description);
    this.team = 'friendly';
    this.className = 'raccoon';
    this.idName = '';
    // this.description=description
  }
  // description: string | undefined;
  hat: Apparel | undefined;
  weapon: Weapon | undefined;

  useWeapon() {
    if (!this.weapon) {
      const claws = new Claws()
      claws.use(this);
      return;
    };
    this.weapon.use(this);
  }

}

export class Enemy extends Mob {

  constructor(
    name: string,
    sprite: string,
    health: number,
    damage: number,
    description: string,
  ) {
    super(name, sprite, health, description);
    this.team = 'hostile';
    this.className = 'enemy';
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
      if (neighbor.position[0] === this.position![0] - 1 && neighbor.position[1] === this.position![1]) targetTile = neighbor;
    });
    if (!targetTile) return;
    // ^ Finds adjacent tile

    let solid: Mob | undefined;
    if (targetTile.contents.length !== 0) solid = targetTile.contents.find(entity => entity.isSolid) as Mob;
    // ^ Defines the first solid entity in adjacent tile

    if (solid) {
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
    super('Goblin Tank', goblinTankIcon, 15, 5, 'goblin, but in a tank');
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

export class PulsatingLump extends Enemy {
  constructor() {
    super('Pulsating Lump', pulsatingLumpIcon, 20, 7, 'A lump of flesh')
  }
  attack(target: Mob) {
    //play damage animation on target
    target.takeDamage(this.damage, this);
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

export class Raven extends Enemy {
  constructor() {
    super('Raven', ravenIcon, 7, 4, 'A bird')
  }
}

export class Wraith extends Enemy {
  constructor() {
    super('Wraith', wraithIcon, 12, 6, 'An angry ghost')
  }
  takeDamage(damage: number, attacker: Entity | undefined): void {
    const damageReduction = 4;
    const damageAfterReduction = damage - damageReduction;
    const damageTaken = damageAfterReduction >= 0 ? damageAfterReduction : 0;
    this.health = this.health - damageTaken;
    if (this.health >= 0) {
      console.log(`${this.name} died!`);
    }
  }
}

export class Skeleton extends Enemy {
  constructor() {
    super('Skeleton', skeletonIcon, 15, 5, 'BONES')
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
      if (neighbor) {
        const hasSolid: Entity | undefined = neighbor.contents.find(entity => entity.isSolid)
        if (neighbor.position[1] === hostTile.position[1] - 1 && !hasSolid) coinflip.push(neighbor);
        if (neighbor.position[1] === hostTile.position[1] + 1 && !hasSolid) coinflip.push(neighbor);
      }
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
    if (movementTile) {
      this.moveToPosition(movementTile);
    } else {
      this.tile.edges.forEach((neighbor: Tile) => {
        if (neighbor.position[0] === this.tile!.position[0] - 1) this.moveToPosition(neighbor);
      });
    }

    let solid: Entity | undefined = undefined;
    let stack = [this.tile];
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

export class Imp extends Enemy {
  constructor() {
    super('Imp', impIcon, 8, 6, 'A fiery fiend')
  }
  advance(): this | undefined {
    if (!this.tile) return;
    let movementTile: Tile | undefined;
    // ^ Finds diagonal tile or returns its own tile
    this.getAdjacentTiles()!.forEach((neighbor: Tile) => {
      if (neighbor.position[0] === this.position![0] - 1 && neighbor.position[1] === this.position![1]) movementTile = neighbor;
    });
    if (movementTile && !movementTile.contents.find(entity => entity.isSolid)) {
      this.moveToPosition(movementTile);
    };
    let solid: Entity | undefined = undefined;
    let stack = [this.tile];
    while (stack.length > 0) {
      let current = stack.pop()!;
      let held: Entity | undefined;
      if (!current) continue
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

export class Devil extends Enemy {
  constructor() {
    super('Devil', devilIcon, 25, 6, 'A greater fiend')
  }
  damageReduction = 2;
  attack(target: Mob) {
    //play damage animation on target
    target.takeDamage(this.damage, this);
    if (target.health >= 0) {
      this.damageReduction++;
      this.damage++;
      this.health = this.health + 2;
    }
  }
  takeDamage(damage: number, attacker: Entity | undefined): void {
    const damageReduction = this.damageReduction;
    const damageAfterReduction = damage - damageReduction;
    const damageTaken = damageAfterReduction >= 0 ? damageAfterReduction : 0;
    this.health = this.health - damageTaken;
    if (this.health >= 0) {
      console.log(`${this.name} died!`);
    }
  }
  advance(): this | undefined {
    if (!this.position) return;
    let movementTile: Tile | undefined;
    this.getAdjacentTiles()!.forEach((neighbor: Tile) => {
      if (neighbor.position[0] === this.position![0] - 1) movementTile = neighbor;
    });
    if (movementTile && !movementTile.contents.find(entity => entity.isSolid)) this.moveToPosition(movementTile);
    const hitList: Entity[] = [];
    const diagQueue: Tile[] = [];
    this.getAdjacentTiles()!.forEach((neighbor: Tile) => {
      if (neighbor) {
        const found = neighbor.contents.find(entity => entity.isSolid);
        if (found) hitList.push(found);
        if (neighbor.position[0] === this.position![0] - 1 || neighbor.position[0] === this.position![0] + 1) diagQueue.push(neighbor);
      }
    });
    diagQueue.forEach((cardinal: Tile) => {
      cardinal.edges.forEach((neighbor) => {
        if (neighbor && (neighbor.position[1] === cardinal.position[1] + 1 || neighbor.position[1] === cardinal.position[1] - 1)) {
          const found = neighbor.contents.find(entity => entity.isSolid);
          if (found) hitList.push(found);
        }
      })
    })
    // ^ Defines the first solid entity in adjacent tile

    hitList.forEach(entity => {
      if (entity instanceof Mob) this.attack(entity);
    });
    // ^ move to tile if unoccupied
  };
}
