import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_ICONS = ['🚀', '👾', '🕹️', '⚡', '💎', '🛸', '🔮', '⚔️'];

export const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Cards Shuffle Generator
  const initializeCards = () => {
    const duplicatedIcons = [...CARD_ICONS, ...CARD_ICONS];
    const shuffled = duplicatedIcons
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setIsWon(false);
  };

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && !isWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isWon]);

  // Card Click Logic
  const handleCardClick = (id: number) => {
    if (!gameStarted || isWon || flippedCards.length === 2) return;
    const clickedCard = cards.find((c) => c.id === id);
    if (clickedCard?.isFlipped || clickedCard?.isMatched) return;

    // Flip Clicked Card
    const updatedCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    // Match Check when 2 cards are flipped
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard?.icon === secondCard?.icon) {
        // Matched!
        setTimeout(() => {
          const matchedCards = updatedCards.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);

          // Check Full Grid Cleared
          if (matchedCards.every((c) => c.isMatched)) {
            setIsWon(true);
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          }
        }, 300);
      } else {
        // Unmatch -> Flip back after delay
        setTimeout(() => {
          setCards(
            updatedCards.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const startGame = () => {
    initializeCards();
    setGameStarted(true);
  };

  const saveScoreToBackend = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType: 'MEMORY_MATCH', score: Math.max(1000 - moves * 10 - timer * 2, 100) }),
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
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Cyberpunk Grid Floor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-[90vh] max-h-[800px] p-6 bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_0_60px_rgba(168,85,247,0.2)] font-sans overflow-hidden backdrop-blur-xl">
        
        {/* Topbar Scoreboard */}
        <div className="w-[320px] flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Memory Arcade</span>
            <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">Neon Match</h2>
          </div>
          <div className="flex gap-4 text-right font-mono">
            <div>
              <span className="text-[9px] text-cyan-400 font-bold block">MOVES</span>
              <span className="text-lg font-black text-white">{moves}</span>
            </div>
            <div className="border-r border-slate-800" />
            <div>
              <span className="text-[9px] text-purple-400 font-bold block">TIME</span>
              <span className="text-lg font-black text-white">{timer}s</span>
            </div>
          </div>
        </div>

        {/* 4x4 Cards Matrix Board */}
        <div className="relative w-[320px] h-[400px] p-2 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center">
          <div className="grid grid-cols-4 gap-2.5 w-full h-full p-1">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`relative flex items-center justify-center text-3xl font-bold rounded-xl border transition-all duration-300 ${
                  card.isMatched
                    ? 'bg-purple-500/20 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.4)] opacity-80'
                    : card.isFlipped
                    ? 'bg-slate-900 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.icon : '❓'}
              </button>
            ))}
          </div>

          {/* Start / Victory Screen Overlay */}
          {(!gameStarted || isWon) && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">🧠</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {isWon ? 'Memory Cleared!' : 'Neon Match'}
              </h3>
              
              <p className="text-xs text-slate-400 mb-5">
                {isWon ? `Cleared in ${moves} moves & ${timer} seconds!` : 'Flip cards and match all identical pairs.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <button
                  onClick={startGame}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-purple-600/25 active:scale-95"
                >
                  {isWon ? 'Play Again' : 'Start Session'}
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

        {/* Footer Status */}
        {gameStarted && !isWon && (
          <button
            onClick={startGame}
            className="w-[320px] py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition active:scale-95"
          >
            Restart Cards
          </button>
        )}

      </div>
    </div>
  );
};