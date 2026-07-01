import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authContext";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignupPage from "../../features/auth/pages/SignupPage";
import ProfileSetupPage from "../../features/auth/pages/ProfileSetupPage";
import HomePage from "../../features/habits/pages/HomePage";
import TallyPage from "../../features/tally/pages/TallyPage";
import NotFoundPage from "../../pages/NotFoundPage";

// Route guard for guest-only public pages (Landing, Login, Signup)
function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (!user?.isOnboarded) {
      return <Navigate to="/profile-setup" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// Route guard for onboarding only (user logged in but not onboarded yet)
function ProfileSetupRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isOnboarded) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// Route guard for protected dashboard pages (Home, Tally)
function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isOnboarded) {
    return <Navigate to="/profile-setup" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// Helper components to connect Login and Signup callbacks to the router
function LoginPageRoute() {
  const navigate = useNavigate();
  return <LoginPage onModeChange={() => navigate("/signup")} />;
}

function SignupPageRoute() {
  const navigate = useNavigate();
  return <SignupPage onModeChange={() => navigate("/login")} />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPageRoute />} />
        <Route path="/signup" element={<SignupPageRoute />} />
      </Route>

      {/* Profile Onboarding Route */}
      <Route element={<ProfileSetupRoute />}>
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/tally" element={<TallyPage />} />
      </Route>

      {/* Wildcard / 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
