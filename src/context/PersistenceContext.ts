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
  raccoonTeam: [new Raccoon("David", 25, "the clone"), new Raccoon("Derek", 25, "the other clone"), new Raccoon("Kira", 25, "the other clone"), new Raccoon("Janet", 25, "the other clone"),],
  inventory: {
    sidelineRaccoons: [
      new Raccoon("Hugo", 25, "Bill Gates' child"),
      new Raccoon("Zayah", 25, 'waterproof'),
      new Raccoon("Jim", 25, 'bendy'),
      new Raccoon("Luis", 25, 'laughy'),
    ],
    items: [new Axe(), new GoldCrown(), new Katana(), new Arbalest(), new Spear(), new Axe(), new JesterHat(), new KnightHelmet(), new Spear(), new Axe(), new Katana()],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
