import { useContext, useRef, useState } from "react";
import { ScreenContext } from "../../context/ScreenContext";

const Preround = () => {
  const { setScreen } = useContext(ScreenContext);
  const [selectedItem, setSelectedItem] = useState("");
  const [item, setItem] = useState("");

  const [highlighted, setHighlighted] = useState(false);

  const divRef = useRef(null);
  const handleClick = () => {
    const value = divRef.current.innerText;
    setHighlighted(true);
    setSelectedItem(value);
  };
  const handleEquip = () => {
    setItem(selectedItem);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundImage: "",
      }}
    >
      <div style={{ position: "absolute", top: "0", left: "0" }}>
        <button
          onClick={() => {
            setScreen!(1);
          }}
        >
          Back to home
        </button>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>preround</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {[1, 2, 3, 4].map(() => {
          return (
            <div
              onClick={handleEquip}
              style={{
                width: "100px",
                height: "300px",
                border: "1px solid black",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(() => {
          return (
            <div
              ref={divRef}
              onClick={handleClick}
              style={{
                width: "100px",
                height: "100px",
                border: highlighted ? "2px solid red" : "1px solid black",
                boxSizing: "border-box",
              }}
            >
              🪓
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            setScreen!(3);
          }}
        >
          Start Match
        </button>
      </div>
    </div>
  );
};

export default Preround;
