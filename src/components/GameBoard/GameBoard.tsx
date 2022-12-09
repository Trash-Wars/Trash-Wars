import { Gameboard, } from '../../classes/entity';
import { useState, useEffect, useContext, useCallback } from 'react'
import { Entity, Raccoon } from '../../classes/entity';
import { ScreenContext } from '../../context/ScreenContext';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import racc from './racc.png'
import useWindowDimensions from '../../hooks/useWindowDimensions';

function range(start: number, end: number) {
  const ans: number[] = [];
  for (let i = start; i <= end; i++) {
      ans.push(i);
  }
  return ans;
}


const GameBoard = () => {
  const persistence = useContext(PersistenceContext)
  const screen = useContext(ScreenContext)
  const {winWidth} = useWindowDimensions()
  const [ board ] = useState(new Gameboard(6, 4))
  const [currentEntities, setCurrentEntities] = useState<Entity[]>([]);

  const {tilePx, tileSize, entitySize} = getTileSize()
  function getTileSize() {
    const tilePx = winWidth/board.rows
    return {
      tilePx,
      tileSize: {width: `${tilePx}px`, height: `${tilePx}px`},
      entitySize: {width: `${tilePx-1}px`, height: `${tilePx}px`},
    }
  }

  function getPosValues(entity: Entity): {marginLeft: string, marginTop: string} | undefined {
    if(!entity.position) return undefined;// If entity is (somehow) in the void, it has no position
    const pixelX = (entity.position[0] * tilePx) - (0.15 * entity.position[0])
    const pixelY = ((board.cols - 1 - entity.position[1]) * tilePx) + (board.cols - 1 - entity.position[1])
    return {marginLeft: `${pixelX}px`, marginTop: `${pixelY}px`}
  }

  useEffect(() => {
    for(const entity of currentEntities) {
      entity.cleanup()
    }
  }, [screen, currentEntities])

  const moveEntity = useCallback((entity: Entity, pos: [number, number]) => {
    const tile = board.getTile(pos);
    if(!tile) {
      console.warn(`Bad Position: Moving ${entity.name} to x:${pos[0]}, y:${pos[1]}`);
      return entity;
    }
    return entity.moveToPosition(tile)
  }, [board])

  //when game board loads, 
  useEffect(() => {
    const debugSpawns: Entity[] = [
      moveEntity(new Raccoon("Hugo", racc, 10), [0,0]),
      moveEntity(new Raccoon("Zayah", racc, 10), [1,1]),
      moveEntity(new Raccoon("Jim", racc, 10), [2,2]),
      moveEntity(new Raccoon("Luis", racc, 10), [3,3]),
    ]
    setCurrentEntities([...persistence.entities, ...debugSpawns])
  }, [moveEntity, persistence])

  function debugPosition(event: React.MouseEvent<HTMLImageElement>, entity: Entity) {
    // console.log(entity.position)
    const {marginLeft, marginTop} = event.currentTarget.style
    console.log(`${tilePx}:`, `${marginLeft}, ${marginTop}`)
  }

  return (
    <div className='board'>
      {currentEntities.map((entity, i) => (
        <img
          onMouseEnter={(e) => debugPosition(e, entity)}
          key={i}
          className='entity'
          style={{...entitySize, ...getPosValues(entity)}}
          src={entity.emoji}
          alt={entity.name} />
      ))}
      {range(0, board.cols - 1).reverse().map(col => (
        <div className='rows' key={col} style={{display: "flex" }}>
          {range(0, board.rows - 1).map((row) => (
            <>
            <div className="tile" style={{...tileSize}} key={row}>
              {row}, {col},
            </div>
            </>
          ))}
        </div>
      ))}
    </div>
  )
}

export default GameBoard
