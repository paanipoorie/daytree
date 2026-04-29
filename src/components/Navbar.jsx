function Navbar({ currentPage, setCurrentPage }) {
  return (
    <header className="navbar">
      <h1>DayTree</h1>

      <nav>
        <button
          type="button"
          className={`nav-link ${currentPage === "home" ? "active-nav" : ""}`}
          onClick={() => setCurrentPage("home")}
        >
          Home
        </button>

        <button
          type="button"
          className={`nav-link ${currentPage === "tally" ? "active-nav" : ""}`}
          onClick={() => setCurrentPage("tally")}
        >
          Tally
        </button>

        <button className="logout-button" type="button">Logout</button>
      </nav>
    </header>
  );
}

export default Navbar;
