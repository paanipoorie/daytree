import { NavLink, Link } from "react-router-dom";
import BrandMark from "./BrandMark";

function Navbar({ onLogout }) {
  return (
    <header className="navbar">
      <h1>
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          <BrandMark size="medium" />
        </Link>
      </h1>

      <nav>
        <NavLink
          to="/home"
          className={({ isActive }) => `nav-link ${isActive ? "active-nav" : ""}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/tally"
          className={({ isActive }) => `nav-link ${isActive ? "active-nav" : ""}`}
        >
          Tally
        </NavLink>

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
