import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./Game";
import Homepage from "./Homepage";
export default function Path() {

    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/game" element={<GamePage />}></Route>
        </Routes>
    </BrowserRouter>
    )
}