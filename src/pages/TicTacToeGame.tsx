import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

type BoardState = (string | null)[];
type GameMode = 'AI' | '2PLAYER';

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // 🔊 Audio Synth Functions (Web Audio API - No external audio files needed)
  const playVictorySound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const playDefeatSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // 🎉 Trigger Confetti Burst on Win
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#34d399', '#f43f5e', '#fbbf24'],
    });
  };

  const checkWinner = (squares: BoardState) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], combo };
      }
    }
    return null;
  };

  const winInfo = checkWinner(board);
  const winner = winInfo?.winner;
  const isDraw = !winner && board.every((cell) => cell !== null);

  const getBestAiMove = (currentBoard: BoardState): number => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (vals.filter((v) => v === 'O').length === 2 && vals.includes(null)) {
        return combo[vals.indexOf(null)];
      }
    }

    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (vals.filter((v) => v === 'X').length === 2 && vals.includes(null)) {
        return combo[vals.indexOf(null)];
      }
    }

    if (!currentBoard[4]) return 4;

    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null) as number[];

    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  useEffect(() => {
    if (gameMode === 'AI' && !isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove = getBestAiMove(board);
        if (aiMove !== undefined) {
          makeMove(aiMove, 'O');
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, board, winner, isDraw]);

  const makeMove = (index: number, player: 'X' | 'O') => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setScores((prev) => ({
        ...prev,
        [result.winner.toLowerCase()]: prev[result.winner.toLowerCase() as 'x' | 'o'] + 1,
      }));

      // Check Win or Lose Effects
      if (result.winner === 'X' || gameMode === '2PLAYER') {
        triggerConfetti();
        playVictorySound();
      } else {
        // Bot Wins Effect
        setIsShaking(true);
        playDefeatSound();
        setTimeout(() => setIsShaking(false), 500);
      }
    } else {
      setIsXNext(player === 'X' ? false : true);
    }
  };

  const handleCellClick = (index: number) => {
    if (gameMode === 'AI' && !isXNext) return;
    makeMove(index, isXNext ? 'X' : 'O');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setScores({ x: 0, o: 0 });
    resetGame();
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'TIC_TAC_TOE', score: scores.x * 100 }),
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
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Cyberpunk Grid Floor */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* Main Container with Defeat Shake Effect */}
      <div className={`relative z-10 flex flex-col items-center justify-between h-[90vh] max-h-[800px] p-6 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(2,132,199,0.2)] font-sans overflow-hidden backdrop-blur-xl transition-transform ${
        isShaking ? 'animate-bounce border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.4)]' : ''
      }`}>

        {/* Topbar Scoreboard */}
        <div className="w-[320px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Arcade Mode</span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Neon Tic-Tac-Toe</h2>
          </div>
          <div className="flex gap-4 text-right font-mono">
            <div>
              <span className="text-[9px] text-cyan-400 font-bold block">X (YOU)</span>
              <span className="text-lg font-black text-white">{scores.x}</span>
            </div>
            <div className="border-r border-slate-800" />
            <div>
              <span className="text-[9px] text-rose-400 font-bold block">{gameMode === 'AI' ? 'BOT' : 'PLAYER O'}</span>
              <span className="text-lg font-black text-white">{scores.o}</span>
            </div>
          </div>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-[320px]">
          <button
            onClick={() => handleModeChange('AI')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              gameMode === 'AI' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 VS Bot (AI)
          </button>
          <button
            onClick={() => handleModeChange('2PLAYER')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              gameMode === '2PLAYER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            👥 2 Players
          </button>
        </div>

        {/* Status Text Banner */}
        <div className="text-xs font-semibold text-slate-300 my-1 h-5">
          {winner ? (
            <span className={`font-bold text-sm ${winner === 'X' ? 'text-emerald-400 animate-bounce' : 'text-rose-500'}`}>
              {winner === 'X' ? '🎉 You Win!' : gameMode === 'AI' ? '🤖 Bot Defeated You!' : '🎉 Player O Wins!'}
            </span>
          ) : isDraw ? (
            <span className="text-amber-400 font-bold text-sm">🤝 Match Draw!</span>
          ) : (
            <span>
              Turn:{' '}
              <strong className={isXNext ? 'text-cyan-400' : 'text-rose-400'}>
                {isXNext ? 'X (Your Turn)' : gameMode === 'AI' ? 'Bot thinking...' : 'O Turn'}
              </strong>
            </span>
          )}
        </div>

        {/* 3x3 Grid Matrix Board */}
        <div className="relative w-[320px] h-[320px] grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 shadow-inner">
          {board.map((cell, idx) => {
            const isWinningCell = winInfo?.combo.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={!!cell || !!winner || (gameMode === 'AI' && !isXNext)}
                className={`flex items-center justify-center text-4xl font-black rounded-xl border transition-all duration-200 ${
                  isWinningCell
                    ? winner === 'X'
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-400'
                      : 'bg-rose-500/20 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] text-rose-400'
                    : cell === 'X'
                    ? 'bg-slate-900 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : cell === 'O'
                    ? 'bg-slate-900 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-[320px] mt-2">
          <button
            onClick={resetGame}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 active:scale-95"
          >
            {winner || isDraw ? 'Play Next Match' : 'Reset Board'}
          </button>

          {scores.x > 0 && (
            <button
              onClick={saveScoreToBackend}
              disabled={isSaving}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl transition active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Syncing...' : 'Save Score to Cloud'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};