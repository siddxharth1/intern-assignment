import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
