import { useEffect, useRef, useState } from "react";

function AuthActions({ mode, onModeChange, onGoogleLogin }) {
  const isLogin = mode === "login";
  const googleBtnRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const [gisStatus, setGisStatus] = useState(() => (googleClientId ? "loading" : "error")); // "loading", "loaded", "error"

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const checkGis = () => {
      if (window.google) {
        setGisStatus("loaded");
      }
    };
    
    checkGis();
    const interval = setInterval(checkGis, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setGisStatus((prev) => (prev === "loaded" ? "loaded" : "error"));
    }, 3000); // 3 seconds timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [googleClientId]);

  useEffect(() => {
    if (gisStatus === "loaded" && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (response.credential) {
              onGoogleLogin(response.credential);
            }
          },
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
        });
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
        setTimeout(() => setGisStatus("error"), 0);
      }
    }
  }, [gisStatus, googleClientId, onGoogleLogin]);

  return (
    <>
      <div className="auth-divider">
        <span />
        <strong>OR</strong>
        <span />
      </div>

      <div className="auth-socials" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
        {gisStatus === "loading" && (
          <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>Loading Google Sign-In…</div>
        )}
        
        {gisStatus === "loaded" && (
          <div ref={googleBtnRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
        )}
        
        {gisStatus === "error" && (
          <div 
            className="google-auth-error" 
            style={{ 
              color: "#d93025", 
              fontSize: "13px", 
              textAlign: "center", 
              width: "100%", 
              lineHeight: "1.5",
              padding: "12px",
              border: "1px solid #d93025",
              backgroundColor: "#fef2f2",
              borderRadius: "6px"
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "4px" }}>Google Sign-In unavailable</div>
            <div style={{ color: "#666", fontSize: "12px", marginBottom: "8px" }}>
              This feature requires Google's authentication service. 
              It may be blocked by privacy settings or network restrictions.
            </div>
            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
              Please use email & password to continue.
            </p>
          </div>
        )}
      </div>

      <p className="auth-switch">
        {isLogin ? "No account?" : "Have an account?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(isLogin ? "signup" : "login")}
        >
          {isLogin ? "Create One" : "Sign In"}
        </button>
      </p>
    </>
  );
}

export default AuthActions;

