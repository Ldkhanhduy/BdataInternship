import { NavLink, useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import { ReactComponent as HomeIcon } from "../assets/house-regular-full.svg";
import { ReactComponent as DataIcon } from "../assets/file-regular-full.svg";
import { ReactComponent as KeyIcon } from "../assets/list-check-solid-full.svg";
import { ReactComponent as LogIcon } from "../assets/arrow-right-from-bracket-solid-full.svg";
import Icon from "../assets/icon.png";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa trạng thái đăng nhập
    localStorage.removeItem("isAuthenticated");

    // Điều hướng về login
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="logo">
        <NavLink to="/home" className="nav-link-logo">
          <img src={Icon} alt="Login illustration" />
          MyApp
        </NavLink>
      </div>

      <div className="action-tag">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <HomeIcon />
          Trang chủ
        </NavLink>
      </div>

      <div className="action-tag">
        <NavLink
          to="/data"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <DataIcon />
          Trung tâm dữ liệu
        </NavLink>
      </div>

      <div className="action-tag">
        <NavLink
          to="/keywords"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <KeyIcon />
          Toàn bộ từ khóa
        </NavLink>
      </div>

      {/* Logout button */}
      <div
        className="action-tag"
        style={{ marginTop: "auto", marginBottom: "20px", cursor: "pointer", padding: "20px 10px 20px 10px" }}
        onClick={handleLogout}
      >
        <LogIcon />
        Đăng xuất
      </div>
    </nav>
  );
}
