import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authContext";
import MainLayout from "../layouts/MainLayout";
import GrowingTree from "../../shared/components/GrowingTree";
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignupPage from "../../features/auth/pages/SignupPage";
import VerifyEmailPage from "../../features/auth/pages/VerifyEmailPage";
import ProfileSetupPage from "../../features/auth/pages/ProfileSetupPage";
import HomePage from "../../features/habits/pages/HomePage";
import TallyPage from "../../features/tally/pages/TallyPage";
import NotFoundPage from "../../pages/NotFoundPage";
import AboutPage from "../../pages/AboutPage";
import FeaturesPage from "../../pages/FeaturesPage";
import FAQPage from "../../pages/FAQPage";
import PrivacyPage from "../../pages/PrivacyPage";
import TermsPage from "../../pages/TermsPage";
import HabitTrackerPage from "../../pages/HabitTrackerPage";
import DailyHabitTrackerPage from "../../pages/DailyHabitTrackerPage";
import HabitTrackerForStudentsPage from "../../pages/HabitTrackerForStudentsPage";
import HabitTrackerWithStreaksPage from "../../pages/HabitTrackerWithStreaksPage";
import HabitTrackerWithAnalyticsPage from "../../pages/HabitTrackerWithAnalyticsPage";
import BlogListPage from "../../pages/BlogListPage";
import BlogPostPage from "../../pages/BlogPostPage";

// Route guard for guest-only public pages (Landing, Login, Signup)
function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (!user?.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    if (!user?.isOnboarded) {
      return <Navigate to="/profile-setup" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// Route guard for verification only (user logged in but email is not verified yet)
function VerifyEmailRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isVerified) {
    if (!user?.isOnboarded) {
      return <Navigate to="/profile-setup" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// Route guard for onboarding only (user logged in, verified, but not onboarded yet)
function ProfileSetupRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
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

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
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

// Helper components to connect signup callbacks to the router
function SignupPageRoute() {
  const navigate = useNavigate();
  return <SignupPage onModeChange={() => navigate("/login")} />;
}

function AppRoutes() {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div 
        className="initial-loading-container" 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          backgroundColor: '#000',
          border: '4px solid #fff',
          boxSizing: 'border-box',
          margin: '2rem',
        }}
      >
        <GrowingTree />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPageRoute />} />
        <Route path="/signup" element={<SignupPageRoute />} />
      </Route>

      {/* Email Verification Route */}
      <Route element={<VerifyEmailRoute />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
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

      {/* Publicly Accessible Info Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/habit-tracker" element={<HabitTrackerPage />} />
      <Route path="/daily-habit-tracker" element={<DailyHabitTrackerPage />} />
      <Route path="/habit-tracker-for-students" element={<HabitTrackerForStudentsPage />} />
      <Route path="/habit-tracker-with-streaks" element={<HabitTrackerWithStreaksPage />} />
      <Route path="/habit-tracker-with-analytics" element={<HabitTrackerWithAnalyticsPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      {/* Wildcard / 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
