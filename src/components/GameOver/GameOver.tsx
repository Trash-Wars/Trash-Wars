import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addScore } from "../../routes/routes";
import "./GameOver.css";
import { board } from "../GameBoard/GameBoard";
import { useSound } from "../../hooks/useSound";
const buttonSelect = require("../../assets/sounds/buttonSelect.wav");

type ScoreEntry = {
  _id: string;
  name: string;
  score: number;
  __v: number;
};

// TODO:will need to take these props from the gameboard to display number of rounds won in game

const GameOver = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isNewScore, setIsNewScore] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const { play: playSelect } = useSound(buttonSelect);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          "https://trash-wars-server.herokuapp.com/api/scores"
        );
        const data = await response.json();
        setScores(data.data);
        if (board.rounds === 0) {
          return;
        } else if (!scores.length) {
          setIsNewScore(true);
        } else {
          setIsNewScore(scores.some((match) => board.rounds > match.score));
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (clicked) {
      console.log("added to db");
    }
    fetchScores();
    console.log(board.rounds);
  }, [clicked]);

  return (
    <div id="GameOverContainer">
      <div id="scoreBoard">
        <div id="GameOver">
          <h1>Game Over</h1>
          <p>YOU SURVIVED {board.rounds} ROUNDS</p>
          <p>HIGH SCORES</p>
        </div>
        <table>
          <thead>
            <tr>
              <th id="tdhead">Rank</th>
              <th id="tdhead">Score</th>
              <th id="tdhead">Name</th>
            </tr>
          </thead>
          <tbody>
            {scores &&
              scores.map((match: ScoreEntry, idx: number) => {
                return (
                  <tr key={idx}>
                    <td id="tdbody">{idx + 1}</td>
                    <td id="tdbody">{match.score}</td>
                    <td id="tdbody">{match.name}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Link to="/">
          <button id="returnButton" onClick={() => playSelect()}>
            Return to Menu
          </button>
        </Link>
      </div>
      <ScoreModal
        isNewScore={isNewScore}
        setClicked={setClicked}
        setIsNewScore={setIsNewScore}
      />
    </div>
  );
};

type ScoreModalProps = {
  isNewScore: boolean;
  setClicked: (bool: boolean) => void;
  setIsNewScore: (bool: boolean) => void;
};

const ScoreModal: React.FC<ScoreModalProps> = ({
  isNewScore,
  setClicked,
  setIsNewScore,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name,
      score: board.rounds,
    };
    addScore(data);
    setIsNewScore(false);
    setClicked(true);
  };

  return (
    <Modal show={isNewScore} centered>
      <div className="gold-modal score-modal">
        <h1>New Score!</h1>
        <p>You won {board.rounds} rounds!</p>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            minLength={3}
            maxLength={3}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div>
            <button className="formButton" type="submit">
              Submit
            </button>
            <button
              className="formCloseButton"
              onClick={() => setIsNewScore(false)}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GameOver;
