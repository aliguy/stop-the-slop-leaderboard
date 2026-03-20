import { useState, useEffect } from "react";
import { FlywheelLogo } from "@/components/flywheel-logo";
import { supabase } from "@/lib/supabase";

// Chrome extension ID — update this after loading the extension unpacked
// Go to chrome://extensions/ and copy the ID
const EXTENSION_ID = "";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if opened from extension
  const params = new URLSearchParams(window.location.search);
  const isExtension = params.get("extension") === "true";

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthSuccess(session);
      }
    });
  }, []);

  async function handleAuthSuccess(session: any) {
    setSuccess(true);

    // If opened from extension, send tokens back
    if (isExtension && EXTENSION_ID) {
      try {
        await chrome.runtime.sendMessage(EXTENSION_ID, {
          type: "SLOP_AUTH_CALLBACK",
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            display_name:
              session.user.user_metadata?.display_name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0],
          },
        });
      } catch (e) {
        // Extension might not be listening — that's OK
        console.log("Could not send to extension:", e);
      }
    }

    // Also try postMessage for same-origin extension pages
    if (isExtension) {
      window.postMessage(
        {
          type: "SLOP_AUTH_CALLBACK",
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            display_name:
              session.user.user_metadata?.display_name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0],
          },
        },
        "*"
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          await handleAuthSuccess(data.session);
        } else {
          setSuccess(true);
          setError("Check your email to confirm your account.");
        }
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.session) {
          await handleAuthSuccess(data.session);
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth${isExtension ? "?extension=true" : ""}`,
      },
    });
    if (error) setError(error.message);
  }

  if (success && !error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-sm p-8 text-center">
          <FlywheelLogo className="w-8 h-8 mx-auto mb-6" />
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] mb-4">
            You're in.
          </h1>
          <p className="text-[15px] text-black/50 mb-8">
            {isExtension
              ? "You can close this tab and return to LinkedIn. The extension is now connected."
              : "Your account is active. Start flagging AI content to climb the leaderboard."}
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white text-[14px] font-medium px-8 py-3 hover:bg-black/80 transition-colors"
          >
            View Leaderboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Minimal header */}
      <div className="w-full flex justify-center border-b border-[#e5e5e5]">
        <div className="w-full max-w-[1300px] border-x border-[#e5e5e5] flex items-center px-6 md:px-10 h-16">
          <a href="/" className="flex items-center gap-3">
            <FlywheelLogo className="w-5 h-5" />
            <span
              className="font-semibold text-[15px] tracking-[-0.02em]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Flywheel
            </span>
          </a>
        </div>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-semibold tracking-[-0.03em] mb-2">
              {mode === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-[15px] text-black/50">
              {mode === "login"
                ? "Sign in to track your slop detection stats."
                : "Join the community. Flag AI content. Win prizes."}
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-[#e5e5e5] text-[14px] font-medium hover:bg-[#faf9f6] transition-colors mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#e5e5e5]" />
            <span className="text-[12px] font-medium text-black/30 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#e5e5e5]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e5e5] text-[14px] font-medium placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#e5e5e5] text-[14px] font-medium placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-[#e5e5e5] text-[14px] font-medium placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
            />

            {error && (
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-[14px] font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
            >
              {loading
                ? "..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <p className="text-center text-[13px] text-black/40 mt-6">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(null); }}
                  className="text-black font-medium hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-black font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
