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
  persistEntity?: (addedEntity: Entity,) => void;
  unpersistEntity?: (removedEntity: Entity) => void;
}

export const persistenceInitialState: PersistenceStyle = {
  entities: [],
  raccoonTeam: [
    new Raccoon("Hugo", 500, "Bill Gates' child"),
    new Raccoon("Zayah", 500, 'waterproof'),
    new Raccoon("Jim", 500, 'bendy'),
    new Raccoon("Luis", 500, 'laughy'),
  ],
  inventory: {
    sidelineRaccoons: [],
    items: [new Axe(), new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
