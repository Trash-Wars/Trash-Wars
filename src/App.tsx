import { useEffect, useRef, useState } from 'react';
import { Entity } from './classes/entity';
import { PersistenceContext, persistenceInitialState } from './context/PersistenceContext'
import { UserOptions, UserOptionsContext, userOptionsInitialState } from './context/OptionsContext';
import './App.css';

import Title from './components/Title/Title'
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Preround from './components/Preround/Preround';
import GameOver from './components/GameOver/GameOver';
import { GameBoard } from './components/GameBoard/GameBoard';
const music = require("./assets/sounds/retroForest.mp3");

function App() {
  const [persistence, setPersistence] = useState(persistenceInitialState)
  const [userOptions, setUserOptions] = useState(userOptionsInitialState);

  function handleSetOptions(userOptions: UserOptions) {
    setUserOptions({userOptions})
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
        <UserOptionsContext.Provider value={{...userOptions, setUserOptions: handleSetOptions}}>
          <audio ref={audioRef} src={music}/>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Title />} />
              <Route path="/preround" element={<Preround />} />
              <Route path="/gameboard" element={<GameBoard />} />
              <Route path="/gameover" element={<GameOver />} />
            </Routes>
          </BrowserRouter>
        </UserOptionsContext.Provider>
      </PersistenceContext.Provider>
    </div>
  );
}

export default App;
