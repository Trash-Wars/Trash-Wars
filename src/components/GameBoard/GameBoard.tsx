import { Gameboard, } from '../../classes/entity';
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Entity, Raccoon, Axe } from '../../classes/entity';
import { ScreenContext } from '../../context/ScreenContext';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import racc from '../../assets/racc.png'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { range } from '../../helpers/array';





const Board = () => {
  const persistence = useContext(PersistenceContext)
  const screen = useContext(ScreenContext)
  const { winWidth, winHeight } = useWindowDimensions()
  const [board] = useState(new Gameboard(6, 4))
  const [currentEntities, setCurrentEntities] = useState<Entity[]>([]);

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
    // const zayah = new Raccoon("Zayah", racc, 10)
    // const debugSpawns: Entity[] = [
    //   moveEntity(new Raccoon("Hugo", racc, 10), [1, 1]),
    //   moveEntity(zayah, [0, 1]),
    //   moveEntity(new Raccoon("Jim", racc, 10), [0, 2]),
    //   moveEntity(new Raccoon("Luis", racc, 10), [0, 3]),
    // ]
    // console.log(zayah)
    // zayah.changeWeapon(new Axe());
    // zayah.useWeapon()
    const raccoons: Entity[] = [];
    let counter = 0;
    for (const raccoon of persistence.raccoonTeam) {
      raccoons.push(raccoon)
      moveEntity(raccoon, [0, counter]);
      counter++;
    }
    setCurrentEntities([...raccoons])
  }, [moveEntity, persistence])

  function debugPosition(event: React.MouseEvent<HTMLImageElement>, entity: Entity) {
    // console.log(entity.position)
    const { marginLeft, marginTop } = event.currentTarget.style
    console.log(`${tilePx}:`, `${marginLeft}, ${marginTop}`)
  }
  // add timer on class transition
  const raccoonDamageHandler = (e: any, entity: Entity) => {
    let initialClass = entity.className
    console.log("entity", entity)
    console.log("e.target", e.target)
    if (entity.className === `${initialClass}`) entity.className = `${initialClass} damage`;
    setCurrentEntities([...currentEntities]);
    setTimeout(() => {
      entity.className = `${initialClass}`
      setCurrentEntities([...currentEntities]);
      console.log('time over');
    }, 200)
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


  return (
    <div className='board'>
      {currentEntities.map((entity, i) => (
        <img
          onMouseEnter={(e) => debugPosition(e, entity)}
          key={i}
          className={entity.className}
          onClick={(e) => entityMovementHandler(e, entity)}
          style={{ ...entitySize, ...getPosValues(entity) }}
          src={entity.emoji}
          alt={entity.name} />
      ))}
      {range(0, board.cols - 1).reverse().map(col => (
        <div className='rows' key={col} style={{ display: "flex" }}>
          {range(0, board.rows - 1).map((row) => (
            <>
              <div className="tile" style={{ ...tileSize }} key={row}>
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
    console.log("wide")
    return (

      <div className="buttonsContainerWide">
        <button className="button">Options ⚙️</button>
        <button className="button">Pause ⏸️</button>
        <button className="button" onClick={() => setScreen!(3)}>Quit Out 🏳️</button>
      </div>
    )
  } else {
    console.log("tall")
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
