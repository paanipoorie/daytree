import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../app/providers/authContext";
import BrandMark from "./BrandMark";

function Navbar({ onLogout }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <h1>
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          <BrandMark size="medium" />
        </Link>
      </h1>

      <nav style={{ display: "flex", alignItems: "center" }}>
        <NavLink
          to="/home"
          className={({ isActive }) => `nav-link ${isActive ? "active-nav" : ""}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/tally"
          className={({ isActive }) => `nav-link ${isActive ? "active-nav" : ""}`}
          style={{ marginRight: "12px" }}
        >
          Tally
        </NavLink>

        {user && (
          <div 
            className="navbar-user-profile" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              marginRight: "16px",
              fontFamily: "monospace",
              fontSize: "14px",
              fontWeight: "bold",
              borderRight: "2px solid #000",
              paddingRight: "16px"
            }}
          >
            {user.profilePicture?.url ? (
              <img 
                src={user.profilePicture.url} 
                alt="Profile" 
                style={{ 
                  width: "28px", 
                  height: "28px", 
                  borderRadius: "50%", 
                  border: "2px solid #000", 
                  objectFit: "cover" 
                }} 
              />
            ) : (
              <div 
                style={{ 
                  width: "28px", 
                  height: "28px", 
                  borderRadius: "50%", 
                  border: "2px solid #000", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  backgroundColor: "#000", 
                  color: "#fff",
                  fontSize: "12px"
                }}
              >
                {(user.username || user.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <span>{user.username || user.email?.split('@')[0]}</span>
          </div>
        )}

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
