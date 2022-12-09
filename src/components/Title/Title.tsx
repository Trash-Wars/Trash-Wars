import React, { useContext, useState } from "react";
import { UserOptionsContext } from "../../context/OptionsContext";
import { ScreenContext } from "../../context/ScreenContext";
import "./Title.css";

function Title() {
  const { setScreen } = useContext(ScreenContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
        <button onClick={() => setScreen!(1)}>Start Game</button>
        <button onClick={toggleModal}>Options</button>
        {/* <button onClick={() => electron.app.quit()}>Quit</button> */}
        <button onClick={() => window.close()}>Quit</button>
      </div>
      {isOpen && <Options toggleModal={toggleModal} />}
    </div>
  );
}

type OptionsProps = {
  toggleModal: () => void;
};

function Options(props: OptionsProps) {
  const { userOptions, setUserOptions } = useContext(UserOptionsContext);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserOptions({ ...userOptions, [name]: value });
    console.log(name, value, userOptions);
  };

  return (
    <div>
      <h1>Options</h1>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label>
          <input
            name="music"
            type="radio"
            value="true"
            checked={userOptions.music === true}
            onChange={handleChange}
          />
          Music on
          <input
            name="music"
            type="radio"
            value="false"
            checked={userOptions.music === false}
            onChange={handleChange}
          />
          Music off
        </label>
        <label>
          <input
            name="soundfx"
            type="radio"
            value="true"
            checked={userOptions.soundfx === true}
            onChange={handleChange}
          />
          Soundfx on
          <input
            name="soundfx"
            type="radio"
            value="false"
            checked={userOptions.soundfx === false}
            onChange={handleChange}
          />
          Soundfx off
        </label>
        <label>
          <input
            name="volume"
            type="range"
            min="0"
            max="100"
            value={userOptions.volume}
            onChange={handleChange}
          />
          Volume
        </label>
      </form>
      <button onClick={props.toggleModal}>Close</button>
    </div>
  );
}

export default Title;
