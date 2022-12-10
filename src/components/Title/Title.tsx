import React, { useContext } from "react";
import { ScreenContext } from "../../context/ScreenContext";
import { useOptions } from "../../hooks/useOptions";
import "./Title.css";

function Title() {
  const { setScreen } = useContext(ScreenContext);
  const { Options, isOpen, toggle } = useOptions(false);

  return (
    <div className="Title">
      <div>
        <h1>Trash Wars</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button onClick={() => setScreen!(1)}>Start Game</button>
        <button onClick={toggle}>Options</button>
        {/* <button onClick={() => electron.app.quit()}>Quit</button> */}
        <button onClick={() => window.close()}>Quit</button>
      </div>
      {isOpen && <Options />}
    </div>
  );
}

export default Title;
