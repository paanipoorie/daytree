import { useEffect, useRef, useState } from "react";

function AuthActions({ mode, onModeChange, onGoogleLogin }) {
  const isLogin = mode === "login";
  const googleBtnRef = useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const checkGis = () => {
      if (window.google && googleClientId) {
        setGisLoaded(true);
      }
    };
    
    checkGis();
    const interval = setInterval(checkGis, 500);
    return () => clearInterval(interval);
  }, [googleClientId]);

  useEffect(() => {
    if (gisLoaded && googleBtnRef.current) {
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
        setTimeout(() => {
          setGisLoaded(false);
        }, 0);
      }
    }
  }, [gisLoaded, googleClientId, onGoogleLogin]);

  const handleMockGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin("mock-google-token");
    }
  };

  return (
    <>
      <div className="auth-divider">
        <span />
        <strong>OR</strong>
        <span />
      </div>

      <div className="auth-socials" style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        {gisLoaded ? (
          <div ref={googleBtnRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
        ) : (
          <button type="button" onClick={handleMockGoogleLogin} style={{ width: "100%" }}>
            <span>G</span>
            Continue with Google
          </button>
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
