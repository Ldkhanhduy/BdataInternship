import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import Eye from "../assets/eye-regular-full.svg";
import Noeye from "../assets/eye-slash-regular-full.svg";
import Icon from "../assets/icon.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state show/hide password
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập login
    if (email === "admin@bdata.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    } else {
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-container">
      {/* Bên trái hình minh họa */}
      <div className="login-left">
        <img src={Icon} alt="Login illustration" />
      </div>

      {/* Bên phải form login */}
      <div className="login-right">
        <div className="login-box">
          <h2>Hello!</h2>
          <p>Sign Up to Get Started</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Input password với toggle show/hide */}
            <div className="password-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <img
                    src={showPassword ? Noeye : Eye} // Eye: mắt mở, Noeye: mắt đóng
                    alt="Toggle Password"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                />
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
