import React, { useContext, useState } from "react";
import { UserOptionsContext } from "../context/OptionsContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export function useOptions(initialState: boolean) {
  const [isOpen, setIsOpen] = useState(initialState);
  const toggle = () => setIsOpen(!isOpen);

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
      setUserOptions!({ ...userOptions, [name]: value });
    };

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "whitesmoke",
        }}
      >
        <h1>Options</h1>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <label>
            <div onClick={handleToggleMusic}>
              {userOptions.music ? (
                <FontAwesomeIcon icon={solid("volume-high")} />
              ) : (
                <FontAwesomeIcon icon={solid("volume-xmark")} />
              )}
              Music
            </div>
          </label>
          <label>
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
              name="volume"
              type="range"
              min="0"
              max="100"
              value={userOptions.volume}
              onChange={handleChangeVolume}
            />
          </label>
        </form>
        <button onClick={toggle}>Close</button>
      </div>
    );
  };

  return { isOpen, toggle, Options };
}
