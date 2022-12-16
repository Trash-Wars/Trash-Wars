import React, { useContext, useState } from "react";
import "./Options.css";
import { UserOptionsContext } from "../../context/OptionsContext";
import { useSound } from "../useSound";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Modal } from "react-bootstrap";

const buttonSelect = require("../../assets/sounds/buttonSelect.wav");

export function useOptions(initialState: boolean) {
  const { play: playSelect } = useSound(buttonSelect);

  const [isOpen, setIsOpen] = useState(initialState);
  const toggle = () => {
    playSelect();
    setIsOpen(!isOpen);
  };

  const Options = () => {
    const { userOptions, setUserOptions } = useContext(UserOptionsContext);

    const handleToggleMusic = () => {
      setUserOptions!({ ...userOptions, music: !userOptions.music });
    };

    const handleToggleSound = () => {
      setUserOptions!({ ...userOptions, soundfx: !userOptions.soundfx });
    };

    const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { name, value } = event.target;
      setUserOptions!({ ...userOptions, [name]: value }); // bang is temporary change PLEASE
    };

    return (
      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <div className="gold-modal options-modal">
          <h1>Options</h1>
          <form style={{ display: "flex", flexDirection: "column" }}>
            <label className="soundToggle">
              <div onClick={handleToggleMusic}>
                {userOptions.music ? (
                  <FontAwesomeIcon icon={solid("volume-high")} />
                ) : (
                  <FontAwesomeIcon icon={solid("volume-xmark")} />
                )}
                Music
              </div>
            </label>
            <label className="soundToggle">
              <div onClick={handleToggleSound}>
                {userOptions.soundfx ? (
                  <FontAwesomeIcon icon={solid("volume-high")} />
                ) : (
                  <FontAwesomeIcon icon={solid("volume-xmark")} />
                )}
                SoundFX
              </div>
            </label>
            <label>
              {userOptions.volume >= 50 ? (
                <FontAwesomeIcon icon={solid("volume-high")} />
              ) : userOptions.volume >= 1 ? (
                <FontAwesomeIcon icon={solid("volume-low")} />
              ) : (
                <FontAwesomeIcon icon={solid("volume-xmark")} />
              )}
              <input
                className="soundToggle"
                name="volume"
                type="range"
                min="0"
                max="100"
                value={userOptions.volume}
                onChange={handleChangeVolume}
              />
            </label>
          </form>
          <button className="closeButton" onClick={toggle}>
            Close
          </button>
        </div>
      </Modal>
    );
  };

  return { isOpen, toggle, Options };
}
