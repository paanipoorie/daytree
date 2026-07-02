import Navbar from "../../shared/components/Navbar";
import { useAuth } from "../providers/authContext";

function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="app">
      <Navbar onLogout={logout} />
      {children}
    </div>
  );
}

export default MainLayout;
