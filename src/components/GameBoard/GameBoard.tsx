import { Enemy, Gameboard, } from '../../classes/entity';
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Entity, Raccoon, Axe, Mob } from '../../classes/entity';
import { ScreenContext } from '../../context/ScreenContext';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import racc from '../../assets/racc.png'
import coconut from '../../assets/coconut.jpg'
import hedgehog from '../../assets/hedgehog.png'
import grumpy from '../../assets/grumpy.jpeg'
import tiger from '../../assets/tigr.png'
import bread from '../../assets/bread.gif'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { range } from '../../helpers/array';
import { allTileBackgrounds } from '../../assets/grass/allTiles';
import { useOptions } from '../../hooks/useOptions/useOptions';
import { useSound } from '../../hooks/useSound';

const buttonSelect = require('../../assets/sounds/buttonSelect.wav')
const Buttons = (props: any) => {
  const { setScreen } = useContext(ScreenContext)
  const { startRound } = props;
  const { winWidth, winHeight } = useWindowDimensions()
  const {Options, isOpen, toggle} = useOptions(false)
  const { play: playSelect } = useSound(buttonSelect);
  const handleOptions = () => {
    playSelect();
    toggle();
  };
    return (
      <div className="buttons">
        <button className="button" onClick ={handleOptions}>Options ⚙️</button>
        <button className="button" onClick={() => startRound()}>Start Round ▶️</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
        {isOpen && <Options />}
      </div>
    )
  
}



const Board = () => {
  const persistence = useContext(PersistenceContext)
  const { winWidth, winHeight } = useWindowDimensions()
  const [board] = useState(new Gameboard(6, 4))
  const [currentEntities, setCurrentEntities] = useState<Entity[]>([]);
  const [tileBackgrounds, setTileBackgrounds] = useState(['../../assets/grass/blue1.png'])

  const { tilePx, tileSize, entitySize } = getTileSize()
  function getTileSize() {
    const tilePx = (Math.min(winWidth / board.rows, winHeight / board.cols))*.9115
    return {
      tilePx,
      tileSize: { width: `${tilePx}px`, height: `${tilePx}px`, backgroundSize: `${tilePx}px` },
      entitySize: { width: `${tilePx - 1}px`, height: `${tilePx}px` },
    }
  }

  function getPosValues(entity: Entity): { marginLeft: string, marginTop: string } | undefined {
    if (!entity.position) return undefined;// If entity is (somehow) in the void, it has no position
    const pixelX = ((entity.position[0] * tilePx) - (0.15 * entity.position[0]))
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
    if(currentEntities.length > 0) {
      return;
    }
    const raccoons: Entity[] = [];
    let counter = 0;
    for (const raccoon of persistence.raccoonTeam) {
      raccoons.push(raccoon)
      moveEntity(raccoon, [0, counter]);
      counter++;
      console.log('Raccoon coords', raccoon.position)
    }
    setCurrentEntities([...raccoons])
  }, [moveEntity, persistence])

  //on gameboardLoad, randomly get tilebackgrounds then save them into state
  useEffect(() => {
    setTileBackgrounds(range(0, board.cols * board.rows).map(el => {
      return allTileBackgrounds[Math.round(Math.random()*8)]
    }))
  }, [board.cols, board.rows])

  function debugPosition(event: React.MouseEvent<HTMLImageElement>, entity: Entity) {
    const { marginLeft, marginTop } = event.currentTarget.style
  }

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

  const generateEnemies = (difficulty: number): Enemy[] => {
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
    return possibleEnemies;
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

  //  
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));//request animationFrame rather than this?
  // ^ https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  // credit to StackOverflow for our sleep function

  // startRound should be a useEffect()
  // effect should read 'isRunning' bool  to start running game
  // button should toggle isRunning
  const startRound = async () => {
    const enemyQueue: Enemy[] = generateEnemies(5); // TODO: difficulty should be math on the current round with a multiplier. In other words, round# * 3 = enemy count

    let activeEnemies: number = 0;
    do {
      const spawnTile = findEnemySpawnTile();
      const entityList = [...currentEntities];
      if (enemyQueue.length > 0 && spawnTile) {
        const enemy = enemyQueue.pop()!
        moveEntity(enemy, spawnTile);
        entityList.push(enemy)
        activeEnemies++;
      };//moveEntity returns the entity
      // ^ searches for a valid spawn point
      // ^ moves an enemy from the queue to the battlefield at that spawn if valid
      // ^ assigns enemy to the currently active enemies list
      
      setCurrentEntities(entityList);
      //cleanup for dead entities
      // raccons.forEach attack
      // foreach entity do conditions
      // raccoons need to hit back
      // eslint-disable-next-line no-loop-func
      currentEntities.forEach(entity => {
        if (entity instanceof Raccoon) {
          entity.useWeapon();
        }
        if (entity instanceof Enemy) {
          entity.advance();
        }
        if (entity instanceof Mob) {

          //doCondition or other generics
          if (entity.health <= 0) {
            entityDeathHandler(entity);
            if (entity instanceof Enemy) {
              activeEnemies--;
            }
          }
        }
      });


      await sleep(1000);
    } while (activeEnemies > 0);
  };


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
