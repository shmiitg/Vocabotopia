import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// import components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
// import pages
import Bookmark from "./pages/word/Bookmark";
import BookmarkOWS from "./pages/ows/BookmarkOWS";
import Word from "./pages/word/Word";
import Revision from "./pages/Revision";
import OWS from "./pages/ows/OWS";
import Idiom from "./pages/idiom/Idiom";
import Spelling from "./pages/spelling/Spelling";
import Cluster from "./pages/cluster/Cluster";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import css files
import "./App.css";
import "./css/Modal.css";
import "./css/WordContainer.css";
import { AuthContext } from "./context/AuthContext";

const App = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="App">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Word />} />
                    <Route path="/bookmark" element={<Bookmark />} />
                    <Route path="/bookmark-ows" element={<BookmarkOWS />} />
                    <Route path="/revision" element={<Revision />} />
                    <Route path="/ows" element={<OWS />} />
                    <Route path="/idioms" element={<Idiom />} />
                    <Route path="/spellings" element={<Spelling />} />
                    <Route path="/clusters" element={<Cluster />} />
                    <Route path="/login" element={user ? <Navigate to="/bookmark" /> : <Login />} />
                    <Route
                        path="/register"
                        element={user ? <Navigate to="/bookmark" /> : <Register />}
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
