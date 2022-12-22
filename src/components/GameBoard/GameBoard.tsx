import { Gameboard } from '../../classes/gameboard';
import { useEffect, useContext, useCallback, useState } from 'react';
import { Entity, Raccoon } from '../../classes/entity';
import { PersistenceContext } from '../../context/PersistenceContext';
import './GameBoard.css'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { range } from '../../helpers/array';
import { useOptions } from '../../hooks/useOptions/useOptions';
import { useSound } from '../../hooks/useSound';
import fallbackGrass from '../../assets/grass/blue1.png';
import { Navigate, Link } from 'react-router-dom';

const buttonSelect = require('../../assets/sounds/buttonSelect.wav');
const gameStart = require("../../assets/sounds/gameStart.ogg");

const Buttons = (props: any) => {
  const { startRound } = props;
  const { Options, isOpen, toggle } = useOptions(false)
  const { play: playSelect } = useSound(buttonSelect);
  const { play: playStart } = useSound(gameStart);

  const handleOptions = () => {
    playSelect();
    toggle();
  };
  const handleStart = () => {
    playStart();
    startRound();
  }

  return (
    <div className="buttons">
      <button className="button" onClick={handleOptions}>Options ⚙️</button>
      <button className="button" onClick={() => handleStart()}>Start Round ▶️</button>
      <Link to="/gameover">
        <button className="button">Quit Out 🏳️</button>
      </Link>

      {isOpen && <Options />}
    </div>
  )

}
const board = new Gameboard(6, 4);

// https://stackoverflow.com/a/70633116
// Thank you Som Shekhar Mukherjee for saving us from near infinite board instances.
const Board = () => {
  const persistence = useContext(PersistenceContext)
  const { winWidth, winHeight } = useWindowDimensions()
  const [redirectString, setRedirectString] = useState<string | undefined>(undefined)
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  //const boardRef = useRef(new Gameboard(6, 4))
  //const board = boardRef.current as Gameboard

  const { tilePx, tileSize, entitySize } = getTileSize()
  function getTileSize() {
    const tilePx = (Math.min(winWidth / board.rows, winHeight / board.cols)) * .9115
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

  const redirectPage = (url: string) => {
    setRedirectString(url)
  }

  const firstRender = useCallback(() => {
    board.firstRender(persistence.raccoonTeam);
    board.rerender = forceUpdate;
    board.redirectPage = redirectPage;
  }, [persistence, forceUpdate])

  //when game board loads, 
  useEffect(() => firstRender(), [firstRender])
  
  // startRound should be a useEffect()
  // effect should read 'isRunning' bool  to start running game
  // button should toggle isRunning
  const startRound = async () => {
    // TODO: difficulty should be math on the current round with a multiplier. In other words, round# * 3 = enemy count
    if (!board.roundInProgress) {
      board.regenerate();
      const difficulty = board.rounds + 3;
      board.generateEnemies(difficulty);
    };

    board.roundInProgress = true;
  };

  if(redirectString) {
    return (
      <Navigate to={redirectString} />
    )
  }

  return (
    <div className='board'>
      <Buttons startRound={startRound} />
      {board.currentEntities.map((entity) => ( 
        <>
        <img
          id={entity.idName}
          key={entity.id}
          className={entity.className}
          onClick={() => board.entityDeathHandler(entity)}
          style={{ ...entitySize, ...getPosValues(entity), imageRendering: "pixelated" }}
          src={entity.sprite}
          alt={entity.name} />
          
        </>
        
          
          
      ))}
      {range(0, board.cols - 1).reverse().map(col => (
        <div className='rows' key={col} style={{ display: "flex" }}>
          {range(0, board.rows - 1).map((row) => {
            const tile = board.getTile([row, col]);
            if (!tile) {
              return (
                <div
                  key={row}
                  className="tile"
                  style={{
                    ...tileSize,
                    backgroundImage: fallbackGrass,
                  }} />
              )
            }
            return (
              <>
                <div
                  key={row}
                  className="tile"
                  style={{
                    ...tileSize,
                    backgroundImage: `url(${tile.background})`
                  }} />
              </>
            )
          })}
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

export {
  GameBoard,
  board,
};
