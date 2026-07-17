import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../app/providers/authContext";
import BrandMark from "./BrandMark";

function Navbar({ onLogout }) {
  const { user } = useAuth();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="navbar">
      <h1>
        <Link to="/home" className="brand-link">
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

        {user && (
          <div className="navbar-user-profile">
            {user.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt="Profile"
              />
            ) : (
              <div className="avatar-placeholder">
                {(user.username || user.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <span>{user.username || user.email?.split("@")[0]}</span>
          </div>
        )}

        <button className="logout-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
