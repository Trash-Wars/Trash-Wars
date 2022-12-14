import { Enemy, Gameboard, } from '../../classes/entity';
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Entity, Raccoon, Axe } from '../../classes/entity';
import { ScreenContext } from '../../context/ScreenContext';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import racc from '../../assets/racc.png'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { range } from '../../helpers/array';
import { allTileBackgrounds } from '../../assets/grass/allTiles';

const Buttons = (props: any) => {
  const { setScreen } = useContext(ScreenContext)
  const { startRound } = props;
  const { winWidth, winHeight } = useWindowDimensions()
  if (winWidth > winHeight) {

    return (
      <div className="buttonsContainerWide">
        <button className="button">Options ⚙️</button>
        <button className="button" onClick={() => startRound()}>Start Round</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
      </div>
    )
  } else {

    return (
      <div className="buttonsContainerTall">
        <button className="button">Options ⚙️</button>
        <button className="button" onClick={() => startRound()}>Start Round</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
      </div>
    )
  }
}
const Board = () => {
  const persistence = useContext(PersistenceContext)
  const screen = useContext(ScreenContext)
  const { winWidth, winHeight } = useWindowDimensions()
  const [board] = useState(new Gameboard(6, 4))
  const [currentEntities, setCurrentEntities] = useState<Entity[]>([]);
  const [tileBackgrounds, setTileBackgrounds] = useState(['../../assets/grass/blue1.png'])

  const { tilePx, tileSize, entitySize } = getTileSize()
  function getTileSize() {
    const tilePx = (Math.min(winWidth / board.rows, winHeight / board.cols))
    return {
      tilePx,
      tileSize: { width: `${tilePx}px`, height: `${tilePx}px`, backgroundSize: `${tilePx}px` },
      entitySize: { width: `${tilePx - 1}px`, height: `${tilePx}px` },
    }
  }

  function getPosValues(entity: Entity): { marginLeft: string, marginTop: string } | undefined {
    if (!entity.position) return undefined;// If entity is (somehow) in the void, it has no position
    const pixelX = (entity.position[0] * tilePx) - (0.15 * entity.position[0])
    const pixelY = ((board.cols - 1 - entity.position[1]) * tilePx) + (board.cols - 1 - entity.position[1])
    return { marginLeft: `${pixelX}px`, marginTop: `${pixelY}px` }
  }

  const moveEntity = useCallback((entity: Entity, pos: [number, number]) => {
    const tile = board.getTile(pos);
    if (!tile) {
      console.warn(`Bad Position: Moving ${entity.name} to x:${pos[0]}, y:${pos[1]}`);
      return entity;
    }
    return entity.moveToPosition(tile)
  }, [board])

  //when game board loads, 
  useEffect(() => {
    const raccoons: Entity[] = [];
    let counter = 0;
    for (const raccoon of persistence.raccoonTeam) {
      raccoons.push(raccoon)
      moveEntity(raccoon, [0, counter]);
      counter++;
    }
    setCurrentEntities([...raccoons])
  }, [moveEntity, persistence])

  //on gameboardLoad, randomly get tilebackgrounds then save them into state
  useEffect(() => {
    setTileBackgrounds(range(0, board.cols * board.rows).map(_ => {
      return allTileBackgrounds[Math.round(Math.random() * 8)]
    }))
  }, [board.cols, board.rows])

  function debugPosition(event: React.MouseEvent<HTMLImageElement>, entity: Entity) {
    const { marginLeft, marginTop } = event.currentTarget.style
  }

  const EntityDamageHandler = (entity: Entity) => {
    if (entity.idName !== 'damage') {
      entity.idName = 'damage'
      setCurrentEntities([...currentEntities])
    }
    setTimeout(() => {
      entity.idName = '';
      setCurrentEntities([...currentEntities])
    }, 200)
    console.log(currentEntities)
  }

  const entityMovementHandler = (e: any, entity: Entity) => {
    console.log("entity", entity)
    entity.position![0]++
    setCurrentEntities([...currentEntities])
  }

  const doCombat = (entity: Entity) => {
    const zombie = new Enemy('Zombie', racc, 10, 5)
    moveEntity(zombie, [entity.position![0] + 1, entity.position![1]])
    if (entity instanceof Raccoon) {
      const raccoon = entity as Raccoon;
      raccoon.changeWeapon(new Axe());
      raccoon.useWeapon();
    };
    zombie.advance();
    EntityDamageHandler(entity)
    return;
  };


  const generateEnemies = (difficulty: number): Enemy[] => {
    // start round should generate a list of enemies that it will generate for the round and where they will go, then begin a loop that continues until all enemies have been killed or the player has lost using the advance() method on enemies. It will loop over every enemy to call advance() on them
    let enemySpawns: Enemy[] = [];
    // ^ defines a stack/queue of enemies to place onto the board
    const possibleEnemies: Enemy[] = []; // TODO: write enemy types for this list
    // ^ this could be automatically generated later based off subclasses, and possibly a difficulty rating

    for (let i = 0; i < difficulty; i++) {
      const randIdx = Math.round(Math.random() * possibleEnemies.length);
      const enemy = possibleEnemies[randIdx]
      enemySpawns.push(new Enemy('Zombie', racc, 10, 5)); // this may need to call new
    };// ^ randomly selects from the list of all enemies and pushes them to the enemy spawns queue
    return enemySpawns;
  };

  const findEnemySpawnTile = (): [number, number] | undefined => {
    const length = board.tiles.length;
    for (let i = length - 1; i >= length - 4; i--) { // starts at the last board tiles and checks moving forward for valid spawns through the final 4 tiles
      if (board.tiles[i].contents) {
        if (board.tiles[i].contents.find(entity => entity.isSolid)) continue;
      }
      // ^ if the contents of the spawn tile contains a solid, skip the tile
      return board.tiles[i].position;
      // ^ return the spawn tile that is open
    }
    return undefined;
  }

  const startRound = () => {
    const enemyQueue: Enemy[] = generateEnemies(5); // TODO: difficulty should be math on the current round with a multiplier. In other words, round# * 3 = enemy count
    const activeEnemies: Enemy[] = [];
    do {
      const spawnTile = findEnemySpawnTile()
      if (enemyQueue.length > 0 && spawnTile) activeEnemies.push(moveEntity(enemyQueue.pop()!, spawnTile) as Enemy);//moveEntity returns the entity
      // ^ searches for a valid spawn point
      // ^ moves an enemy from the queue to the battlefield at that spawn if valid
      // ^ assigns enemy to the currently active enemies list

      activeEnemies.forEach(enemy => enemy.advance());
      // raccoons need to hit back
    } while (activeEnemies.length > 0);
  };
  const entityDeathHandler = (entity: Entity) => {
    if (entity.idName !== 'death') {
      entity.idName = 'death'
      setCurrentEntities([...currentEntities])
    }
    setTimeout(() => {
      let holderArray = currentEntities.filter((ent) => ent.name !== entity.name)
      setCurrentEntities(holderArray)
    }, 1400)
  }

  return (

    <div className='board'>
      <Buttons startRound={startRound} />
      {currentEntities.map((entity, i) => (
        <img
          id={entity.idName}
          onMouseEnter={(e) => debugPosition(e, entity)}
          key={i}
          className={entity.className}
          onClick={() => entityDeathHandler(entity)}
          style={{ ...entitySize, ...getPosValues(entity) }}
          src={entity.emoji}
          alt={entity.name} />
      ))}
      {range(0, board.cols - 1).reverse().map(col => (
        <div className='rows' key={col} style={{ display: "flex" }}>
          {range(0, board.rows - 1).map((row) => (
            <>
              <div className="tile" style={{
                ...tileSize,
                backgroundImage: `url('${tileBackgrounds[(24 - row - col)]}')`
              }} key={row}>
                {row}, {col},
              </div>
            </>
          ))}
        </div>
      ))}
    </div>
  )
}

// TODO Conditionally render Pause/play button depending on whether or not the game is playing. 

const GameBoard = () => {
  return (
    <div className="gameBoard">
      <Board />
    </div>
  )
}

export default GameBoard
