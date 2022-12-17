import { useEffect, useRef, useState } from 'react';
import { Entity } from './classes/entity';
import { ScreenContext, screenInitialState } from './context/ScreenContext'
import { PersistenceContext, persistenceInitialState } from './context/PersistenceContext'
import { UserOptions, UserOptionsContext, userOptionsInitialState } from './context/OptionsContext';
import './App.css';

import Title from './components/Title/Title'
import GameBoard from './components/GameBoard/GameBoard';
import PreRound from './components/Preround/Preround';
import GameOver from './components/GameOver/GameOver';
const music = require("./assets/sounds/retroForest.mp3");

const SCREEN2COMP = [
  () => Title,
  () => PreRound,
  () => GameBoard,
  () => GameOver,
];

function App() {
  const [screenContext, setScreenContext] = useState(screenInitialState)
  const [persistence, setPersistence] = useState(persistenceInitialState)
  const Screen = SCREEN2COMP[screenContext.screen]();

  const [userOptions, setUserOptions] = useState(userOptionsInitialState);

  function handleSetOptions(userOptions: UserOptions) {
    setUserOptions({userOptions})
  }

  function handleSetScreen(newScreen: 0 | 1 | 2 | 3) {
    if(screenContext.screen === 2) {
      const entities = persistence.entities
      for(const entity of entities) {
        entity.cleanup()
      }
      setPersistence({...persistence, entities})
    }
    setScreenContext({screen: newScreen, setScreen: handleSetScreen})
  }

  function persistEntity(addedEntity: Entity) {
    setPersistence({...persistence, entities: [...persistence.entities, addedEntity]});
  }

  function unpersistEntity(removedEntity: Entity) {
    const newEntities = [...persistence.entities];
    const removeIndex = newEntities.indexOf(removedEntity);
    newEntities.splice(removeIndex, 1);
    setPersistence({...persistence, entities: newEntities});
  }

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current!;

    if (userOptions.userOptions.music === false) {
      audioElement.pause();
    } else if (audioElement) {
      audioElement.loop = true;
      audioElement.volume = userOptions.userOptions.volume / 100;
      audioElement.play();
    }
  }, [userOptions])

  return (
    <div className="App">
      <PersistenceContext.Provider value={{
        ...persistence,
        persistEntity: persistEntity,
        unpersistEntity: unpersistEntity,
      }} >
        <ScreenContext.Provider
          value={{
            ...screenContext,
            setScreen: handleSetScreen,
          }}>
          <UserOptionsContext.Provider value={{...userOptions, setUserOptions: handleSetOptions}}>
          <audio ref={audioRef} src={music}/>
          <Screen />
          </UserOptionsContext.Provider>
        </ScreenContext.Provider>
      </PersistenceContext.Provider>
    </div>
  );
}

export default App;
