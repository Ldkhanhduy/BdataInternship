import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>MyApp</h3>
      <div>
        <Link to="/" style={styles.link}>Login</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/home" style={styles.link}>Home</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem",
    background: "#282c34",
    color: "white"
  },
  logo: { margin: 0 },
  link: {
    margin: "0 10px",
    color: "white",
    textDecoration: "none"
  }
};
