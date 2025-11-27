export enum GameState {
  MENU = 'MENU',
  BRIEFING = 'BRIEFING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity extends Position, Size {
  id: string;
  vx: number;
  vy: number;
  color: string;
  spriteMap: number[][]; // 0/1 grid for pixel art
}

export interface Player extends Entity {
  hp: number;
  maxHp: number;
  invulnerable: number; // frames
}

export interface Enemy extends Entity {
  type: 'scout' | 'fighter' | 'tank';
  hp: number;
  scoreValue: number;
}

export interface Projectile extends Entity {
  damage: number;
  owner: 'player' | 'enemy';
}

export interface Particle extends Position {
  id: string;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export interface MissionData {
  title: string;
  description: string;
  target: string;
}