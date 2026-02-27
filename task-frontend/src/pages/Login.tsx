import { useState } from "react";
import type { AxiosError } from "axios";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setErrorMessage("");

      if (!email || !password) {
        setErrorMessage("Please enter email and password");
        return;
      }

      setLoading(true);
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      // i have changes the location to tasks
      navigate("/tasks");
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      setErrorMessage(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#0f172a,_#020617)] font-[Inter,sans-serif] px-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-cyan-400/10 bg-slate-900/85 p-[40px] shadow-[0_0_40px_rgba(0,255,255,0.1)] backdrop-blur-[15px] sm:p-[40px] max-[480px]:p-[25px]">
        <div>
          <h1 className="mb-[5px] text-[26px] font-bold text-sky-400">SecureTask</h1>
          <p className="mb-[30px] text-[13px] text-slate-400">Secure Task Management</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="mb-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-[14px] text-sm text-slate-200 transition duration-300 ease-in-out focus:border-sky-400 focus:outline-none focus:shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-[14px] text-sm text-slate-200 transition duration-300 ease-in-out focus:border-sky-400 focus:outline-none focus:shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />
        </div>

        <button
          disabled={loading}
          className="w-full cursor-pointer rounded-lg border-none bg-gradient-to-r from-cyan-500 to-blue-500 p-[14px] font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={handleLogin}
        >
          <span className="inline-flex items-center gap-2">
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Signing in..." : "Login"}
          </span>
        </button>

        <div className="my-5 h-px bg-slate-800"></div>

        <Link
          to="/register"
          className="mt-[15px] block rounded-lg border border-slate-700 bg-transparent p-3 text-center text-slate-400 no-underline transition duration-300 ease-in-out hover:border-sky-400 hover:text-sky-400"
        >
          New User? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
