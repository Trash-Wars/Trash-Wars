import React, { useContext, useState } from "react";
import { Raccoon } from "../../classes/entity";
import { Apparel, Item, Weapon } from "../../classes/entity";
import { PersistenceContext } from "../../context/PersistenceContext";
import { paginate, range } from "../../helpers/array";
import useMousePosition from "../../hooks/useMousePosition";
import './Preround.css';
import raccoonIcon from '../../assets/doll.png';
import forward from '../../assets/ui/forward.png';
import backward from '../../assets/ui/back.png';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { useSound } from "../../hooks/useSound";
import dallERacc1 from '../../assets/raccoons/spearGuardingTrashRacc.png'
import dallERacc2 from '../../assets/raccoons/SmokingRacc.png'
import dallERacc3 from '../../assets/raccoons/motorcycleRacc.png'
import dallERacc4 from '../../assets/raccoons/firebrandRacc.png'
import dallERacc5 from '../../assets/raccoons/codingInHeckRacc.png'
import dallERacc6 from '../../assets/raccoons/orbPonderingRacc.png'
import dallERacc7 from '../../assets/raccoons/overworkedCodingRacc.png'
import dallERacc8 from '../../assets/raccoons/pilotRacc.png'
const itemEquip = require("../../assets/sounds/itemEquip.mp3");
const itemSelect = require("../../assets/sounds/itemSelect.mp3");
const buttonSelect = require("../../assets/sounds/buttonSelect.wav");
const ITEMS_PER_PAGE = 8
const raccArray =[dallERacc1,dallERacc2,dallERacc3, dallERacc4, dallERacc5,dallERacc6,dallERacc7,dallERacc8]

// give this type to anything that should pass or use handleGrab
type GrabSupported = {
  handleGrab: handleGrabFunc;
  grabbed?: Item;
}

type setGrabFunc = React.Dispatch<React.SetStateAction<Item | undefined>>;

type modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => void;

const Preround = () => {
  const { raccoonTeam } = useContext(PersistenceContext);

  const { inventory } = useContext(PersistenceContext)

  const { clientX, clientY } = useMousePosition()
  const [grabbed, setGrabbed] = useState<Item | undefined>(undefined)
  const { play: playSelect } = useSound(buttonSelect);

  function handleGrab(
    event: React.MouseEvent,
    modifySlot: modifySlotFunc,
    validItemInSlot?: (item: Item) => boolean,
  ) {
    const clickedOn = event.currentTarget;
    const clickedIndex = +clickedOn.classList.item(1)!;
    if (!(clickedOn instanceof HTMLDivElement)) {
      // some horrible edge case
      return;
    }
    if (grabbed && !(validItemInSlot!(grabbed))) {
      // ditto, different case
      return
    }

    modifySlot(grabbed, setGrabbed, clickedIndex)
  }

  function handleAddRaccoon(newRaccoon: Raccoon): void {
    let index = inventory.sidelineRaccoons.findIndex((raccoon: Raccoon) => raccoon.name === newRaccoon.name)
    let [raccoon] = inventory.sidelineRaccoons.splice(index, 1);
    raccoonTeam.push(raccoon);
    playSelect();
  }

  function handleRemoveRaccoonFromTeam(raccoonToRemove: Raccoon): void {
    let index = raccoonTeam.findIndex((raccoon: Raccoon) => raccoon.name === raccoonToRemove.name);
    if (raccoonToRemove.hat) {
      inventory.items.push(raccoonToRemove.hat)
    }
    if (raccoonToRemove.weapon) {
      inventory.items.push(raccoonToRemove.weapon)
    }
    raccoonToRemove.weapon = undefined
    raccoonToRemove.hat = undefined
    let [raccoon] = raccoonTeam.splice(index, 1)
    inventory.sidelineRaccoons.push(raccoon)
    playSelect();
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
          src={grabbed.sprite}
          alt={grabbed.name} />
      )}
      <div>
        <h1 style={{ textAlign: "center", marginTop: 0 }}>Prepare your Team...</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "2rem", marginBottom: '5rem' }}>
        {range(0, 3).map((i) => {
          return (
            <RaccoonSlot
              grabbed={grabbed}
              handleGrab={handleGrab}
              key={i}
              racIndex={i}
              raccoon={raccoonTeam[i]}
              handleAddRaccoon={handleAddRaccoon}
              handleRemoveRaccoonFromTeam={handleRemoveRaccoonFromTeam}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <InventoryCarousel
          handleGrab={handleGrab}
          grabbed={grabbed} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/gameboard">
          <button id="startButton"
            onClick={() => {
            playSelect();
            }}
            >
            Start Match
          </button>
        </Link>
      </div>
    </div>
  );
};

const InventoryCarousel = (props: GrabSupported) => {
  const { handleGrab, grabbed } = props;
  const { inventory } = useContext(PersistenceContext);
  const [page, setPage] = useState(0)
  const invBook = paginate(inventory.items, ITEMS_PER_PAGE)
  const { play: playItemSelect } = useSound(itemSelect);
  const { play: playSelect } = useSound(buttonSelect);

  const modifyInventory: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {
    if (grabbed) {
      inventory.items.splice(((page*8)+clickedIndex!), 0, grabbed)
      playItemSelect();
      setGrabbed(undefined);
    } else if(((page*ITEMS_PER_PAGE)+clickedIndex!+1) % ITEMS_PER_PAGE === 1 && page > 0) {
        handleSetPage(-1);
        const taken = inventory.items.splice(((page*ITEMS_PER_PAGE)+clickedIndex!), 1)[0]
        playItemSelect();
        setGrabbed(taken);
      }
      else{
        const taken = inventory.items.splice(((page*ITEMS_PER_PAGE)+clickedIndex!), 1)[0]
      playItemSelect();
      setGrabbed(taken);
      }
    }

  function isDimmed(item?: Item): boolean | undefined {
    if (!grabbed) {
      return !item;
    }
  }

  const handleSetPage = (num: number) => {
    setPage(page + num);
    playSelect();
  }

  return (
    <div style={{ display: "flex" }}>
      {page > 0 ? <img onClick={() => handleSetPage(-1)} className="forward-back" src={backward} alt="back" /> : <img className="forward-back" src={backward} alt="back" />}

      {range(1, ITEMS_PER_PAGE).map((_, i) => (
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
      {page < invBook.length - 1 ? <img onClick={() => handleSetPage(1)} className="forward-back" src={forward} alt="forward" /> : <img

        className="forward-back" src={forward} alt="forward" />}

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
  const { clientX, clientY } = useMousePosition();
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
          <img style={{ imageRendering: "pixelated" }} height={100} width={100} src={item.sprite} alt={item.name} />
        )}
      </div>
    </div>
  )
}
type RaccoonSlotProps = GrabSupported & {
  raccoon?: Raccoon;
  racIndex: number;
  handleAddRaccoon: (newRaccoon: Raccoon) => void;
  handleRemoveRaccoonFromTeam: (reaccoonToRemove: Raccoon) => void
}

const RaccoonSlot = (props: RaccoonSlotProps) => {
  const { raccoon, racIndex, handleGrab, grabbed,
  } = props;

  
  const { play: playEquip } = useSound(itemEquip);
  const { play: playSelect } = useSound(itemSelect);
  
  const { inventory } = useContext(PersistenceContext);

  const modifyWeapon: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {
    if (!raccoon) {
      console.warn("attempted to give a nonexistant raccoon a weapon");
      return;
    }
    if(raccoon.weapon){
      inventory.items.push(raccoon.weapon)
      raccoon.weapon = grabbed as Weapon;
    }
    if (grabbed) {
      raccoon.weapon = grabbed as Weapon;
      playEquip();
      setGrabbed(undefined);
    } else {
      setGrabbed(raccoon.weapon);
      playSelect();
      raccoon.weapon = undefined;
    }
  }

  const modifyApparel: modifySlotFunc = (grabbed: Item | undefined, setGrabbed: setGrabFunc, clickedIndex?: number) => {

    if (!raccoon) {
      console.warn("attempted to give a nonexistant raccoon a hat");
      return;
    }
    if(raccoon.hat){
      inventory.items.push(raccoon.hat)
      raccoon.hat = grabbed as Apparel;
    }
    if (grabbed) {
      raccoon.hat = grabbed as Apparel;
      playEquip();
      setGrabbed(undefined);
    } else {
      setGrabbed(raccoon.hat);
      playSelect();
      raccoon.hat = undefined;
    }
  }

  const validWeapon = (item: Item) => item instanceof Weapon;

  const validApparel = (item: Item) => item instanceof Apparel;

  const isDimmedWeapon = (item?: Weapon): boolean | undefined => {
    if (grabbed) {
      //can be in this slot
      return !validWeapon(grabbed);
    }
    //not empty
    return !item
  }

  const isDimmedApparel = (item?: Apparel): boolean | undefined => {
    if (grabbed) {
      //can be in this slot
      return !validApparel(grabbed);
    }
    //not empty
    return !item;
  }


  return (
    <div className="raccoon-slot">
      {raccoon ? (
        <>
        <div style={{
            color: 'red',
            cursor: 'pointer'
          }}
          onClick={(e) => props.handleRemoveRaccoonFromTeam(raccoon)}>
        &times;
        </div>
        <div>

          
            <img width={256} height={256} src={raccoonIcon} alt={raccoon.name}
            />
            <div className="raccoon-name">{raccoon.name}

            
          </div>
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
        </>
      ) : (
        <EmptyRaccoonSlot
          handleAddRaccoon={props.handleAddRaccoon}
        />
      )}
    </div>
  )
}

type emptyRaccoonSlotProps = {
  handleAddRaccoon: (newRaccoon: Raccoon) => void
}

const EmptyRaccoonSlot = (props: emptyRaccoonSlotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { play: playSelect } = useSound(buttonSelect);
  // const { sidelineRaccoons } = inventory;
  // const modalImage = portraits[raccIndex]
  const handleOpen = () => {
    setIsOpen(!isOpen);
    playSelect();
  }

  return (
    <div className="raccoon-name">
      <Modal
        centered
        show={isOpen}
        onHide={() => setIsOpen(false)}>
        <Modal.Body className="gold-modal raccoon-modal">
          <RaccoonCarousel handleAddRaccoon={props.handleAddRaccoon} />
        </Modal.Body>
      </Modal>
      <button className="raccSelectButton" onClick={() => handleOpen()}>Select a Raccoon</button>
    </div>
  )
}

type RaccoonCarouselProps = {
  handleAddRaccoon: (newRaccoon: Raccoon) => void
}

const RaccoonCarousel = (props: RaccoonCarouselProps) => {
  const { inventory } = useContext(PersistenceContext)
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number, e: any) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
      {inventory.sidelineRaccoons.map((raccoon: Raccoon, i) => {
        return (
          <Carousel.Item>
            <Card
              style={{ width: '18rem', height: '480px', imageRendering: 'pixelated' }}
            >
              <Card.Img variant="top" src={`${raccArray[i]}`} />
              <Card.Body>
                <Card.Title> {`${raccoon.name}`}</Card.Title>
                <Card.Text>
                  {`${raccoon.description}`}
                </Card.Text>
                <div id='addToTeamButtonContainer'>
                  <button id='addToTeamButton'
                    onClick={(e) => props.handleAddRaccoon(raccoon)}
                  >Add to Team</button>
                </div>
              </Card.Body>
            </Card>
          </Carousel.Item>
        )
      })}
    </Carousel>
  );
}
export default Preround;
