import { type } from "os";
import { allTileBackgrounds } from "../assets/grass/allTiles";
import { Devil, Enemy, Entity, GnomeWizard, GoblinBasic, GoblinTank, Imp, Mob, PulsatingLump, Raccoon, Raven, Skeleton, Wraith } from "./entity";
import { Tile } from "./shared-types";

export function comparePos(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

export class Gameboard {
  enemyQueue: Enemy[] = [];
  currentEntities: Entity[] = [];
  tiles: Tile[] = [];
  rerender?: () => void;

  setScreen?: (newScreen: 0 | 1 | 2 | 3) => void;
  rounds?: number;

  roundInProgress: boolean = false;


  constructor(readonly rows: number, readonly cols: number) {
    this.generateGameBoard();
    console.log('Setting interval');
    this.generateEnemies(5);
    setInterval(() => {
      /// make special return constants that are handled differently in a switch case
      const shouldRun = this.shouldTick(this.currentEntities);
      if (!shouldRun) {
        this.roundInProgress = false;
        return;
      }
      if (shouldRun) {
        this.update();
        if (this.rerender) {
          this.rerender()
        }
      };
    }, 1000)
  }

  generateGameBoard() {
    for (let x = 0; x <= this.rows - 1; x++) {
      for (let y = 0; y <= this.cols - 1; y++) {
        // add the tile
        const tileIndex = Math.floor(Math.random() * allTileBackgrounds.length)
        const tileSprite = allTileBackgrounds[tileIndex]
        if (!tileSprite) {
          console.log("NO TILE SPRITE:", allTileBackgrounds.length - 1, tileIndex)
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

    if (this.enemyQueue.length > 0 && spawnTile) {
      const enemy = this.enemyQueue.pop()!// not queue
      this.moveEntity(enemy, spawnTile);// moveEntity
      
      console.log(this.currentEntities.length, 'entity count before');
      this.currentEntities.push(enemy)
      console.log(this.currentEntities.length, 'entity count after');
    };
    
    this.currentEntities.forEach(entity => {
      if (entity instanceof Raccoon) {
        entity.useWeapon();
      }
      if (entity instanceof Enemy) {
        entity.advance();
      }
      if (entity instanceof Mob && entity.health <= 0) {
        //doCondition or other generics
        console.log(`${entity.name} dies`);
        this.entityDeathHandler(entity);// entityDeath
      }
    });

    // const remainingSpawns = [...this.enemyQueue]
    // if (remainingSpawns.length > 0 && spawnTile) {
    //   const enemy = remainingSpawns.pop()!// not queue
    //   this.moveEntity(enemy, spawnTile);// moveEntity
    //   this.currentEntities.push(enemy)
    // };

  }

  findEnemySpawnTile = (): [number, number] | undefined => {
    const length = this.tiles.length;
    const validSpawns: Tile[] = [];
    for (let i = length - 1; i >= length - 4; i--) { // starts at the last board tiles and checks moving forward for valid spawns through the final 4 tiles
      if (this.tiles[i] && !this.tiles[i].contents.find(entity => entity.isSolid)) validSpawns.push(this.tiles[i]);
      // ^ if the contents of the spawn tile contains a solid, skip the tile
    }
    const spawn = validSpawns[Math.floor(Math.random() * validSpawns.length)];
    if (!spawn) return;
    return spawn.position
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
    let counter = 0;
    console.log('First render')
    for (const raccoon of raccoonTeam) {
      if(!this.currentEntities.find(entity => entity === raccoon)){

        this.currentEntities.push(raccoon)
      }

      this.moveEntity(raccoon, [0, counter]);
      counter++;
    }
  }

  entityDeathHandler = (entity: Entity) => {
    if (entity.idName !== 'death') {
      entity.idName = 'death'
    }
    setTimeout(() => {
      entity.tile!.contents.splice(entity.tile!.contents.indexOf(entity), 1)
      this.currentEntities = this.currentEntities.filter((ent) => ent !== entity)
    }, 1400)
  }


  endCondition = () => { }
  shouldTick = (entityList: Entity[]) => {
    if (!this.roundInProgress) {
      return false; //round not started
    }
    if (this.enemyQueue) {
      return true; //round not over
    }
    let enemyCount = 0;
    console.log(entityList.length, 'Entities')
    entityList.forEach((critter: Entity) => {
      if (critter instanceof Enemy) {
        console.log('Baddy detected')
        enemyCount++;
        if (critter.position && critter.position[0] === 0) {
          this.setScreen!(3);
          console.log('Lose!');
          return false;
        }
      }
    });
    if (enemyCount === 0) {
      if (!this.rounds) {
        this.rounds = 1
      } else {
        this.rounds++;
      }
      //modal popup
      //modal should kick player to preround screen when they select an item
      return false;
    }
    return true;
  }

  createEnemy = (className: any) => {
    return new className()
  }
  generateEnemies = (difficulty: number): Enemy[] => {
    // start round should generate a list of enemies that it will generate for the round and where they will go, then begin a loop that continues until all enemies have been killed or the player has lost using the advance() method on enemies. It will loop over every enemy to call advance() on them
    let enemySpawns: Enemy[] = [];
    // ^ defines a stack/queue of enemies to place onto the board
    const possibleEnemies: any[] = [
      GoblinBasic,
      GoblinBasic,
      GoblinBasic,
      GoblinBasic,
      GoblinBasic,
      GoblinBasic,
      GoblinTank,
      GoblinTank,
      GoblinTank,
      GnomeWizard,
      GnomeWizard,
      GnomeWizard,
      PulsatingLump,
      PulsatingLump,
      Raven,
      Raven,
      Wraith,
      Wraith,
      Skeleton,
      Skeleton,
      Imp,
      Imp,
      Devil,
    ]; // TODO: write enemy types for this list
    // ^ this could be automatically generated later based off subclasses, and possibly a difficulty rating

    for (let i = 0; i < difficulty; i++) {
      const randIdx = Math.floor(Math.random() * possibleEnemies.length);
      const enemy = possibleEnemies[randIdx]
      enemySpawns.push(this.createEnemy(enemy)); // this may need to call new
    };// ^ randomly selects from the list of all enemies and pushes them to the enemy spawns queue
    this.enemyQueue = enemySpawns;
    return enemySpawns;
  };

}