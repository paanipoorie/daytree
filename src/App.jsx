import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Tally from "./pages/Tally";

function App() {
  
  const [currentPage, setCurrentPage] = useState("home");

  
  return (
    <div className="app">
      
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && <Home />}

      {currentPage === "tally" && <Tally />}
    </div>
  );
}

export default App;
