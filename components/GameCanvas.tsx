import React, { useRef, useEffect } from 'react';
import { GameState, Player, Enemy, Projectile, Particle, Star, Entity } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPRITES, PIXEL_SCALE, COLORS } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  score: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, setScore, score }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game Entities Refs (using refs to avoid closure staleness in loop)
  const playerRef = useRef<Player>({
    id: 'p1',
    x: CANVAS_WIDTH / 2 - (SPRITES.PLAYER[0].length * PIXEL_SCALE) / 2,
    y: CANVAS_HEIGHT - 100,
    width: SPRITES.PLAYER[0].length * PIXEL_SCALE,
    height: SPRITES.PLAYER.length * PIXEL_SCALE,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    color: COLORS.player,
    spriteMap: SPRITES.PLAYER,
    invulnerable: 0
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const frameRef = useRef<number>(0);
  const lastShotRef = useRef<number>(0);
  const difficultyRef = useRef<number>(1);

  // Initialize Stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() > 0.9 ? 3 : 1, // Slightly larger stars for variation
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random(),
      });
    }
    starsRef.current = stars;
  }, []);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Helpers
  const createExplosion = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 30 + Math.random() * 20,
        color: color,
        size: Math.random() * 4 + 2, // Larger explosion particles
      });
    }
  };

  const spawnEnemy = () => {
    const rand = Math.random();
    let type: Enemy['type'] = 'scout';
    let sprite = SPRITES.ENEMY_SCOUT;
    let hp = 1;
    let color = COLORS.enemyScout;
    let scoreVal = 100;
    
    if (rand > 0.7 && difficultyRef.current > 2) {
      type = 'fighter';
      sprite = SPRITES.ENEMY_FIGHTER;
      hp = 3;
      color = COLORS.enemyFighter;
      scoreVal = 300;
    } else if (rand > 0.9 && difficultyRef.current > 5) {
      type = 'tank';
      sprite = SPRITES.ENEMY_TANK;
      hp = 8;
      color = COLORS.enemyTank;
      scoreVal = 800;
    }

    // Recalculate dimensions based on selected sprite
    const width = sprite[0].length * PIXEL_SCALE;
    const height = sprite.length * PIXEL_SCALE;

    enemiesRef.current.push({
      id: Math.random().toString(),
      x: Math.random() * (CANVAS_WIDTH - width),
      y: -height - 10,
      width,
      height,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2 + 1 + (difficultyRef.current * 0.1),
      type,
      hp,
      maxHp: hp, 
      color,
      spriteMap: sprite,
      scoreValue: scoreVal,
    } as Enemy);
  };

  const drawSprite = (ctx: CanvasRenderingContext2D, entity: Entity) => {
    ctx.fillStyle = entity.color;
    for (let row = 0; row < entity.spriteMap.length; row++) {
      for (let col = 0; col < entity.spriteMap[row].length; col++) {
        if (entity.spriteMap[row][col] === 1) {
          ctx.fillRect(
            entity.x + col * PIXEL_SCALE,
            entity.y + row * PIXEL_SCALE,
            PIXEL_SCALE,
            PIXEL_SCALE
          );
        }
      }
    }
  };

  // Main Game Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const loop = () => {
      frameRef.current++;
      
      // Clear Canvas
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // --- Update Stars ---
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > CANVAS_HEIGHT) star.y = 0;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // --- Update Player ---
      const player = playerRef.current;
      const speed = 5;

      if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) player.x -= speed;
      if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) player.x += speed;
      if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) player.y -= speed;
      if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) player.y += speed;

      // Clamp player
      player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));
      player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));

      if (player.invulnerable > 0) player.invulnerable--;

      // Thruster effect
      if (frameRef.current % 3 === 0) {
        particlesRef.current.push({
          id: Math.random().toString(),
          x: player.x + player.width / 2 + (Math.random() - 0.5) * 6,
          y: player.y + player.height - 4,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 2 + 2,
          life: 15,
          color: '#3b82f6',
          size: Math.random() * 3 + 2,
        });
      }

      // Shooting
      if (keysRef.current['Space']) {
        if (Date.now() - lastShotRef.current > 150) { // Fire rate
          projectilesRef.current.push({
            id: Math.random().toString(),
            x: player.x + player.width / 2 - PIXEL_SCALE,
            y: player.y,
            width: PIXEL_SCALE * 2,
            height: PIXEL_SCALE * 2,
            vx: 0,
            vy: -12,
            damage: 1,
            owner: 'player',
            color: COLORS.playerProjectile,
            spriteMap: SPRITES.PROJECTILE
          });
          lastShotRef.current = Date.now();
        }
      }

      // Draw Player (flicker if invulnerable)
      if (Math.floor(frameRef.current / 4) % 2 === 0 || player.invulnerable === 0) {
        drawSprite(ctx, player);
      }

      // --- Update Projectiles ---
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        drawSprite(ctx, p);

        if (p.y < -20 || p.y > CANVAS_HEIGHT + 20) {
          projectilesRef.current.splice(i, 1);
        }
      }

      // --- Update Enemies ---
      // Spawner
      if (frameRef.current % Math.max(20, 60 - difficultyRef.current * 2) === 0) {
        spawnEnemy();
        if (frameRef.current % 600 === 0) difficultyRef.current++;
      }

      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const enemy = enemiesRef.current[i];
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Enemy Shooting
        if (Math.random() < 0.01 + (difficultyRef.current * 0.001)) {
           projectilesRef.current.push({
            id: Math.random().toString(),
            x: enemy.x + enemy.width / 2 - PIXEL_SCALE,
            y: enemy.y + enemy.height,
            width: PIXEL_SCALE * 2,
            height: PIXEL_SCALE * 2,
            vx: 0,
            vy: 6,
            damage: 1,
            owner: 'enemy',
            color: COLORS.enemyProjectile,
            spriteMap: SPRITES.PROJECTILE
          });
        }

        drawSprite(ctx, enemy);

        if (enemy.y > CANVAS_HEIGHT) {
          enemiesRef.current.splice(i, 1);
        }
      }

      // --- Collision Detection ---
      // Projectiles vs Enemies / Player
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const p = projectilesRef.current[i];
        let hit = false;

        if (p.owner === 'player') {
          for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
            const e = enemiesRef.current[j];
            // Simple AABB Collision
            if (
              p.x < e.x + e.width &&
              p.x + p.width > e.x &&
              p.y < e.y + e.height &&
              p.y + p.height > e.y
            ) {
              e.hp -= p.damage;
              hit = true;
              createExplosion(p.x, p.y, COLORS.uiAccent, 3);
              if (e.hp <= 0) {
                enemiesRef.current.splice(j, 1);
                createExplosion(e.x + e.width/2, e.y + e.height/2, e.color, 15);
                setScore(s => s + e.scoreValue);
              }
              break;
            }
          }
        } else {
          // Enemy projectile vs Player
          if (
            p.x < player.x + player.width &&
            p.x + p.width > player.x &&
            p.y < player.y + player.height &&
            p.y + p.height > player.y &&
            player.invulnerable === 0
          ) {
            player.hp -= 10;
            player.invulnerable = 60;
            hit = true;
            createExplosion(player.x + player.width/2, player.y + player.height/2, COLORS.player, 10);
            if (player.hp <= 0) {
               setGameState(GameState.GAME_OVER);
            }
          }
        }

        if (hit) projectilesRef.current.splice(i, 1);
      }

      // Player vs Enemy (Crash)
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const e = enemiesRef.current[i];
         if (
            player.x < e.x + e.width &&
            player.x + player.width > e.x &&
            player.y < e.y + e.height &&
            player.y + player.height > e.y &&
            player.invulnerable === 0
          ) {
            player.hp -= 20;
            player.invulnerable = 60;
            e.hp = 0; 
            enemiesRef.current.splice(i, 1);
            createExplosion(e.x + e.width/2, e.y + e.height/2, COLORS.enemyFighter, 20);
            if (player.hp <= 0) {
               setGameState(GameState.GAME_OVER);
            }
          }
      }

      // --- Particles ---
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const part = particlesRef.current[i];
        part.x += part.vx;
        part.y += part.vy;
        part.life--;
        
        ctx.fillStyle = part.color;
        // Simple pixel particle
        ctx.fillRect(part.x, part.y, part.size, part.size);

        if (part.life <= 0) particlesRef.current.splice(i, 1);
      }

      // Draw HUD (Health)
      ctx.fillStyle = COLORS.text;
      ctx.font = '16px "Press Start 2P"';
      ctx.fillText(`VIDA: ${Math.max(0, player.hp)}%`, 20, 30);
      ctx.fillText(`PONTOS: ${score}`, 20, 55);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, score, setScore, setGameState]);

  // Reset Game Logic when entering PLAYING state
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      playerRef.current.x = CANVAS_WIDTH / 2 - (SPRITES.PLAYER[0].length * PIXEL_SCALE) / 2;
      playerRef.current.y = CANVAS_HEIGHT - 100;
      playerRef.current.hp = 100;
      playerRef.current.invulnerable = 120;
      enemiesRef.current = [];
      projectilesRef.current = [];
      particlesRef.current = [];
      difficultyRef.current = 1;
      setScore(0);
    }
  }, [gameState, setScore]);

  return (
    <div className="relative border-4 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,0,0.2)]">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-black block"
      />
    </div>
  );
};

export default GameCanvas;