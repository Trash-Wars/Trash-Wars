import { useState } from 'react';
import { ScreenContext, screenInitialState } from './context/ScreenContext'
import './App.css';

import Title from './components/Title/Title'
import GameBoard from './components/GameBoard/GameBoard';
import PreRound from './components/Preround/Preround';
import GameOver from './components/GameOver/GameOver';

const SCREEN2COMP = [
  () => Title,
  () => PreRound,
  () => GameBoard,
  () => GameOver,
];

function App() {
  const [screenContext, setScreenContext] = useState(screenInitialState)
  const Screen = SCREEN2COMP[screenContext.screen - 1]();

  function handleSetScreen(newScreen: 0 | 1 | 2 | 3) {
    setScreenContext({screen: newScreen, setScreen: handleSetScreen})
  }

  return (
    <div className="App">
      <ScreenContext.Provider
        value={{
          screen: screenContext.screen,
          setScreen: handleSetScreen,
        }}>
        {screenContext.screen}
        <Screen />
      </ScreenContext.Provider>
    </div>
  );
}

export default App;
