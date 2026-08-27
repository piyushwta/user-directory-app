import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 400;
const BRICK_WIDTH = 46;
const BRICK_HEIGHT = 16;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 10;

interface Brick {
  x: number;
  y: number;
  status: number;
  color: string;
}

const BRICK_COLORS = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a855f7'];

// 🎮 MULTIPLE LEVELS CONFIGURATION
const LEVEL_CONFIGS = [
  { rows: 3, cols: 6, speed: 3 }, // Level 1: Easy
  { rows: 4, cols: 6, speed: 4 }, // Level 2: Medium
  { rows: 5, cols: 6, speed: 5 }, // Level 3: Hard
];

export const BrickBreakerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!gameStarted || isGameOver || isLevelCleared || isGameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: ReturnType<typeof requestAnimationFrame>;
    let currentScore = score;
    let currentLives = lives;

    const currentConfig = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];

    // Paddle
    const paddle = {
      width: 70,
      height: 10,
      x: (CANVAS_WIDTH - 70) / 2,
      y: CANVAS_HEIGHT - 20,
      speed: 7,
    };

    // Ball
    const ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      dx: currentConfig.speed,
      dy: -currentConfig.speed,
      radius: 6,
    };

    // Initialize Bricks for Current Level
    const bricks: Brick[][] = [];
    for (let r = 0; r < currentConfig.rows; r++) {
      bricks[r] = [];
      for (let c = 0; c < currentConfig.cols; c++) {
        bricks[r][c] = {
          x: 0,
          y: 0,
          status: 1,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
        };
      }
    }

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Collision Detection Logic (Accurate Brick Check)
    const checkCollision = () => {
      let remainingBricks = 0;

      for (let r = 0; r < currentConfig.rows; r++) {
        for (let c = 0; c < currentConfig.cols; c++) {
          const b = bricks[r][c];
          if (b.status === 1) {
            remainingBricks++;

            // Check Ball Collision with Active Brick
            if (
              ball.x + ball.radius > b.x &&
              ball.x - ball.radius < b.x + BRICK_WIDTH &&
              ball.y + ball.radius > b.y &&
              ball.y - ball.radius < b.y + BRICK_HEIGHT
            ) {
              ball.dy = -ball.dy; // Reverse vertical direction
              b.status = 0; // Destroy Brick
              remainingBricks--; // Decrease Count

              currentScore += 10;
              setScore(currentScore);
              setHighScore((prev) => Math.max(prev, currentScore));
            }
          }
        }
      }

      // Jab 0 Bricks bachenge tabhi Stage/Game Clear hoga
      if (remainingBricks === 0) {
        if (level < LEVEL_CONFIGS.length) {
          setIsLevelCleared(true);
        } else {
          setIsGameWon(true);
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Canvas Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render Bricks
      for (let r = 0; r < currentConfig.rows; r++) {
        for (let c = 0; c < currentConfig.cols; c++) {
          const b = bricks[r][c];
          if (b.status === 1) {
            const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            b.x = brickX;
            b.y = brickY;

            ctx.save();
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT, 4);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Draw Paddle
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 5);
      ctx.fill();
      ctx.restore();

      // Draw Ball
      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      checkCollision();

      // Ball Wall Bouncing
      if (ball.x + ball.dx > CANVAS_WIDTH - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.dy > CANVAS_HEIGHT - ball.radius) {
        // Paddle Hit Test
        if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
          ball.dy = -ball.dy;
        } else {
          // Bottom Fall -> Lose Life
          currentLives -= 1;
          setLives(currentLives);

          if (currentLives <= 0) {
            setIsGameOver(true);
            return;
          } else {
            // Reset position for next life
            ball.x = CANVAS_WIDTH / 2;
            ball.y = CANVAS_HEIGHT - 30;
            ball.dx = currentConfig.speed;
            ball.dy = -currentConfig.speed;
            paddle.x = (CANVAS_WIDTH - paddle.width) / 2;
          }
        }
      }

      // Controls
      if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && paddle.x > 0) {
        paddle.x -= paddle.speed;
      }
      if ((keys['ArrowRight'] || keys['d'] || keys['D']) && paddle.x < CANVAS_WIDTH - paddle.width) {
        paddle.x += paddle.speed;
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animId);
    };
  }, [gameStarted, isGameOver, isLevelCleared, isGameWon, level]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsGameOver(false);
    setIsLevelCleared(false);
    setIsGameWon(false);
    setGameStarted(true);
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setIsLevelCleared(false);
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'BRICK_BREAKER', score }),
      });
      alert('Score successfully saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] relative overflow-hidden p-4 font-sans select-none">
      
      {/* Background Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Cyberpunk Grid Floor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
        }}
      />

      {/* Main Game Container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-[90vh] max-h-[800px] p-6 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(244,63,94,0.15)] max-w-md mx-auto font-sans overflow-hidden backdrop-blur-xl">
        
        {/* Topbar Scoreboard */}
        <div className="w-[320px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
              LEVEL {level} / {LEVEL_CONFIGS.length}
            </span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Glow Breaker</h2>
          </div>
          <div className="flex gap-4 text-right font-mono">
            <div>
              <span className="text-[9px] text-rose-400 font-bold block">LIVES</span>
              <span className="text-sm font-black text-white">{'❤️'.repeat(lives)}</span>
            </div>
            <div className="border-r border-slate-800" />
            <div>
              <span className="text-[9px] text-cyan-400 font-bold block">SCORE</span>
              <span className="text-lg font-black text-white">{score}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative border border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-900/50 backdrop-blur p-1.5 flex items-center justify-center">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="rounded-xl shadow-2xl block" />

          {/* Overlays: Start / GameOver / Level Clear / Game Won */}
          {(!gameStarted || isGameOver || isLevelCleared || isGameWon) && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">
                  {isGameWon ? '🏆' : isLevelCleared ? '🚀' : isGameOver ? '💥' : '🧱'}
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {isGameWon
                  ? 'Campaign Completed!'
                  : isLevelCleared
                  ? `Level ${level} Cleared!`
                  : isGameOver
                  ? 'Game Over!'
                  : 'Glow Breaker'}
              </h3>

              <p className="text-xs text-slate-400 mb-5">
                {isGameWon
                  ? `Mastered all levels! Final Score: ${score}`
                  : isLevelCleared
                  ? 'Get ready for faster ball speed!'
                  : isGameOver
                  ? 'All paddle lives lost.'
                  : 'Break all glowing bricks to advance.'}
              </p>

              {(isGameOver || isGameWon) && (
                <div className="flex gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl mb-5">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Final</p>
                    <p className="text-lg font-bold text-rose-400 font-mono">{score}</p>
                  </div>
                  <div className="border-r border-slate-800" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Best</p>
                    <p className="text-lg font-bold text-cyan-400 font-mono">{highScore}</p>
                  </div>
                </div>
              )}

              {/* Dynamic Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                {isLevelCleared ? (
                  <button
                    onClick={nextLevel}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-600/25 active:scale-95"
                  >
                    Start Level {level + 1}
                  </button>
                ) : (
                  <button
                    onClick={startGame}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-rose-600/25 active:scale-95"
                  >
                    {isGameOver || isGameWon ? 'Play Again' : 'Start Session'}
                  </button>
                )}

                {(isGameOver || isGameWon) && score > 0 && (
                  <button
                    onClick={saveScoreToBackend}
                    disabled={isSaving}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-xl transition active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Syncing...' : 'Save Score to Cloud'}
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-500 mt-5 font-mono">Use A / D or Left / Right Arrows</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};