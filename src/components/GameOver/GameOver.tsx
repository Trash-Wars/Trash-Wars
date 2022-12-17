import { useContext } from 'react';
import { PersistenceContext } from '../../context/PersistenceContext';
import { ScreenContext} from '../../context/ScreenContext'
import './GameOver.css'

// TODO:will need to take these props from the gameboard to display number of rounds won in game
// TODO: Allow user to see how the rounds they won compares to the global Leaderboard
// TODO IF user has won enough rounds to be on the leaderboard, allow them to enter their name and score into the leaderboard
const GameOver = () => {
  const {setScreen} =useContext(ScreenContext)
  const {rounds}  = useContext(PersistenceContext)

  return (
    <div id="GameOverContainer">
      <div id = "readables">
        <h1 id= "GameOver">Game Over 💀</h1>
        <p id = "GameOver">RoundsSurvived {rounds}</p>
        <button id = "button" onClick={() =>setScreen!(0)}>Return to Menu</button>
      </div>
    </div>
  )
}

export default GameOver;
