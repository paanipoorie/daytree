import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../providers/authContext";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignupPage from "../../features/auth/pages/SignupPage";
import HomePage from "../../features/habits/pages/HomePage";
import TallyPage from "../../features/tally/pages/TallyPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("home");

  if (!isAuthenticated) {
    return authPage === "login" ? (
      <LoginPage onModeChange={setAuthPage} />
    ) : (
      <SignupPage onModeChange={setAuthPage} />
    );
  }

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "home" && <HomePage />}
      {currentPage === "tally" && <TallyPage />}
    </MainLayout>
  );
}

export default AppRoutes;
