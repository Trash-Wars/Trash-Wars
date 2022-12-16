import React, { useContext } from "react";
import { ScreenContext } from "../../context/ScreenContext";
import { useOptions } from "../../hooks/useOptions/useOptions";
import { useSound } from "../../hooks/useSound";
import "./Title.css";
const buttonSelect = require("../../assets/sounds/buttonSelect.wav");

function Title() {
  const { setScreen } = useContext(ScreenContext);
  const { Options, isOpen, toggle } = useOptions(false);
  const { play: playSelect } = useSound(buttonSelect);

  const handleStart = () => {
    playSelect();
    setScreen!(1);
  };
  const handleOptions = () => {
    playSelect();
    toggle();
  };
  const handleQuit = () => {
    playSelect();
    window.close();
    /*electron.app.quit()*/
  };

  return (
    <div className="Title">
      <div>
        <h1>Trash Wars</h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }} >
        <button className="titleButton" onClick={handleStart}>
          Start Game
        </button>
        <button className="titleButton" onClick={handleOptions}>
          Options
        </button>
        <button className="titleButton" onClick={handleQuit}>
          Quit
        </button>
      </div>
      {isOpen && <Options />}
    </div>
  );
}

export default Title;
