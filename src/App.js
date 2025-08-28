import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Login from "./pages/Login";
import Keywords from "./pages/Keywords";
// import Werehouse from "./pages/werehouse";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Khi mở app, điều hướng về /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/keywords" element={<Keywords />} />
        <Route path="/data" element={<Data />} />
        {/* <Route path="/" element={<Navigate to="/werehouse" />} /> */}
      </Routes>
    </Router>
  );
}
