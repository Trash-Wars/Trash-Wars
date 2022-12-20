import { useOptions } from "../../hooks/useOptions/useOptions";
import { useSound } from "../../hooks/useSound";
import "./Title.css";
import titleImg from '../../assets/ui/title.png';
import { Link } from "react-router-dom";
const buttonSelect = require("../../assets/sounds/buttonSelect.wav");

function Title() {
  const { Options, isOpen, toggle } = useOptions(false);
  const { play: playSelect } = useSound(buttonSelect);

  const handleStart = () => {
    playSelect();
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
      <img src={titleImg} alt="Trash Wars" className="title-img" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }} >
        <Link to="/preround">
          <button className="titleButton" onClick={handleStart}>
            Start Game
          </button>
        </Link>
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
