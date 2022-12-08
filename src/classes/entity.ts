import { Weapon, Apparel } from "./items";

export class Entity {

  constructor(
    name: string,
    emoji: string,
    ) {
    this.name = name;
    this.emoji = emoji;
    this.isSolid = true;
  }
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
    if(!this.tile) return undefined;
    return this.tile.edges;
  }

  moveToPosition(tile: Tile): this {
    this.tile = tile;
    this.position = tile.position;
    return this
  }

  cleanup() {
    this.tile = undefined;
  }
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
  }
  description: 'string' | undefined;
  hat: Apparel | undefined;
  weapon: Weapon | undefined;

  useWeapon() {
    if (!this.weapon) return;
    this.weapon.use();
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
        for (let coord of [[x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 1], [x - 1, y - 1]] as [number, number][]) {
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
    for(const tile of this.tiles) {
      if(comparePos(pos, tile.position)) {
        return tile;
      }
    }
    return undefined;
  }

}
