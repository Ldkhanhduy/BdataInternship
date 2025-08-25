import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";

function PrivateRoute({ children }) {
  const isAuth = localStorage.getItem("isAuthenticated");
  return isAuth ? children : <Navigate to="/login" />;
}

// Layout: chỉ hiển thị Navbar nếu không phải trang login
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          {/* mọi route lạ → về login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
