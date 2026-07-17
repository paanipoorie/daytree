import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/authContext";
import AuthTreePanel from "../components/AuthTreePanel";
import BrandMark from "../../../shared/components/BrandMark";

function ProfileSetupPage() {
  const { completeOnboarding, user, isAuthLoading, authError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    if (isAuthLoading) return;
    const file = e.target.files[0];
    if (file) {
      setAvatar(file.name);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthLoading) return;
    try {
      await completeOnboarding(username, avatarFile);
      navigate("/home");
    } catch (err) {
      console.error("Onboarding failed:", err.message);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-frame">
        <form className="auth-card" onSubmit={handleSubmit}>
          <BrandMark size="medium" />
          <p className="auth-tagline">Grow daily. Stay consistent.</p>

          <h1>Welcome to DayTree</h1>
          <p className="onboarding-subtitle">Tell us a bit about yourself</p>

          <p style={{ 
            marginBottom: "24px", 
            fontSize: "13px", 
            color: "var(--color-text-secondary, #6b7280)",
            lineHeight: "1.5"
          }}>
            You're almost ready. Set up your profile to start tracking daily habits 
            and building consistency. You can always change this later.
          </p>

          {/* Profile Picture Section */}
          <div className="auth-field profile-picture-setup">
            <label className="field-label">Profile Picture</label>
            <div className="avatar-onboarding-row">
              <div className="avatar-preview-box">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="avatar-preview-img" />
                ) : (
                  <span className="avatar-placeholder">?</span>
                )}
              </div>
              <div className="avatar-upload-actions">
                <label className={`btn-file-upload ${isAuthLoading ? "disabled" : ""}`} style={{ pointerEvents: isAuthLoading ? "none" : "auto", opacity: isAuthLoading ? 0.6 : 1 }}>
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isAuthLoading}
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
                {avatar && <span className="upload-file-name">{avatar}</span>}
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="username" className="field-label">Username</label>
            <input
              id="username"
              type="text"
              required
              disabled={isAuthLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. janesmith"
            />
          </div>

          {authError && <p className="form-error" style={{ margin: "1rem 0 0 0" }}>{authError}</p>}

          <button className="auth-submit" type="submit" disabled={isAuthLoading} style={{ marginTop: "24px" }}>
            {isAuthLoading ? "Saving..." : "Continue"}
          </button>
        </form>

        <AuthTreePanel />
      </section>
    </main>
  );
}

export default ProfileSetupPage;
