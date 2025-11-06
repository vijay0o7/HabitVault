import React, { useState } from "react";
import API from "../api";
import { loginWithToken } from "../utils/auth";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "login") {
        const { data } = await API.post("/auth/login", { email, password });
        loginWithToken(data.token);
      } else {
        const { data } = await API.post("/auth/register", { name, email, password });
        loginWithToken(data.token);
      }
      window.location.href = "/";
    } catch (err) {
      alert(err?.response?.data?.msg || err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-[radial-gradient(1200px_600px_at_20%_-10%,#1f2a44_0%,transparent_60%),radial-gradient(900px_500px_at_120%_10%,#243b55_0%,transparent_55%),#0f172a]
        text-slate-200
        px-3 sm:px-4
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
          relative w-full max-w-[1100px]
          rounded-3xl border border-sky-400/60
          bg-slate-900/60 backdrop-blur-sm
          shadow-[0_0_50px_rgba(56,189,248,0.25)]
          overflow-hidden
          lg:h-[min(780px,calc(100vh-140px))]
          lg:min-h-[620px]
          py-10 lg:py-0
        "
      >
        {/* decorative panels — NOW NOT BLOCKING TOUCHES */}
        <div
          className={`
            pointer-events-none absolute right-[-8%] top-[-6%]
            h-[140%] w-[70%]
            bg-gradient-to-br from-sky-400/85 to-blue-600
            origin-bottom-right transition-all duration-[1500ms]
            ${mode === "login" ? "rotate-[10deg] skew-y-[40deg] delay-[1600ms]" : "rotate-0 skew-y-0 delay-[500ms]"}
            hidden lg:block
          `}
        />
        <div
          className={`
            pointer-events-none absolute left-[22%] top-[96%]
            h-[160%] w-[90%]
            bg-slate-900 border-t-2 border-sky-500/70
            origin-bottom-left transition-all duration-[1500ms]
            ${mode === "login" ? "rotate-0 skew-y-0 delay-[500ms]" : "rotate-[-11deg] skew-y-[-41deg] delay-[1200ms]"}
            hidden lg:block
          `}
        />

        {/* MOBILE LAYOUT: stack vertically; DESKTOP: split 50/50 */}
        <div className="relative z-10 grid lg:grid-cols-2">
          {/* LOGIN */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-4 order-1">
            <h2
              className={`
                text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center
                transition-all duration-700
                ${mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[120%]"}
              `}
            >
              Login
            </h2>

            <form onSubmit={submit} className="mt-8 space-y-6 sm:space-y-7">
              <div
                className={`
                  relative transition-all duration-700 delay-100
                  ${mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[120%]"}
                `}
              >
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full bg-transparent border-b-2 border-white/80 outline-none
                    py-3 pr-2 text-base sm:text-lg focus:border-sky-400
                  "
                  placeholder="you@example.com"
                />
              </div>

              <div
                className={`
                  relative transition-all duration-700 delay-200
                  ${mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[120%]"}
                `}
              >
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full bg-transparent border-b-2 border-white/80 outline-none
                    py-3 pr-2 text-base sm:text-lg focus:border-sky-400
                  "
                  placeholder="••••••••"
                />
              </div>

              <button
                disabled={loading}
                className={`
                  w-full rounded-full py-3 sm:py-3.5 text-base sm:text-lg font-semibold
                  border-2 border-sky-400 hover:bg-sky-400/20 transition
                  ${mode === "login" ? "opacity-100 translate-x-0 delay-300" : "opacity-0 -translate-x-[120%]"}
                  disabled:opacity-60
                `}
                type="submit"
              >
                {loading && mode === "login" ? "Please wait..." : "Login"}
              </button>

              <p
                className={`
                  text-center text-sm transition-all duration-700 delay-400
                  ${mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[120%]"}
                `}
              >
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-sky-300 font-semibold underline-offset-2 hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>

          {/* REGISTER */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-4 order-2 lg:order-none">
            <h2
              className={`
                text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center
                transition-all duration-700
                ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}
              `}
            >
              Register
            </h2>

            <form onSubmit={submit} className="mt-8 space-y-6 sm:space-y-7">
              <div
                className={`
                  relative transition-all duration-700 delay-100
                  ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}
                `}
              >
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full bg-transparent border-b-2 border-white/85 outline-none
                    py-3 pr-2 text-base sm:text-lg focus:border-sky-400
                  "
                  placeholder="Your name"
                />
              </div>

              <div
                className={`
                  relative transition-all duration-700 delay-200
                  ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}
                `}
              >
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full bg-transparent border-b-2 border-white/85 outline-none
                    py-3 pr-2 text-base sm:text-lg focus:border-sky-400
                  "
                  placeholder="you@example.com"
                />
              </div>

              <div
                className={`
                  relative transition-all duration-700 delay-300
                  ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}
                `}
              >
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full bg-transparent border-b-2 border-white/85 outline-none
                    py-3 pr-2 text-base sm:text-lg focus:border-sky-400
                  "
                  placeholder="Create a strong password"
                />
              </div>

              <button
                disabled={loading}
                className={`
                  w-full rounded-full py-3 sm:py-3.5 text-base sm:text-lg font-semibold
                  border-2 border-sky-400 hover:bg-sky-400/20 transition
                  ${mode === "signup" ? "opacity-100 translate-x-0 delay-400" : "opacity-0 translate-x-[120%]"}
                  disabled:opacity-60
                `}
                type="submit"
              >
                {loading && mode === "signup" ? "Please wait..." : "Create account"}
              </button>

              <p
                className={`
                  text-center text-sm transition-all duration-700 delay-500
                  ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}
                `}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-sky-300 font-semibold underline-offset-2 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
