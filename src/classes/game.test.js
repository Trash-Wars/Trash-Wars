import { Gameboard } from './gameboard';
import { Raccoon, Axe, Katana, Scythe, Spear, SimpleBow, Arbalest, GoblinBasic, GoblinTank, PulsatingLump, Raven, Wraith, Skeleton, GnomeWizard, Imp, Devil } from './entity';


describe('A game', () => {

  it('Places entities', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [2, 1]);
    expect(goblin.position).toStrictEqual([2, 1]);
  });

  it('Advance-moves enemies', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [2, 1]);
    goblin.advance();
    expect(goblin.position).toStrictEqual([1, 1]);
  });

});

describe('Weapon functionality', () => {
  it('Axe', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new Axe();
    zayah.useWeapon();
    expect(goblin.health).toBe(1);
  });

  it('Katana', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new Katana();
    zayah.useWeapon();
    expect(goblin.health).toBe(0);
  });

  it('Scythe', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new Scythe();
    zayah.useWeapon();
    expect(goblin.health).toBe(3);
  });

  it('Spear', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new Spear();
    zayah.useWeapon();
    expect(goblin.health).toBe(0);
  });

  it('Simple Bow', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new SimpleBow();
    zayah.useWeapon();
    expect(goblin.health).toBe(4);
  });

  it('Arbalest', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    zayah.weapon = new Arbalest();
    zayah.useWeapon();
    expect(goblin.health).toBe(6);
  });

});

describe('Enemy functionality', () => {

  it('Basic goblin', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [1, 1]);
    goblin.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Tank goblin', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const goblin = new GoblinTank();
    board.moveEntity(goblin, [1, 1]);
    goblin.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Pulsating lump', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const lump = new PulsatingLump();
    board.moveEntity(lump, [1, 1]);
    lump.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Pulsating lump teamkill', () => {
    const board = new Gameboard(6, 4);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [0, 1]);
    const lump = new PulsatingLump();
    board.moveEntity(lump, [1, 1]);
    lump.advance();
    expect(goblin.health).toBeLessThan(10);
  });

  it('Raven', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const raven = new Raven();
    board.moveEntity(raven, [1, 1]);
    raven.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Wraith', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const wraith = new Wraith();
    board.moveEntity(wraith, [1, 1]);
    wraith.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Skeleton', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const skeleton = new Skeleton();
    board.moveEntity(skeleton, [1, 1]);
    skeleton.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Gnome Wizard', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const gnome = new GnomeWizard();
    board.moveEntity(gnome, [5, 1]);
    const goblin1 = new GoblinBasic();
    const goblin2 = new GoblinBasic();
    board.moveEntity(goblin1, [4, 2]);
    board.moveEntity(goblin2, [4, 0]);
    gnome.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Imp', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    board.moveEntity(zayah, [0, 1]);
    const imp = new Imp();
    board.moveEntity(imp, [5, 1]);
    imp.advance();
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Devil', () => {
    const board = new Gameboard(6, 4);
    const zayah = new Raccoon('Zayah', 25, '');
    const david = new Raccoon('David', 25, '');
    board.moveEntity(david, [2, 2]);
    board.moveEntity(zayah, [0, 1]);
    const devil = new Devil();
    board.moveEntity(devil, [1, 1]);
    devil.advance();
    expect(david.health).toBeLessThan(david.maxHealth);
    expect(zayah.health).toBeLessThan(zayah.maxHealth);
  });

  it('Devil teamkill', () => {
    const board = new Gameboard(6, 4);
    const goblin = new GoblinBasic();
    board.moveEntity(goblin, [0, 2]);
    const devil = new Devil();
    board.moveEntity(devil, [1, 1]);
    devil.advance();
    expect(goblin.health).toBeLessThan(10);
  });

  it('Devil area attack', () => {
    const board = new Gameboard(6, 4);
    const goblin1 = new GoblinBasic();
    const goblin2 = new GoblinBasic();
    board.moveEntity(goblin1, [1, 2]);
    const devil = new Devil();
    board.moveEntity(devil, [1, 1]);
    board.moveEntity(goblin2, [1, 0]);
    devil.advance();
    expect(goblin1.health).toBeLessThan(10);
    expect(goblin2.health).toBeLessThan(10);
  });

});