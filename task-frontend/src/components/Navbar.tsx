import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="bg-[#0F172A] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
            S
          </div>

          <div>
            <Link
              to="/"
              className="text-white text-xl font-semibold"
            >
              SecureTask
            </Link>
            <p className="text-gray-400 text-xs">
              Secure Task Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden lg:block text-xs text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              {userEmail}
            </span>
          )}

          <span className="hidden md:flex items-center gap-2 text-green-400 text-sm bg-green-900/30 px-3 py-1 rounded-full">
            • ENCRYPTED
          </span>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
