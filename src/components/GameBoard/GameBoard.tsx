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
// import grass1 from '../../assets/grass/allTiles'

// const initialTileState = [
//   '../../assets/grass/blue1.png'
// ]

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
  useEffect(()=> {
    setTileBackgrounds(range(0,board.cols*board.rows).map(_=> {
      return allTileBackgrounds[Math.round(Math.random()*8)]
    }))
     
      // setTileBackgrounds([...tileBackgrounds, allTileBackgrounds[Math.round(Math.random()*9)]])
    
    
  }, [board.cols, board.rows])
  
  function debugPosition(event: React.MouseEvent<HTMLImageElement>, entity: Entity) {
    const { marginLeft, marginTop } = event.currentTarget.style
  }
  // add timer on id transition
  const EntityDamageHandler = ( entity: Entity) => {
    // let initialClass = entity.className
    // if (entity.className === `${initialClass}`) entity.className = `${initialClass} damage`;
    // setCurrentEntities([...currentEntities]);
    // setTimeout(() => {
    //   entity.className = `${initialClass}`
    //   setCurrentEntities([...currentEntities]);
    //   console.log('time over');
    // }, 200)

    if(entity.idName !== 'damage'){
      entity.idName = 'damage'
      setCurrentEntities([...currentEntities])
    }
    setTimeout(()=> {
      entity.idName='';
      setCurrentEntities([...currentEntities])
    },200)
    console.log(currentEntities)
  }

  const entityMovementHandler = (e: any, entity: Entity) => {
    console.log("entity", entity)
    //set interval is for testing purposes only
    // setInterval(() => {
    //   entity.position![0] =0
    // }, 2000)
    //only moves in the horizontal direction
    // would have to set to -- for mobs moving against noble raccoons
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

  const entityDeathHandler = (entity:Entity) => {
    if(entity.idName !== 'death'){
      entity.idName = 'death'
      setCurrentEntities([...currentEntities])
    }
    setTimeout(()=> {
      entity.idName='';
      setCurrentEntities([...currentEntities])
      console.log(entity)
    },1000)
    console.log(entity.idName)
  }
// look into reading 

  return (
    <div className='board'>
      {currentEntities.map((entity, i) => (
        <img
          id = {entity.idName}
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
              <div className="tile" style={{ ...tileSize,
                 backgroundImage: `url('${tileBackgrounds[(24-row-col)]}')`
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
const Buttons = () => {
  const { setScreen } = useContext(ScreenContext)
  const { winWidth, winHeight } = useWindowDimensions()
  if (winWidth > winHeight) {
    // console.log("wide")
    return (
      <div className="buttonsContainerWide">
        <button className="button">Options ⚙️</button>
        <button className="button">Pause ⏸️</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
      </div>
    )
  } else {
    // console.log("tall")
    return (
      <div className="buttonsContainerTall">
        <button className="button">Options ⚙️</button>
        <button className="button">Pause ⏸️</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
      </div>
    )
  }
}

const GameBoard = () => {
  return (
    <div className="gameBoard">
      <Board />
      <Buttons />
    </div>
  )
}

export default GameBoard
