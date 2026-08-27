import React, { useState } from 'react';
import { CarRacingGame } from './CarRacingGame';
import { TicTacToeGame } from './TicTacToeGame';
import { SnakeGame } from './SnakeGame';
import { SudokuGame } from './SudokuGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { BrickBreakerGame } from './BrickBreakerGame';

type GameId = 'CAR_RACING' | 'TIC_TAC_TOE' | 'SNAKE' | 'SUDOKU' | 'MEMORY_MATCH' | 'BRICK_BREAKER' | null;

interface GameCard {
    id: GameId;
    title: string;
    category: string;
    description: string;
    icon: string;
    badge: string;
    accentColor: string;
}

const GAMES_LIST: GameCard[] = [
    {
        id: 'CAR_RACING',
        title: 'Cyber Pursuit',
        category: 'Racing',
        description: 'Dodge incoming high-speed traffic on the neon highway.',
        icon: '🏎️',
        badge: '3D Speed',
        accentColor: 'from-sky-500 to-blue-600',
    },
    {
        id: 'BRICK_BREAKER',
        title: 'Glow Breaker',
        category: 'Arcade Physics',
        description: 'Smash glowing brick layers with multi-level ball bounces.',
        icon: '🧱',
        badge: 'Multi-Level',
        accentColor: 'from-rose-500 to-red-600',
    },
    {
        id: 'SNAKE',
        title: 'Nokia Snake',
        category: 'Retro Classic',
        description: 'Pass through open screen borders & collect power-ups.',
        icon: '🐍',
        badge: 'Pass-Through',
        accentColor: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'TIC_TAC_TOE',
        title: 'Neon Tic-Tac-Toe',
        category: 'Strategy',
        description: 'Battle against a Smart Bot AI or challenge a friend.',
        icon: '❌⭕',
        badge: 'AI & 2P',
        accentColor: 'from-cyan-500 to-blue-500',
    },
    {
        id: 'MEMORY_MATCH',
        title: 'Neon Match',
        category: 'Brain Teaser',
        description: 'Test your memory speed and flip identical card pairs.',
        icon: '🧠',
        badge: 'Timer Mode',
        accentColor: 'from-purple-500 to-indigo-600',
    },
    {
        id: 'SUDOKU',
        title: 'Neon Sudoku',
        category: 'Logic Puzzle',
        description: 'Solve 9x9 grid number matrix across 3 difficulty levels.',
        icon: '🧩',
        badge: 'Easy to Hard',
        accentColor: 'from-blue-500 to-cyan-600',
    },
];

export const ArcadeZone: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<GameId>(null);

    return (
        <div className="min-h-screen w-full bg-[#020617] text-slate-100 relative overflow-hidden font-sans select-none">

            {/* 🔮 Background Cyber Ambient Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

            {/* 🕸️ Cyberpunk Grid Floor Overlay */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none"
                style={{
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 70%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 70%, transparent 100%)',
                }}
            />

            {/* 🕹️ MAIN PAGE HEADER */}
            <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                            👾
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono leading-none">
                                Games
                            </h1>
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mt-1">
                                6-in-1 Retro Gaming Arena
                            </span>
                        </div>
                    </div>

                    {/* Navigation Control */}
                    {selectedGame && (
                        <button
                            onClick={() => setSelectedGame(null)}
                            className="flex items-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 font-bold text-xs rounded-xl transition shadow-lg active:scale-95"
                        >
                            ⬅️ Exit To Arcade Menu
                        </button>
                    )}
                </div>
            </header>

            {/* 🎮 CONTENT AREA */}
            <main className="relative z-10 max-w-6xl mx-auto p-6 min-h-[calc(100vh-80px)] flex flex-col justify-center">

                {/* GAME DASHBOARD MATRIX (When no game is active) */}
                {!selectedGame ? (
                    <div className="py-8">

                        {/* Hero Text */}
                        <div className="text-center mb-10">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400 block mb-2">
                                Select Your Challenge
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                                ENTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">GAMING ZONE</span>
                            </h2>
                        </div>

                        {/* 6 Game Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {GAMES_LIST.map((game) => (
                                <div
                                    key={game.id}
                                    onClick={() => setSelectedGame(game.id)}
                                    className="group relative bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] cursor-pointer backdrop-blur-xl flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Subtle Top Inner Glow */}
                                    <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${game.accentColor} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />

                                    <div>
                                        {/* Top Row Badge & Category */}
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                                                {game.category}
                                            </span>
                                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
                                                {game.badge}
                                            </span>
                                        </div>

                                        {/* Icon & Title */}
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                                                {game.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {game.title}
                                                </h3>
                                                <span className="text-[11px] text-slate-500 font-mono">Ready to play</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                            {game.description}
                                        </p>
                                    </div>

                                    {/* Play Button Bar */}
                                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 text-slate-300 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-slate-800 group-hover:border-transparent">
                                        <span>Launch Game</span>
                                        <span>➔</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ACTIVE GAME CONTAINER LOADER */
                    <div className="flex items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-200">
                        {selectedGame === 'CAR_RACING' && <CarRacingGame />}
                        {selectedGame === 'BRICK_BREAKER' && <BrickBreakerGame />}
                        {selectedGame === 'SNAKE' && <SnakeGame />}
                        {selectedGame === 'TIC_TAC_TOE' && <TicTacToeGame />}
                        {selectedGame === 'MEMORY_MATCH' && <MemoryMatchGame />}
                        {selectedGame === 'SUDOKU' && <SudokuGame />}
                    </div>
                )}
            </main>
        </div>
    );
};