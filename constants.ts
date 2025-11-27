
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const FPS = 60;

// Pixel Scale (how big one "pixel" is on screen)
export const PIXEL_SCALE = 4;

export const COLORS = {
  background: '#050505',
  player: '#3b82f6', // blue-500
  playerProjectile: '#60a5fa', // blue-400
  enemyScout: '#ef4444', // red-500
  enemyFighter: '#f97316', // orange-500
  enemyTank: '#a855f7', // purple-500
  enemyProjectile: '#fbbf24', // amber-400
  text: '#ffffff',
  uiAccent: '#22c55e', // green-500
};

// 1 = drawn, 0 = transparent
export const SPRITES = {
  PLAYER: [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  ],
  ENEMY_SCOUT: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
  ],
  ENEMY_FIGHTER: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
  ],
  ENEMY_TANK: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  ],
  PROJECTILE: [
    [1, 1],
    [1, 1],
  ]
};
