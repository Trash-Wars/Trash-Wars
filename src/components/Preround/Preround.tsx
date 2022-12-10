import { useContext, useState } from "react";
import { Raccoon } from "../../classes/entity";
import { Apparel, Item, Weapon } from "../../classes/entity";
import { PersistenceContext } from "../../context/PersistenceContext";
import { ScreenContext, SCREEN_GAMEBOARD } from "../../context/ScreenContext";
import { range } from "../../helpers/array";
import useMousePosition from "../../hooks/useMousePosition";
import './Preround.css'
import raccoonIcon from '../../assets/human_m.png';

const Preround = () => {
  const { raccoonTeam } = useContext(PersistenceContext);
  const { setScreen } = useContext(ScreenContext);

  return (
    <div className="Preround">
      <div>
        <h1 style={{ textAlign: "center", marginTop: 0 }}>Prepare your Team...</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {range(0, 3).map((i) => {
          return (
            <RaccoonSlot racIndex={i} raccoon={raccoonTeam[i]} />
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
  const { inventory, raccoonTeam } = useContext(PersistenceContext);

  const {clientX, clientY} = useMousePosition()

  const [grabbed, setGrabbed] = useState<Item | undefined>(undefined)

  function startGrab(item: Item) {
    setGrabbed(item);
    console.log("grabbed", item)
    window.addEventListener("mousedown", endGrab);
  }

  function endGrab(event: MouseEvent) {
    const clickedOn = event.target
    if(!(clickedOn instanceof HTMLDivElement)) {
      return;
    }
    let racIndex = +clickedOn.classList.item(1)!;
    const equippingRaccoon = raccoonTeam[racIndex];

    if(clickedOn.classList.contains('weapon-slot')) {
      if(grabbed instanceof Weapon) {
        equippingRaccoon.weapon = grabbed
      }
    }

    if(clickedOn.classList.contains('hat-slot')) {
      if(grabbed instanceof Apparel) {
        equippingRaccoon.hat = grabbed
      }
    }

    setGrabbed(undefined);
    window.removeEventListener("mousedown", endGrab);
  }

  return (
    <div style={{ display: "flex" }}>
      {/* back button */}
      <img alt="back" />
        {range(1,8).map((_, i) => (
          <ItemSlot
            key={i}
            item={inventory.items[i]}
            onClick={inventory.items[i] ? () => {startGrab(inventory.items[i])} : undefined}
            itemStyle={{
              pointerEvents: grabbed === inventory.items[i] ? "none" : "initial",
              position: grabbed === inventory.items[i] ? "absolute" : "initial",
              left: grabbed === inventory.items[i] ? clientX || 0 - 50 : "initial",
              top: grabbed === inventory.items[i] ? clientY || 0 - 50 : "initial",
            }} />
        ))}
      <img alt="forward" />
    </div>
  )
}

type ItemSlotProps = {
  item?: Item;
  raccoon?: Raccoon;
  onClick?: () => void;
  className?: string;
  itemStyle?: any;
}

const ItemSlot = (props: ItemSlotProps) => {
  const { item, itemStyle, className } = props;

  return (
    <div className={`inventory-slot ${className}`}>
      <div
        onClick={props.onClick}
        style={itemStyle}>
        {item && (
          <img style={{imageRendering: "pixelated"}} height={100} width={100} src={item.emoji} alt={item.name} />
          )}
      </div>
    </div>
  )
}

type RaccoonSlotProps = {
  raccoon?: Raccoon
  racIndex: number;
}

const RaccoonSlot = (props: RaccoonSlotProps) => {
  const { raccoon, racIndex } = props;
  return (
    <div className="raccoon-slot">
      {raccoon ? (
        <div>
          <img width={256} height={256} src={raccoonIcon} alt={raccoon.name} />
          <ItemSlot
            className={`${racIndex} weapon-slot`}
            raccoon={raccoon}
            item={raccoon.weapon} />
          <ItemSlot
            className={`${racIndex} hat-slot`}
            raccoon={raccoon}
            item={raccoon.hat} />
        </div>
      ) : (
        <div>
          Select a Raccoon
        </div>
      )}
    </div>
  )
}

export default Preround;
