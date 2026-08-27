import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20; // 20x20 Grid
const SPEED = 110; // Milliseconds per frame

interface Position {
  x: number;
  y: number;
}

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Game Loop with Screen Wrapping Logic
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        // 🐍 Nokia Classic Screen Wrapping (Pass Through Corners/Walls)
        if (head.x < 0) head.x = GRID_SIZE - 1;
        else if (head.x >= GRID_SIZE) head.x = 0;

        if (head.y < 0) head.y = GRID_SIZE - 1;
        else if (head.y >= GRID_SIZE) head.y = 0;

        // Self Collision Check (Game Over tabhi hoga jab Snake khud ko kaate)
        for (const segment of prevSnake) {
          if (head.x === segment.x && head.y === segment.y) {
            setIsGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Food Eating Check
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => {
            const newScore = prev + 10;
            setHighScore((h) => Math.max(h, newScore));
            return newScore;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(moveSnake);
  }, [gameStarted, isGameOver, food]);

  const handleStartGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
    ]);
    setFood(generateFood());
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          gameType: 'SNAKE',
          score: score,
        }),
      });
      alert('Score successfully saved!');
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] relative overflow-hidden p-4 font-sans select-none">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Cyberpunk Grid Floor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
        }}
      />

      {/* Main Container Fixed to 90vh */}
      <div className="relative z-10 flex flex-col items-center justify-between h-[90vh] max-h-[800px] p-6 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(16,185,129,0.15)] max-w-md mx-auto font-sans overflow-hidden backdrop-blur-xl">
        
        {/* Topbar Scoreboard */}
        <div className="w-[320px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Classic Mode</span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Nokia Snake</h2>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Score</span>
            <span className="text-xl font-black text-emerald-400 font-mono leading-none">{score}</span>
          </div>
        </div>

        {/* Board & Canvas Wrapper */}
        <div className="relative border border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-900/50 backdrop-blur p-2 flex items-center justify-center">
          
          <div
            className="grid gap-[1px] rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: '320px',
              height: '400px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);

              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = snake.some((segment) => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`rounded-[2px] transition-all duration-75 ${
                    isSnakeHead
                      ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                      : isSnakeBody
                      ? 'bg-emerald-600/90'
                      : isFood
                      ? 'bg-rose-500 animate-pulse shadow-[0_0_12px_#f43f5e]'
                      : 'bg-slate-900/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Start / Game Over Overlay */}
          {(!gameStarted || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">🐍</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {isGameOver ? 'Self Collision!' : 'Snake'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                {isGameOver
                  ? `Final score: ${score} points.`
                  : 'Walls are open! Snake can pass through corners.'}
              </p>

              {/* Score Pill */}
              {isGameOver && (
                <div className="flex gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl mb-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Final</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">{score}</p>
                  </div>
                  <div className="border-r border-slate-800" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Best</p>
                    <p className="text-lg font-bold text-cyan-400 font-mono">{highScore}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <button
                  onClick={handleStartGame}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-600/25 active:scale-95"
                >
                  {isGameOver ? 'Try Again' : 'Start Engine'}
                </button>

                {isGameOver && (
                  <button
                    onClick={saveScoreToBackend}
                    disabled={isSaving}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl transition active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Syncing...' : 'Sync Score to Cloud'}
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-6">Use Arrow Keys or W-A-S-D to steer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};