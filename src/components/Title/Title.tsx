import { useContext } from "react";
import { ScreenContext } from "../../context/ScreenContext";

function Title() {
  const { setScreen } = useContext(ScreenContext);

  return (
    <div
      className="Title"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundImage: "",
      }}
    >
      <div>
        <h1>Trash Wars</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button onClick={() => setScreen!(2)}>Start Game</button>
        <button>Options</button>
        {/* <button onClick={() => electron.app.quit()}>Quit</button> */}
        <button onClick={() => window.close()}>Quit</button>
      </div>
    </div>
  );
}

export default Title;
