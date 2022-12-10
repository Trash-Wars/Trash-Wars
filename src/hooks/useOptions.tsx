import React, { useContext, useState } from "react";
import { UserOptionsContext } from "../context/OptionsContext";

export function useOptions(initialState: boolean) {
  const [isOpen, setIsOpen] = useState(initialState);
  const toggle = () => setIsOpen(!isOpen);

  const Options = () => {
    const { userOptions, setUserOptions } = useContext(UserOptionsContext);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { name, value } = event.target;
      setUserOptions({ ...userOptions, [name]: value });
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
            <input
              name="music"
              type="radio"
              value="true"
              checked={userOptions.music === "true"}
              onChange={handleChange}
            />
            Music on
            <input
              name="music"
              type="radio"
              value="false"
              checked={userOptions.music === "false"}
              onChange={handleChange}
            />
            Music off
          </label>
          <label>
            <input
              name="soundfx"
              type="radio"
              value="true"
              checked={userOptions.soundfx === "true"}
              onChange={handleChange}
            />
            Soundfx on
            <input
              name="soundfx"
              type="radio"
              value="false"
              checked={userOptions.soundfx === "false"}
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
        <button onClick={toggle}>Close</button>
      </div>
    );
  };

  return { isOpen, toggle, Options };
}