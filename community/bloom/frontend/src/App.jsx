import React from "react";
import ReduxProvider from "./components/provider/ReduxProvider";
import Match from "./page/Match";
import Home from "./page/Home";
import { Routes, Route } from "react-router-dom";
import LoginEnable from "./components/loginEnable";
import Chat from "./page/Chat";
import Quiz from "./page/quiz";
import Result from "./page/Result";
import Navbar from "./components/Navbar";
import Dashboard from "./page/Dashboard";
import About from "./page/About";

const App = () => {
  return (
    <ReduxProvider>
      <Navbar />
      <LoginEnable />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/match" element={<Match />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </ReduxProvider>
  );
};

export default App;