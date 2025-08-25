import { NavLink } from "react-router-dom";
import "../style/Navbar.css";
import { ReactComponent as HomeIcon } from "../assets/house-regular-full.svg";
import { ReactComponent as DataIcon } from "../assets/file-regular-full.svg";
import { ReactComponent as KeyIcon } from "../assets/list-check-solid-full.svg";
import { ReactComponent as LogIcon } from "../assets/arrow-right-from-bracket-solid-full.svg";
import Icon from "../assets/icon.png";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="logo">
        <NavLink
          to="/home"
          className="nav-link-logo"
        >
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

      <div className="action-tag" style={{marginTop: 'auto', marginBottom: '20px'}}>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <LogIcon />
          Đăng xuất
        </NavLink>
      </div>
    </nav>
  );
}

