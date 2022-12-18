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
  rounds: number;
}

export const persistenceInitialState: PersistenceStyle = {
  entities: [],
  raccoonTeam: [new Raccoon("David", 10, "the clone"), new Raccoon("Derek", 10, "the other clone"), new Raccoon("Kira", 10, "the other clone"), new Raccoon("Janet", 10, "the other clone"),],
  inventory: {
    sidelineRaccoons: [
      new Raccoon("Hugo", 500, "Bill Gates' child"),
      new Raccoon("Zayah", 500, 'waterproof'),
      new Raccoon("Jim", 500, 'bendy'),
      new Raccoon("Luis", 500, 'laughy'),
    ],
    items: [new Axe(), new GoldCrown(), new Katana(), new Arbalest(), new Spear(), new Axe(), new JesterHat(), new KnightHelmet(),],
  },
  rounds: 0,
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
