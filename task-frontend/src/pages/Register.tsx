import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        alert("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      setLoading(true);

      await api.post("/auth/register", {
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0B1120] to-[#000814] px-4">

      {/* Glowing Card */}
      <div className="w-full max-w-md bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,255,255,0.15)]">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cyan-400">
            SecureTask
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Secure Task Management
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Login Link */}
        <Link
          to="/login"
          className="block w-full text-center border border-gray-600 text-gray-300 py-3 rounded-lg hover:border-cyan-400 hover:text-cyan-400 transition duration-300"
        >
          Already have an account? Login
        </Link>

      </div>
    </div>
  );
};

export default Register;