import { React } from "react";
import Home from "./pages/Home/Home";
import { Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/auth/login" element={<Login />} />
      <Route exact path="/auth/register" element={<SignUp />} />
    </Routes>
  );
}

export default App;
