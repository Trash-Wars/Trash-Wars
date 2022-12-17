import React, { useContext, useState } from "react";
import { Raccoon } from "../../classes/entity";
import { Apparel, Item, Weapon } from "../../classes/entity";
import { PersistenceContext } from "../../context/PersistenceContext";
import { ScreenContext, SCREEN_GAMEBOARD } from "../../context/ScreenContext";
import { paginate, range } from "../../helpers/array";
import useMousePosition from "../../hooks/useMousePosition";
import './Preround.css';
import raccoonIcon from '../../assets/doll.png';
import todo from '../../assets/todo.png';
import Modal from 'react-bootstrap/Modal';
import { portraits } from "../../assets/portrait/portraits";
import { url } from "inspector";

const ITEMS_PER_PAGE = 8

// give this type to anything that should pass or use handleGrab
type GrabSupported = {
  handleGrab: handleGrabFunc;
  grabbed?: Item;
}

type setGrabFunc = React.Dispatch<React.SetStateAction<Item | undefined>>;

type modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => void;

const Preround = () => {
  const { raccoonTeam } = useContext(PersistenceContext);
  const { setScreen } = useContext(ScreenContext);

  const {clientX, clientY} = useMousePosition()

  const [grabbed, setGrabbed] = useState<Item | undefined>(undefined)

  function handleGrab(
    event: React.MouseEvent,
    modifySlot: modifySlotFunc,
    validItemInSlot?: (item: Item) => boolean,
    ) {
    const clickedOn = event.currentTarget;
    const clickedIndex = +clickedOn.classList.item(1)!;
    if(!(clickedOn instanceof HTMLDivElement)) {
      // some horrible edge case
      return;
    }
    if(grabbed && !(validItemInSlot!(grabbed))) {
      // ditto, different case
      return
    }

    modifySlot(grabbed, setGrabbed, clickedIndex)
  }

  return (
    <div className="Preround">
      {grabbed && (
        <img
          style={{
            imageRendering: "pixelated",
            position: "absolute",
            left: clientX,
            top: clientY,
            zIndex: 99,
            pointerEvents: "none",
          }}
          height={100}
          width={100}
          src={grabbed.emoji}
          alt={grabbed.name} />
      )}
      <div>
        <h1 style={{ textAlign: "center", marginTop: 0 }}>Prepare your Team...</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "2rem" }}>
        {range(0, 3).map((i) => {
          return (
            <RaccoonSlot
              grabbed={grabbed}
              handleGrab={handleGrab}
              key={i}
              racIndex={i}
              raccoon={raccoonTeam[i]} />
          );
        })}
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <InventoryCarousel
          handleGrab={handleGrab}
          grabbed={grabbed} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{color:"white"}}
          onClick={() => {
            setScreen!(SCREEN_GAMEBOARD);
          }} >
          Start Match
        </button>
      </div>
    </div>
  );
};

const InventoryCarousel = (props: GrabSupported) => {
  const { handleGrab, grabbed } = props;
  const { inventory } = useContext(PersistenceContext);
  const [page, setPage] = useState(0)

  const modifyInventory: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {
    if(grabbed) {
      inventory.items.splice(clickedIndex!, 0, grabbed)
      setGrabbed(undefined);
    } else {
      const taken = inventory.items.splice(clickedIndex!, 1)[0]
      setGrabbed(taken);
    }
  }

  function isDimmed(item?: Item): boolean | undefined {
    if(!grabbed) {
      return !item;
    }
  }

  const invBook = paginate(inventory.items, ITEMS_PER_PAGE)

  return (
    <div style={{ display: "flex" }}>
      <img onClick={() => setPage(page - 1)} className="forward-back" src={todo} alt="back" />
        {range(1,ITEMS_PER_PAGE).map((_, i) => (
          <ItemSlot
            dimmed={isDimmed(invBook[page][i])}
            validItemInSlot={() => true} //all items welcome, obviously
            modifySlot={modifyInventory}
            key={i}
            item={invBook[page][i]}
            className={`${i}`}
            handleGrab={handleGrab}
            grabbed={grabbed} />
        ))}
      <img onClick={() => setPage(page + 1)} className="forward-back" src={todo} alt="forward" />
    </div>
  )
}

type ItemSlotProps = GrabSupported & {
  item?: Item;
  raccoon?: Raccoon;
  onClick?: any;
  className?: string;
  itemStyle?: any;
  validItemInSlot: (item: Item) => boolean;
  modifySlot: modifySlotFunc;
  dimmed?: boolean
}

type handleGrabFunc = (
  event: React.MouseEvent,
  modifySlot: modifySlotFunc,
  validItemInSlot?: (item: Item) => boolean,
  ) => void;

const ItemSlot = (props: ItemSlotProps) => {
  const {
    item,
    itemStyle,
    className,
    handleGrab,
    grabbed,
    modifySlot,
    validItemInSlot,
    dimmed,
  } = props;
  const {clientX, clientY} = useMousePosition();

  const isGrabbed = grabbed === item

  const grabStyle: React.CSSProperties = {
    position: isGrabbed ? "absolute" : "initial",
    left: isGrabbed ? (clientX || 0) - 50 : "initial",
    top: isGrabbed ? (clientY || 0) - 50 : "initial",
  }

  return (
    <div
      onClick={(e: React.MouseEvent) => handleGrab(e, modifySlot, validItemInSlot)}
      className={`inventory-slot ${className} ${dimmed && "dimmed"}`} >
      <div
        style={{
          ...itemStyle,
          ...grabStyle,
          height: "inherit",
          pointerEvents: grabbed === item ? "none" : "initial",
        }}>
        {item && (
          <img style={{imageRendering: "pixelated"}} height={100} width={100} src={item.emoji} alt={item.name} />
          )}
      </div>
    </div>
  )
}

type RaccoonSlotProps = GrabSupported & {
  raccoon?: Raccoon
  racIndex: number;
}

const RaccoonSlot = (props: RaccoonSlotProps) => {
  const { raccoon, racIndex, handleGrab, grabbed } = props;

  const modifyWeapon: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {
    if(!raccoon) {
      console.warn("attempted to give a nonexistant raccoon a weapon");
      return;
    }
    if(grabbed) {
      raccoon.weapon = grabbed as Weapon;
      setGrabbed(undefined);
    } else {
      setGrabbed(raccoon.weapon);
      raccoon.weapon = undefined;
    }
  }

  const modifyApparel: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {

    if(!raccoon) {
      console.warn("attempted to give a nonexistant raccoon a hat");
      return;
    }
    if(grabbed) {
      raccoon.hat = grabbed as Apparel;
      setGrabbed(undefined);
    } else {
      setGrabbed(raccoon.hat);
      raccoon.hat = undefined;
    }
  }

  const validWeapon = (item: Item) => item instanceof Weapon;

  const validApparel = (item: Item) => item instanceof Apparel;

  const isDimmedWeapon = (item?: Weapon): boolean | undefined => {
    if(grabbed) {
      //can be in this slot
      return !validWeapon(grabbed);
    }
    //not empty
    return !item
  }

  const isDimmedApparel = (item?: Apparel): boolean | undefined => {
    if(grabbed) {
      //can be in this slot
      return !validApparel(grabbed);
    }
    //not empty
    return !item;
  }

  return (
    <div className="raccoon-slot">
      {raccoon ? (
        <div>
          <img width={256} height={256} src={raccoonIcon} alt={raccoon.name} />
          <div className="raccoon-name">{raccoon.name}</div>
          <ItemSlot
            validItemInSlot={validWeapon}
            dimmed={isDimmedWeapon(raccoon.weapon)}
            modifySlot={modifyWeapon}
            handleGrab={handleGrab}
            className={`${racIndex} weapon-slot`}
            raccoon={raccoon}
            item={raccoon.weapon} />
          <ItemSlot
            validItemInSlot={validApparel}
            dimmed={isDimmedApparel(raccoon.hat)}
            modifySlot={modifyApparel}
            handleGrab={handleGrab}
            className={`${racIndex} hat-slot`}
            raccoon={raccoon}
            item={raccoon.hat} />
        </div>
      ) : (
        <EmptyRaccoonSlot />
      )}
    </div>
  )
}

const EmptyRaccoonSlot = () => {
  
  const {inventory} = useContext(PersistenceContext)
  const [isOpen, setIsOpen] = useState(false);
  const [raccIndex, setRaccIndex] = useState(0);
  const {sidelineRaccoons} = inventory;

  const possibleRaccoon = sidelineRaccoons[raccIndex];
  const modalImage = portraits[raccIndex]

 const activeRaccoonHandler = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, newRaccoon:Raccoon) => {
  console.log(newRaccoon)
  }
  
  return (
    <div className="raccoon-name">
      <Modal
        
        centered
        show={isOpen}
        onHide={() => setIsOpen(false)}>
        <Modal.Body className="gold-modal raccoon-modal"
        style = {{
          backgroundImage: `url(${modalImage})`
        }}
        >
          <div>
            
          </div>
          <div className="rm-section"><h3>{possibleRaccoon.name}</h3>
          <p>
            HI{possibleRaccoon!.description}
          </p>
          <p>
            Health:{possibleRaccoon.health}
          </p>
          
          </div>
          
        </Modal.Body>
        <button id = 'button'
        onClick = {(e)=> activeRaccoonHandler(e, possibleRaccoon)}
        >Add to Team</button>
      </Modal>
      <button onClick={() => setIsOpen(!isOpen)}>Select a Raccoon</button>
    </div>
  )
}

export default Preround;
