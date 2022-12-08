import { Gameboard, } from '../../classes/entity';
import { useState, useEffect, useContext, useCallback } from 'react'
import { Entity, Raccoon } from '../../classes/entity';
import { ScreenContext } from '../../context/ScreenContext';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import coconut from './coconut.jpg'
import racc from './racc.png'

function range(start: number, end: number) {
  const ans: number[] = [];
  for (let i = start; i <= end; i++) {
      ans.push(i);
  }
  return ans;
}

const ICON_SIZING = {width: "50px", height: "50px"}

const GameBoard = () => {
  const persistence = useContext(PersistenceContext)
  const screen = useContext(ScreenContext)

  const [ board ] = useState(new Gameboard(4, 6))

  const [currentEntities, setCurrentEntities] = useState<Entity[]>([]);

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
      moveEntity(new Raccoon("Zayah", racc, 10), [1,0]),
      moveEntity(new Raccoon("Jim", racc, 10), [2,0]),
      moveEntity(new Raccoon("Luis", racc, 10), [3,0]),
    ]
    setCurrentEntities([...persistence.entities, ...debugSpawns])
  }, [moveEntity, persistence])
  
  function getPosValues(entity: Entity): {marginLeft: string, marginTop: string} | undefined {
    if(!entity.position) return undefined;// If entity is (somehow) in the void, it has no position
    const pixelX = `${entity.position[0] * 51}px`
    const pixelY = `${entity.position[1] * 51}px`
    return {marginLeft: pixelX, marginTop: pixelY}
  }

  return (
    <div className='board'>
      {currentEntities.map((entity, i) => (
        <img
          key={i}
          className='entity'
          style={{...ICON_SIZING, ...getPosValues(entity)}}
          src={entity.emoji}
          alt={entity.name} />
      ))}
      {range(0, board.rows - 1).map(row => (
        <div className='rows' key={row} style={{display: "flex" }}>
          {range(0, board.cols - 1).map((col) => (
            <>
            <div className="tile" key={col}>
              {row + 1}, {col + 1},
            </div>
            </>
          ))}
        </div>
      ))}
    </div>
  )
}

export default GameBoard