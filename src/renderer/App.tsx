import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { HandTraking } from "./components/HandTraking";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HandTraking />} />
            </Routes>
        </Router>
    );
};
