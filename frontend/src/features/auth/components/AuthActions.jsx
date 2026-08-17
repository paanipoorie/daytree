import { useEffect, useRef, useState } from "react";
import { fetchAuthConfig } from "../services/authService";

const CLIENT_ID_KEY = "daytree_google_client_id";

// Check if GIS is already loaded
const isGisLoaded = () => {
  return !!(window.google && window.google.accounts && window.google.accounts.id);
};

// Retrieve client ID with compile-time environment variable or persistent run-time cache
const getInitialGoogleClientId = () => {
  const rawId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem(CLIENT_ID_KEY) || "";
  return typeof rawId === "string" ? rawId.trim() : "";
};

// Module-level cache to persist Google Client ID across component mounts
let cachedGoogleClientId = getInitialGoogleClientId();

function AuthActions({ mode, onModeChange, onGoogleLogin }) {
  const isLogin = mode === "login";
  const googleBtnRef = useRef(null);
  const [googleClientId, setGoogleClientId] = useState(() => cachedGoogleClientId);
  const [gisStatus, setGisStatus] = useState(() => isGisLoaded() ? "loaded" : "loading");

  // Effect to retrieve Google Client ID if missing
  useEffect(() => {
    let active = true;
    if (!googleClientId) {
      fetchAuthConfig()
        .then((data) => {
          if (active && data && data.googleClientId) {
            const cleanId = data.googleClientId.trim();
            cachedGoogleClientId = cleanId;
            localStorage.setItem(CLIENT_ID_KEY, cleanId);
            setGoogleClientId(cleanId);
          } else if (active) {
            setGisStatus("error");
          }
        })
        .catch((err) => {
          console.error("Failed to load auth config:", err);
          if (active) {
            setGisStatus("error");
          }
        });
    }
    return () => {
      active = false;
    };
  }, [googleClientId]);

  // Effect to load the Google Identity Services SDK script dynamically and track its load state
  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    if (isGisLoaded()) {
      setGisStatus("loaded");
      return;
    }

    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      if (isGisLoaded()) {
        setGisStatus("loaded");
      }
    };

    const handleError = () => {
      setGisStatus("error");
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    // Dynamic polling fallback (checks every 100ms for faster load response)
    const checkInterval = setInterval(() => {
      if (isGisLoaded()) {
        setGisStatus("loaded");
        clearInterval(checkInterval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!isGisLoaded()) {
        setGisStatus("error");
      }
    }, 5000); // 5 seconds timeout

    return () => {
      if (script) {
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      }
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [googleClientId]);

  // Effect to initialize and render the Google button when loaded
  useEffect(() => {
    if (gisStatus === "loaded" && googleBtnRef.current && googleClientId) {
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

