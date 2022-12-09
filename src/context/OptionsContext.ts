import { createContext } from "react";

export type UserOptions = {
  music: true | false;
  soundfx: true | false;
  volume: number;
};

export type UserOptionsContextProps = {
  userOptions: UserOptions;
  setUserOptions: (userOptions: UserOptions) => void;
};

export const userOptionsInitialState: UserOptions = {
  music: true,
  soundfx: true,
  volume: 50,
};

export const UserOptionsContext = createContext<UserOptionsContextProps>({
  userOptions: {
    music: true,
    soundfx: true,
    volume: 50,
  },
  setUserOptions: () => {},
});
