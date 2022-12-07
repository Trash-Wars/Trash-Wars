import { createContext } from "react";

export const SCREEN_TITLE = 1
export const SCREEN_PREROUND = 2
export const SCREEN_GAMEBOARD = 3
export const SCREEN_GAMEOVER = 4

export type ScreenStyle = {
  screen: 0 | 1 | 2 | 3;
  setScreen?: (newScreen: 0 | 1 | 2 | 3) => void;
}

export const screenInitialState: ScreenStyle = {
  screen: SCREEN_GAMEBOARD,
}

export const ScreenContext = createContext<ScreenStyle>(screenInitialState)