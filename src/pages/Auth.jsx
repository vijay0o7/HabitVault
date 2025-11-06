import React, { useEffect, useState } from "react";
import API from "../api";
import { loginWithToken } from "../utils/auth";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/health").catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      let data;
      if (mode === "login") {
        ({ data } = await API.post("/auth/login", { email, password }));
      } else {
        ({ data } = await API.post("/auth/register", { name, email, password }));
      }
      loginWithToken(data.token);
      window.location.href = "/";
    } catch (err) {
      alert(err?.response?.data?.msg || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-200 px-4 py-6 overflow-hidden">
      <div className="relative w-full max-w-[940px] h-[600px] rounded-3xl bg-slate-900/50 border border-sky-400/50 backdrop-blur-md shadow-[0_0_45px_#38bdf833] overflow-hidden">

        {/* === ANIMATED PANEL === */}
        <div
          className={`
            absolute right-0 top-0 h-full w-[60%] bg-gradient-to-br from-sky-400/90 to-blue-600 
            origin-bottom-right transition-all duration-[1400ms] ease-in-out pointer-events-none
            ${mode === "login"
              ? "rotate-[12deg] skew-y-[36deg] translate-x-[12%]"
              : "rotate-0 skew-y-0 translate-x-0"}
          `}
        />

        {/* === Login Panel === */}
        <div className={`absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-10 transition-all duration-700
          ${mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[120%]"}`}>
          <h2 className="text-4xl font-extrabold text-center">Login</h2>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/80 py-3 outline-none text-lg focus:border-sky-400"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/80 py-3 outline-none text-lg focus:border-sky-400"
            />

            <button
              className="w-full rounded-full py-3 border-2 border-sky-400 hover:bg-sky-400/20 transition font-semibold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <button type="button" className="text-sky-300 font-semibold hover:underline"
                onClick={() => setMode("signup")}>
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* === Signup Panel === */}
        <div className={`absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center px-10 transition-all duration-700
          ${mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[120%]"}`}>
          <h2 className="text-4xl font-extrabold text-center">Register</h2>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={e=>setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/80 py-3 outline-none text-lg focus:border-sky-400"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/80 py-3 outline-none text-lg focus:border-sky-400"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/80 py-3 outline-none text-lg focus:border-sky-400"
            />

            <button
              className="w-full rounded-full py-3 border-2 border-sky-400 hover:bg-sky-400/20 transition font-semibold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <button type="button" className="text-sky-300 font-semibold hover:underline"
                onClick={() => setMode("login")}>
                Sign In
              </button>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
