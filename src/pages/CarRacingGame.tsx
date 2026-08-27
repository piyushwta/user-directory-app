import React, { useRef, useEffect, useState } from 'react';

interface CarRacingGameProps {
  onGameOver?: (score: number) => void;
}

export const CarRacingGame: React.FC<CarRacingGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Canvas Drawing Helpers for Realistic Cars
  const drawPlayerCar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y + 6, 5, 12);
    ctx.fillRect(x + w - 2, y + 6, 5, 12);
    ctx.fillRect(x - 3, y + h - 18, 5, 12);
    ctx.fillRect(x + w - 2, y + h - 18, 5, 12);

    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.5, '#1d4ed8');
    grad.addColorStop(1, '#1e40af');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 12, w - 8, 10, 3);
    ctx.fill();

    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 4, y + 2, 6, 4);
    ctx.fillRect(x + w - 10, y + 2, 6, 4);
    ctx.restore();
  };

  const drawEnemyCar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y + 6, 5, 12);
    ctx.fillRect(x + w - 2, y + 6, 5, 12);
    ctx.fillRect(x - 3, y + h - 18, 5, 12);
    ctx.fillRect(x + w - 2, y + h - 18, 5, 12);

    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#f87171');
    grad.addColorStop(0.5, '#dc2626');
    grad.addColorStop(1, '#991b1b');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + h - 18, w - 8, 8, 2);
    ctx.fill();

    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#f87171';
    ctx.fillRect(x + 4, y + h - 4, 6, 3);
    ctx.fillRect(x + w - 10, y + h - 4, 6, 3);
    ctx.restore();
  };

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let currentScore = 0;
    let speed = 5;

    const player = {
      x: canvas.width / 2 - 16,
      y: canvas.height - 75,
      width: 32,
      height: 56,
      speed: 7,
    };

    let enemies: Array<{ x: number; y: number; width: number; height: number; speed: number }> = [];
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const spawnEnemy = () => {
      const laneWidth = canvas.width / 3;
      const lane = Math.floor(Math.random() * 3);
      const enemyX = lane * laneWidth + (laneWidth / 2 - 16);
      enemies.push({
        x: enemyX,
        y: -70,
        width: 32,
        height: 56,
        speed: speed + Math.random() * 2,
      });
    };

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 0, 4, canvas.height);
      ctx.fillRect(canvas.width - 4, 0, 4, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([25, 25]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 3, (frameCount * speed) % 50 - 50);
      ctx.lineTo(canvas.width / 3, canvas.height);
      ctx.moveTo((canvas.width / 3) * 2, (frameCount * speed) % 50 - 50);
      ctx.lineTo((canvas.width / 3) * 2, canvas.height);
      ctx.stroke();

      if ((keys['ArrowLeft'] || keys['a']) && player.x > 8) {
        player.x -= player.speed;
      }
      if ((keys['ArrowRight'] || keys['d']) && player.x < canvas.width - player.width - 8) {
        player.x += player.speed;
      }

      drawPlayerCar(ctx, player.x, player.y, player.width, player.height);

      if (frameCount % 50 === 0) {
        spawnEnemy();
        currentScore += 10;
        setScore(currentScore);
        setHighScore((prev) => Math.max(prev, currentScore));
        if (currentScore % 50 === 0) speed += 0.6;
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemy.speed;

        drawEnemyCar(ctx, enemy.x, enemy.y, enemy.width, enemy.height);

        if (
          player.x < enemy.x + enemy.width - 2 &&
          player.x + player.width > enemy.x + 2 &&
          player.y < enemy.y + enemy.height - 2 &&
          player.y + player.height > enemy.y + 2
        ) {
          setIsGameOver(true);
          if (onGameOver) onGameOver(currentScore);
          return;
        }

        if (enemy.y > canvas.height) {
          enemies.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, isGameOver]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'CAR_RACING', score }),
      });
      alert('Score successfully saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    /* Animated Cyberpunk Grid Page Background */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden p-4 font-sans select-none">
      
      {/* 🔮 Moving Glowing Spotlight Light Ball */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* 🕸️ Dynamic Animated Grid Texture (Matching Your Image) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90vh] max-h-[800px] p-4 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(2,132,199,0.2)] font-sans overflow-hidden backdrop-blur-xl">
        
        {/* Fixed Symmetrical Score Board Topbar */}
        <div className="w-[320px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl mb-3 shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Arcade Mode</span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Cyber Pursuit</h2>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Score</span>
            <span className="text-xl font-black text-blue-400 font-mono leading-none">{score}</span>
          </div>
        </div>

        {/* Main Game Screen Canvas */}
        <div className="relative border border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-900/50 backdrop-blur p-1.5 flex items-center justify-center">
          <canvas ref={canvasRef} width={320} height={480} className="rounded-xl shadow-2xl block" />

          {(!gameStarted || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">🏎️</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {isGameOver ? 'Crash Detected' : 'Cyber Racing'}
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                {isGameOver ? `You scored ${score} points on the track.` : 'Dodge incoming traffic & set highscores.'}
              </p>

              {isGameOver && (
                <div className="flex gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl mb-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Final</p>
                    <p className="text-lg font-bold text-blue-400 font-mono">{score}</p>
                  </div>
                  <div className="border-r border-slate-800" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Best</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">{highScore}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <button
                  onClick={startGame}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 active:scale-95"
                >
                  {isGameOver ? 'Try Again' : 'Start Engine'}
                </button>

                {isGameOver && (
                  <button
                    onClick={saveScoreToBackend}
                    disabled={isSaving}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl transition active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Sync Score to Cloud'}
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-6">Use A / D or Left / Right Arrows</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};