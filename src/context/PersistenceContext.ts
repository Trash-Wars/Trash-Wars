import { createContext } from "react";
import { Entity, Raccoon } from '../classes/entity';
import { Item } from '../classes/items';

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
  raccoonTeam: [],
  inventory: {
    sidelineRaccoons: [],
    items: [],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)