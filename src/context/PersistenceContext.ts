import { createContext } from "react";
import { Entity, Raccoon } from '../classes/entity';
import { Axe, Item } from '../classes/entity';

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
  raccoonTeam: [new Raccoon("Hugo", '', 10)],
  inventory: {
    sidelineRaccoons: [new Raccoon("Hugo", '', 10)],
    items: [new Axe("axe", "", "", 5, 4)],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
