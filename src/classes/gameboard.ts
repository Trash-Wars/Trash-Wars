import { allTileBackgrounds } from "../assets/grass/allTiles";
import { Enemy, Entity, Mob, Raccoon } from "./entity";
import { Tile } from "./shared-types";
import coconut from '../assets/coconut.jpg'
import hedgehog from '../assets/hedgehog.png'
import grumpy from '../assets/grumpy.jpeg'
import tiger from '../assets/tigr.png'
import bread from '../assets/bread.gif'

export function comparePos(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

export class Gameboard {
  remainingSpawns: Enemy[] = [];
  enemyQueue: Enemy[] = [];
  currentEntities: Entity[] = [];
  tiles: Tile[] = [];
  rerender?: () => void;

  constructor(readonly rows: number, readonly cols: number) {
    this.generateGameBoard();
    // start ticking
    setInterval(() => {
      /// make special return constants that are handled differently in a switch case
      const shouldRun = this.endCondition()
      if(shouldRun) {
        this.update();
        if(this.rerender) {
          this.rerender()
        }
      };
    }, 1000)
  }

  generateGameBoard() {
    for (let x = 0; x <= this.rows - 1; x++) {
      for (let y = 0; y <= this.cols - 1; y++) {
        // add the tile
        const tileIndex = Math.floor(Math.random()*allTileBackgrounds.length)
        const tileSprite = allTileBackgrounds[tileIndex]
        if(!tileSprite) {
          console.log("NO TILE SPRITE:", allTileBackgrounds.length-1, tileIndex)
        }
        const tile: Tile = {
          contents: [],
          position: [x, y],
          edges: new Set(),
          background: tileSprite,
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

  update = () => {
  
    const spawnTile = this.findEnemySpawnTile(); // find spawns
  
    const remainingSpawns = [...this.enemyQueue]
    if (remainingSpawns.length > 0 && spawnTile) {
      const enemy = remainingSpawns.pop()!// not queue
      this.moveEntity(enemy, spawnTile);// moveEntity
      this.currentEntities.push(enemy)
    };

    this.currentEntities.forEach(entity => {
      if (entity instanceof Raccoon) {
        console.log(`${entity.name} is a Raccoon and uses weapon`);
        entity.useWeapon();
      }
      if (entity instanceof Enemy) {
        console.log(`${entity.name} is an Enemy and advances`);
        entity.advance();
      }
      if (entity instanceof Mob && entity.health <= 0) {
        //doCondition or other generics
        console.log(`${entity.name} dies`);
        this.entityDeathHandler(entity);// entityDeath
      }
    });
  }

  findEnemySpawnTile = (): [number, number] | undefined => {
    const length = this.tiles.length;
    for (let i = length - 1; i >= length - 4; i--) { // starts at the last board tiles and checks moving forward for valid spawns through the final 4 tiles
      if (this.tiles[i].contents) {
        if (this.tiles[i].contents.find(entity => entity.isSolid)) continue;
      }
      // ^ if the contents of the spawn tile contains a solid, skip the tile
      return this.tiles[i].position;
      // ^ retuprn the spawn tile that is open
    }
    return undefined;
  }

  moveEntity = (entity: Entity, pos: [number, number]) => {
    const tile = this.getTile(pos);
    if (!tile) {
      console.warn(`Bad Position: Moving ${entity.name} to x:${pos[0]}, y:${pos[1]}`);
      return entity;
    }
    return entity.moveToPosition(tile)
  }
  
  firstRender = (raccoonTeam: Raccoon[]) => {
    if (this.currentEntities.length > 0) {
      return;
    }
    let counter = 0;
    for (const raccoon of raccoonTeam) {
      this.currentEntities.push(raccoon)
      
      this.moveEntity(raccoon, [0, counter]);
      counter++;
      console.log('Raccoon coords', raccoon.position)
    }
  }

  entityDeathHandler = (entity: Entity) => {
    if (entity.idName !== 'death') {
      entity.idName = 'death'
    }
    setTimeout(() => {
      this.currentEntities = this.currentEntities.filter((ent) => ent.name !== entity.name)
    }, 1400)
  }

  endCondition = () => {
    if(this.enemyQueue) {
      return true; //round not over
    }
    if(this.currentEntities.find(entity => entity instanceof Enemy)) {
      return false; //you won
    }
    //change this to hitting left side of the board
    if(this.currentEntities.find(entity => entity instanceof Raccoon)) {
      return false; //you lost
    }
    return true;
  }

  generateEnemies = (difficulty: number): Enemy[] => {
    // start round should generate a list of enemies that it will generate for the round and where they will go, then begin a loop that continues until all enemies have been killed or the player has lost using the advance() method on enemies. It will loop over every enemy to call advance() on them
    let enemySpawns: Enemy[] = [];
    // ^ defines a stack/queue of enemies to place onto the board
    const possibleEnemies: Enemy[] = [
      new Enemy('Tiger', tiger, 10, 5),
      new Enemy('Coconut', coconut, 10, 5),
      new Enemy('Bread', bread, 10, 5),
      new Enemy('Hedgehog', hedgehog, 10, 5),
      new Enemy('Grumpy', grumpy, 10, 5),
    ]; // TODO: write enemy types for this list
    // ^ this could be automatically generated later based off subclasses, and possibly a difficulty rating

    for (let i = 0; i < difficulty; i++) {
      const randIdx = Math.round(Math.random() * possibleEnemies.length);
      const enemy = possibleEnemies[randIdx]
      enemySpawns.push(enemy); // this may need to call new
    };// ^ randomly selects from the list of all enemies and pushes them to the enemy spawns queue
    this.enemyQueue = possibleEnemies;
    return possibleEnemies;
  };

}
