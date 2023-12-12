import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Main } from "./pages/Main";
import { Provider } from "react-redux";
import { store } from "./store";

export const App = () => {
    return (
        <Provider store={store}>
            <Layout>
                <Router>
                    <Routes>
                        <Route path="/" element={<Main />} />
                    </Routes>
                </Router>
            </Layout>
        </Provider>
    );
};
