import { createContext } from "react";
import { Entity, Raccoon } from '../classes/entity';
import { Axe, Item } from '../classes/entity';
import racc from '../assets/racc.png'

export type PersistenceStyle = {
  entities: Entity[];
  raccoonTeam: Raccoon[];
  inventory: {
    sidelineRaccoons: Raccoon[],
    items: Item[],
  }
  persistEntity?: (addedEntity: Entity) => void;
  unpersistEntity?: (removedEntity: Entity) => void;
}

export const persistenceInitialState: PersistenceStyle = {
  entities: [],
  raccoonTeam: [
    new Raccoon("Hugo", racc, 10),
    new Raccoon("Zayah", racc, 10),
    new Raccoon("Jim", racc, 10),
    new Raccoon("Luis", racc, 10),
  ],
  inventory: {
    sidelineRaccoons: [],
    items: [new Axe(), new Axe()],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
