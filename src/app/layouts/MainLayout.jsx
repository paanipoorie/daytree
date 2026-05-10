import Navbar from "../../shared/components/Navbar";
import { useAuth } from "../providers/authContext";

function MainLayout({ currentPage, onNavigate, children }) {
  const { logout } = useAuth();

  return (
    <div className="app">
      <Navbar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={logout}
      />

      {children}
    </div>
  );
}

export default MainLayout;
