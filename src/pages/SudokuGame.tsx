import React, { useState } from 'react';
import { getSudoku } from 'sudoku-gen';

type Difficulty = 'easy' | 'medium' | 'hard';

export const SudokuGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [game, setGame] = useState(() => getSudoku('easy'));
  const [board, setBoard] = useState<string[]>(game.puzzle.split(''));
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const startNewGame = (diff: Difficulty = difficulty) => {
    const newGame = getSudoku(diff);
    setGame(newGame);
    setBoard(newGame.puzzle.split(''));
    setIsWon(false);
    setGameStarted(true);
  };

  const handleCellChange = (index: number, value: string) => {
    if (value && !/^[1-9]$/.test(value)) return;

    const newBoard = [...board];
    newBoard[index] = value || '-';
    setBoard(newBoard);

    // Win Condition Check
    if (newBoard.join('') === game.solution) {
      setIsWon(true);
    }
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'SUDOKU', score: 1000 }),
      });
      alert('Score successfully saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    /* Outer Cyberpunk Animated Grid Page Background */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] relative overflow-hidden p-4 font-sans select-none">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
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
      <div className="relative z-10 flex flex-col items-center justify-between h-[90vh] max-h-[800px] p-6 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(2,132,199,0.2)] font-sans overflow-hidden backdrop-blur-xl">
        
        {/* Topbar HUD */}
        <div className="w-[360px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Puzzle Mode</span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Neon Sudoku</h2>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Diff</span>
            <span className="text-xs font-black text-cyan-400 font-mono uppercase">{difficulty}</span>
          </div>
        </div>

        {/* 9x9 Sudoku Board Matrix */}
        <div className="relative w-[360px] h-[360px] p-2 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center">
          
          <div className="grid grid-cols-9 gap-[2px] bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 w-full h-full">
            {board.map((cell, idx) => {
              const isInitial = game.puzzle[idx] !== '-';
              const row = Math.floor(idx / 9);
              const col = idx % 9;

              // 3x3 Block Thicker Border Calculations
              const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-slate-500' : '';
              const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-slate-500' : '';

              return (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  disabled={!gameStarted || isInitial || isWon}
                  value={cell === '-' ? '' : cell}
                  onChange={(e) => handleCellChange(idx, e.target.value)}
                  className={`w-full h-full text-center font-black text-sm rounded-md transition-all outline-none ${borderRight} ${borderBottom} ${
                    isInitial
                      ? 'bg-slate-900 text-cyan-400 font-extrabold'
                      : 'bg-slate-950 text-white hover:bg-slate-900 focus:bg-blue-950/60 focus:border-cyan-400 border border-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Start / Victory Screen Overlay */}
          {(!gameStarted || isWon) && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">🧩</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {isWon ? 'Puzzle Solved!' : 'Cyber Sudoku'}
              </h3>
              
              <p className="text-xs text-slate-400 mb-5">
                {isWon ? 'Great job! You completed the grid.' : 'Fill the 9x9 grid with numbers 1 to 9.'}
              </p>

              {/* Difficulty Selector */}
              {!isWon && (
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full mb-4">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-1 text-[10px] uppercase font-bold rounded-lg transition-all ${
                        difficulty === d ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <button
                  onClick={() => startNewGame(difficulty)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 active:scale-95"
                >
                  {isWon ? 'Next Puzzle' : 'Start Session'}
                </button>

                {isWon && (
                  <button
                    onClick={saveScoreToBackend}
                    disabled={isSaving}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-xl transition active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Syncing...' : 'Sync Score to Cloud'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer New Game Button */}
        {gameStarted && !isWon && (
          <button
            onClick={() => startNewGame(difficulty)}
            className="w-[360px] py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition active:scale-95"
          >
            New Game ({difficulty.toUpperCase()})
          </button>
        )}

      </div>
    </div>
  );
};