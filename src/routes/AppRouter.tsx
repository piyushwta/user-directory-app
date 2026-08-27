import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDirectory from "../pages/UserDirectory";
import { SudokuGame } from "../pages/SudokuGame";
import { CarRacingGame } from "../pages/CarRacingGame";
import { SnakeGame } from "../pages/SnakeGame";
import { TicTacToeGame } from "../pages/TicTacToeGame";
import { MemoryMatchGame } from "../pages/MemoryMatchGame";
import { BrickBreakerGame } from "../pages/BrickBreakerGame";
import { ArcadeZone } from "../pages/ArcadeZone";


export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<UserDirectory />} />
            <Route path="/games" element={<ArcadeZone />} />
            <Route path="/games/sudoku" element={<SudokuGame />} />
            <Route path="/games/car" element={<CarRacingGame />} />
            <Route path="/games/snake" element={<SnakeGame />} />
            <Route path="/games/tic-tac-toe" element={<TicTacToeGame />} />
            <Route path="/games/memory-match" element={<MemoryMatchGame />} />
            <Route path="/games/brick-braker" element={<BrickBreakerGame />} />
        </Routes>
    </BrowserRouter>
);