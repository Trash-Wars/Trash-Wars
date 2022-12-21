import { useContext, useEffect, useState } from "react";
import { UserOptionsContext } from "../context/OptionsContext";

export const useSound = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { userOptions } = useContext(UserOptionsContext);
  useEffect(() => {
    const audio = new Audio(src);
    setAudio(audio);
  }, [src]);

  const play = () => {
    if (audio && userOptions.soundfx) {
      audio.volume = userOptions.volume / 60;
      audio.play();
    }
  };

  return { play };
};
