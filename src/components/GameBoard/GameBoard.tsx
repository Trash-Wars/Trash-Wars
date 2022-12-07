import { Gameboard, ROWS, COLS } from '../../classes/entity';
import { useState } from 'react'
import './GameBoard.css'

function range(start: number, end: number) {
  const ans: number[] = [];
  for (let i = start; i <= end; i++) {
      ans.push(i);
  }
  return ans;
}

const ICON_SIZING = {width: "50px", height: "50px"}

const GameBoard = () => {
  const [ board ] = useState(new Gameboard())

  const [emoji, setEmoji] = useState([0,0]);

  return (
    <div>
      <img
        className='entity'
        onClick={() => setEmoji([0, emoji[1] + 1])}
        style={{...ICON_SIZING, marginLeft: `${emoji[1] * 50}px`}}
        src="https://hotemoji.com/images/emoji/z/1xbdigigcv6zz.png"
        alt='roblox' />
      {range(0, ROWS - 1).map(row => (
        <div style={{display: "flex" }}>
          {range(0, COLS - 1).map((col) => (
            <>
            <div className="tile" key={col}>
              {/* {board.tiles.get([row, col])} */}
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