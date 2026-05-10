import BrandMark from "./BrandMark";

function Navbar({ currentPage, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <h1>
        <BrandMark />
      </h1>

      <nav>
        <button
          type="button"
          className={`nav-link ${currentPage === "home" ? "active-nav" : ""}`}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>

        <button
          type="button"
          className={`nav-link ${currentPage === "tally" ? "active-nav" : ""}`}
          onClick={() => onNavigate("tally")}
        >
          Tally
        </button>

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
