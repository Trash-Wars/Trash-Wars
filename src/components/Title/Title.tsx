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
        <button className="titleButton" onClick={() => setScreen!(1)}>Start Game</button>
        <button className="titleButton" onClick={toggle}>Options</button>
        {/* <button onClick={() => electron.app.quit()}>Quit</button> */}
        <button className="titleButton" onClick={() => window.close()}>Quit</button>
      </div>
      {isOpen && <Options />}
    </div>
  );
}

export default Title;
