import { createContext } from "react";

export type UserOptions = {
  music: true | false;
  soundfx: true | false;
  volume: number;
};

export type UserOptionsContextProps = {
  userOptions: UserOptions;
  setUserOptions?: (userOptions: UserOptions) => void;
};

export const userOptionsInitialState: UserOptionsContextProps = {
  userOptions: { music: false, soundfx: false, volume: 1 },
  setUserOptions: () => {},
};

export const UserOptionsContext = createContext<UserOptionsContextProps>(
  userOptionsInitialState
);
