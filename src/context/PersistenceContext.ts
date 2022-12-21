import { createContext } from "react";
import { Entity, Raccoon, GoldCrown, Katana, Arbalest, Spear, JesterHat, KnightHelmet } from '../classes/entity';

import { Axe, Item } from '../classes/entity';
import racc from '../assets/racc.png'

export type PersistenceStyle = {
  entities: Entity[];
  raccoonTeam: Raccoon[];
  inventory: {
    sidelineRaccoons: Raccoon[],
    items: Item[],
  }
  persistEntity?: (addedEntity: Entity,) => void;
  unpersistEntity?: (removedEntity: Entity) => void;
}

export const persistenceInitialState: PersistenceStyle = {
  entities: [],
  raccoonTeam: [],
  inventory: {
    sidelineRaccoons: [
      new Raccoon("Bandit", 25, "Raised by loving family and learned to read."), new Raccoon("Scamper", 25, "Adventurous spirit leads to unlikely journey."), new Raccoon("Rascal", 25, "Outwits humans to become city's top trash thief."), new Raccoon("Whiskey", 25, "Learned to open doors, became notorious thief."),
      new Raccoon("Masque", 25, "Steals food from unsuspecting picnic-goers"),
      new Raccoon("Rusty", 25, 'Rescued from illegal pet trade and thrives in wild'),
      new Raccoon("Pierre", 25, 'Raised by kind family of ducks.'),
      new Raccoon("Luis XXIV", 25, 'Rescued from oil spill and became a trash heap hero'),
    ],
    items: [new Axe(), new GoldCrown(), new Katana(), new Arbalest(), new Spear(), new Axe(), new JesterHat(), new KnightHelmet(), new Spear(), new Axe(), new Katana()],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
