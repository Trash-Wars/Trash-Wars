import { createContext } from "react";
import { Entity, Raccoon, TopHat } from '../classes/entity';
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
    new Raccoon("Hugo", racc, 500, "Bill Gates' child"),
    new Raccoon("Zayah", racc, 500, 'waterproof'),
    new Raccoon("Jim", racc, 500, 'bendy'),
    new Raccoon("Luis", racc, 500, 'laughy'),
  ],
  inventory: {
    sidelineRaccoons: [],
    items: [new Axe(), new TopHat(), new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),new Axe(),],
  },
};
export const PersistenceContext = createContext<PersistenceStyle>(persistenceInitialState)
