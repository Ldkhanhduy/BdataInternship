import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import { ReactComponent as HomeIcon } from "../assets/house-regular-full.svg";
import { ReactComponent as DataIcon } from "../assets/file-regular-full.svg";
import { ReactComponent as KeyIcon } from "../assets/list-check-solid-full.svg";
import { ReactComponent as LogIcon } from "../assets/arrow-right-from-bracket-solid-full.svg";
import Icon from "../assets/icon.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // trạng thái mở/ẩn navbar

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <>
      {/* Nút toggle hiển thị ở màn hình nhỏ */}
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Navbar, ẩn/hiện dựa theo state */}
      <nav className={`nav ${isOpen ? "open" : "closed"}`}>
        <div className="logo">
          <NavLink to="/home" className="nav-link-logo">
            <img src={Icon} alt="Login illustration" />
            <span>MyApp</span>
          </NavLink>
        </div>

        <div className="action-tag">
          <NavLink to="/home" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <HomeIcon />
            <span>Trang chủ</span>
          </NavLink>
        </div>

        <div className="action-tag">
          <NavLink to="/data" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <DataIcon />
            <span>Trung tâm dữ liệu</span>
          </NavLink>
        </div>

        <div className="action-tag">
          <NavLink to="/keywords" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <KeyIcon />
            <span>Toàn bộ từ khóa</span>
          </NavLink>
        </div>

        <div
          className="action-tag logout"
          style={{ marginTop: "auto", marginBottom: "20px", cursor: "pointer", padding: "20px 10px 20px 10px" }}
          onClick={handleLogout}
        >
          <LogIcon />
          <span>Đăng xuất</span>
        </div>
      </nav>
    </>
  );
}
