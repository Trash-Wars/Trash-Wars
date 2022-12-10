import { useContext, useState } from "react";
import { Item } from "../../classes/items";
import { PersistenceContext } from "../../context/PersistenceContext";
import { ScreenContext, SCREEN_GAMEBOARD } from "../../context/ScreenContext";
import { range } from "../../helpers/array";
import useMousePosition from "../../hooks/useMousePosition";
import './Preround.css'

const Preround = () => {
  const { setScreen } = useContext(ScreenContext);

  return (
    <div className="Preround">
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
              style={{
                width: "100px",
                height: "300px",
                border: "1px solid black",
              }} >
              item?
            </div>
          );
        })}
      </div>
      <div>
        <InventoryCarousel />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            setScreen!(SCREEN_GAMEBOARD);
          }}
        >
          Start Match
        </button>
      </div>
    </div>
  );
};

const InventoryCarousel = () => {
  const { inventory } = useContext(PersistenceContext);

  const {clientX, clientY} = useMousePosition()

  const [grabbed, setGrabbed] = useState<Item | undefined>(undefined)

  function startGrab(item: Item) {
    setGrabbed(item);
    window.addEventListener("mousedown", endGrab);
    window.addEventListener("mousemove", (e) => {
      console.log("MOUSE:",e.clientX)
    })
  }

  function endGrab() {
    setGrabbed(undefined);
    window.removeEventListener("mousedown", endGrab);
  }

  return (
    <div style={{ display: "flex" }}>
      {/* back button */}
      <img alt="back" />
        {range(1,8).map((_, i) => (
          <div className='inventory-slot'>
            {inventory.items[i] && (
              <div
                key={i}
                className='inventory-item'
                onClick={() => {startGrab(inventory.items[i])}}
                style={{
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: grabbed === inventory.items[i] ? "absolute" : "initial",
                  left: grabbed === inventory.items[i] ? clientX! - 50 : "initial",
                  top: grabbed === inventory.items[i] ? clientY! - 50 : "initial",
                }}>
                <img style={{imageRendering: "pixelated"}} height={100} width={100} src={inventory.items[i].image} alt="axe" />
              </div>
            )}
          </div>
        ))}
      <img alt="forward" />
    </div>
  )
}

export default Preround;
