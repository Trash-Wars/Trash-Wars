
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { PersistenceContext } from '../../context/PersistenceContext';

import { ScreenContext} from '../../context/ScreenContext'
import { addScore } from '../../routes/routes';
import './GameOver.css'


type ScoreEntry = {
  _id: string,
  name: string,
  score: number,
  __v: number
}

// TODO:will need to take these props from the gameboard to display number of rounds won in game

const GameOver = () => {
  const {setScreen} =useContext(ScreenContext)

  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isNewScore, setIsNewScore] = useState<boolean>(false);
  const [roundsWon, setRoundsWon] = useState<number>(0);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          "https://trash-wars-server.herokuapp.com/api/scores"
        );
        const data = await response.json();
        setScores(data.data);
        setIsNewScore(scores.some((match) => roundsWon > match.score));
      } catch (error) {
        console.error(error);
      }
    };
    fetchScores();
  }, [roundsWon, scores]);

  const {rounds}  = useContext(PersistenceContext)

  return (
    <div id="GameOverContainer">
      <div id = "readables">
        <h1 id= "GameOver">Game Over 💀</h1>
        {isNewScore || roundsWon === 0 ? null : <p id = "GameOver">YOU SURVIVED {rounds} ROUNDS</p>}
        <p id = "GameOver">HIGH SCORES</p>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Score</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {scores && scores.map((match: ScoreEntry, idx: number) => {
              return (
                <tr key={idx}>
                  <td>{idx+1}</td>
                  <td>{match.score}</td>
                  <td>{match.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <button id = "button" onClick={() =>setScreen!(0)}>Return to Menu</button>
        <ScoreModal isNewScore={isNewScore} roundsWon={roundsWon} setRoundsWon={setRoundsWon}/>
      </div>
    </div>
  )
}

type ScoreModalProps = {
  roundsWon: number;
  isNewScore: boolean;
  setRoundsWon: (num: number) => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({isNewScore, roundsWon, setRoundsWon}) => {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name,
      score: roundsWon,
    };
    addScore(data);
    setRoundsWon(0);
  }

  return (
    <Modal show={isNewScore} centered>
      <div className="gold-modal score-modal">
        <h1>New High Score!</h1>
        <p>You won {roundsWon} rounds!</p>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            maxLength={3}
            value={name}
            onChange={(event) => setName(event.target.value)}
            />
          <button type="submit">Submit</button>
        </form>
      </div>
    </Modal>
  )
}

export default GameOver;
