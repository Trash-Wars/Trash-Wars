import axeIcon from '../assets/battle_axe1.png';

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
      console.log('Adding tile')
      return this.setTile(tile);
    }
    console.log('Deleting: ', this.tile.contents.splice(this.tile.contents.indexOf(this), 1));
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
    //health: number,// maybe these are just a bonuses object?
  ) {
    super(name, emoji, description);
    this.armor = armor;
    this.className = 'apparel';
    //this.health = health;
  }
  armor: number;
  //health: number;
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
    // this.name = 'Axe';
    // this.description = 'An axe';
    // this.damage = 5;
    // this.attackSpeed = 4;
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
    //console.log(`Tile: ${origin} targeting tile: ${enemyTile.position}`)
    //console.log(enemyTile)

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

class TopHat extends Apparel {
  name = "Top Hat"
  emoji = "https://via.placeholder.com/150"
  //health = 2
  armor = 1
  description = "an empty case"
}

class Mob extends Entity {
  constructor(
    name: string,
    emoji: string,
    health: number,
  ) {
    super(name, emoji)
    this.health = health;
  }
  health: number;

}

export class Raccoon extends Mob {
  constructor(
    name: string,
    emoji: string,
    health: number,
  ) {
    super(name, emoji, health)
    this.team = 'friendly'
    this.className = 'raccoon';
  }
  description: 'string' | undefined;
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

class Enemy extends Mob {

}

export interface Tile {
  contents: Entity[];
  position: [number, number];
  edges: Set<Tile>;
}

export function comparePos(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

export class Gameboard {
  tiles: Tile[] = [];

  constructor(readonly rows: number, readonly cols: number) {
    this.generateGameBoard();
  }

  generateGameBoard() {
    for (let x = 0; x <= this.rows - 1; x++) {
      for (let y = 0; y <= this.cols - 1; y++) {
        // add the tile
        const tile: Tile = {
          contents: [],
          position: [x, y],
          edges: new Set(),
        };
        this.tiles.push(tile);
        // add the tile's neighbors
        const left = [x - 1, y]
        const right = [x + 1, y]
        const up = [x, y + 1]
        const down = [x, y - 1]
        for (let coord of [left, right, up, down] as [number, number][]) {
          const neighbor = this.getTile(coord);
          if (!neighbor) {
            continue;
          }
          this.addEdge(tile, neighbor);
        }
      }
    }
  }

  addEdge(a: Tile, b: Tile): void {
    a.edges.add(b);
    b.edges.add(a);
  }

  getTile(pos: [number, number]): Tile | undefined {
    for (const tile of this.tiles) {
      if (comparePos(pos, tile.position)) {
        return tile;
      }
    }
    return undefined;
  }

}
