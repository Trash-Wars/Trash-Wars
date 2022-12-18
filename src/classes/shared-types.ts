import { Entity } from "./entity";

export interface Tile {
  contents: Entity[];
  position: [number, number];
  edges: Set<Tile>;
  background: string;
}
