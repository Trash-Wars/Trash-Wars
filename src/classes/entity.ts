
class Entity {

  constructor(position: Tile, name: string, emoji: string, team: 'friendly' | 'neutral' | 'hostile') {
    this.position = position;
    this.name = name;
    this.emoji = emoji;
    this.team = team;
  }

  name: string;
  // Graph Tile, its coordinate on the gameboard grid
  position: Tile
  emoji: string;
  team: 'friendly' | 'neutral' | 'hostile';

  changeTeams(newTeam: 'friendly' | 'neutral' | 'hostile') {
    this.team = newTeam;
  }
}

class Mob extends Entity {

//health: number;

  moveToPosition(tile: Tile) {
    this.position = tile;
  }

}

// class Raccoon extends Mob {
//   description?: string;
//   hat: any;
//   weapon: any;
// }

// class Enemy extends Mob {
  
// }

export interface Tile {
  contents: Entity[];
  position: [number, number];
  edges: Set<Tile>;
}

export const ROWS = 4;
export const COLS = 6;

export class Gameboard {
  tiles = new Map<[number, number], Tile>();

  constructor() {
    this.generateGameBoard();
  }

  generateGameBoard() {
    for(let x = 0; x <= ROWS - 1; x++) {
      for(let y = 0; y <= COLS - 1; y++) {
        // add the tile
        const tile: Tile = {
          contents: [],
          position: [x, y],
          edges: new Set(),
        };
        this.tiles.set([x, y], tile);
        // add the tile's neighbors
        for(let coord of [[x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]] as [number, number][]) {
          const neighbor = this.tiles.get(coord) as Tile | undefined;
          if(!neighbor) {
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
}
