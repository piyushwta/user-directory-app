import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDirectory from "../pages/UserDirectory";


export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<UserDirectory />} />
        </Routes>
    </BrowserRouter>
);