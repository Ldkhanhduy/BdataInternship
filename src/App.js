import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Login from "./pages/Login";
import Keywords from "./pages/Keywords";
import ProtectedRoute from "./components/ProtectRoute";
// import Werehouse from "./pages/werehouse";



export default function App() {
  return (
    <Router>
      <Routes>
        {/* Khi mở app, điều hướng về /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route public */}
        <Route path="/login" element={<Login />} />

        {/* Các route cần login */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/keywords"
          element={
            <ProtectedRoute>
              <Keywords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data"
          element={
            <ProtectedRoute>
              <Data />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/" element={<Navigate to="/werehouse" />} /> */}
      </Routes>
    </Router>
  );
}
