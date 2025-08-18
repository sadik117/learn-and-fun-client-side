import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Authentication/AuthProvider";
import useUserRole from "../../hooks/useUserRole";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const {role} = useUserRole()

  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
                <img src="https://i.ibb.co.com/pvd3mGBG/book.png" alt="icon" />
              </span>
              <span className="text-2xl font-bold text-green-400">
                Learn <span className="text-yellow-400">and</span> Earn
              </span>
              <span className="rounded-full w-8 h-8 flex items-center justify-center font-bold ml-2">
                <img src="https://i.ibb.co.com/99zMNb7x/smile.png" alt="icon" />
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:opacity-80 transition">
              Home
            </Link>
            <Link to="/learn" className="hover:opacity-80 transition">
              Learn
            </Link>
            <Link to="/playNwin" className="hover:opacity-80 transition">
              Play & Win
            </Link>
            <Link to="/invite" className="hover:opacity-80 transition">
              Invite & Earn
            </Link>
            {user && role === "admin" && (
              <Link to="/admin-dashboard" className="hover:opacity-80 transition">
                Dashboard
              </Link>
            )}

            {user && role == "user" && (
              <Link to="/myprofile" className="hover:opacity-80 transition">
                My Profile
              </Link>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3 mr-0 md:mr-8">
            {user ? (
              <>
                {/* Avatar */}
                <img
                  src={
                    user.photoURL ||
                    `https://i.ibb.co.com/CsNxKRrN/default-avatar.png`
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  title={user.displayName || "User"}
                />
                {/* Logout Button */}
                <Link
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:shadow-lg transition"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {/* Hamburger / Close Icon */}
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-700 to-purple-700 px-4 pb-4">
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/learn"
              className="text-white py-2 border-b border-white/10 hover:bg-white/10 px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              to="/playNwin"
              className="text-white py-2 border-b border-white/10 hover:bg-white/10 px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Play & Win
            </Link>
            <Link
              to="/invite"
              className="text-white py-2 border-b border-white/10 hover:bg-white/10 px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Invite & Earn
            </Link>
            {user && role === "admin" && (
              <Link to="/admin-dashboard" className="hover:opacity-80 transition">
                Dashboard
              </Link>
            )}

            {user && role == "user" && (
              <Link to="/myprofile" className="hover:opacity-80 transition">
                My Profile
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 py-2 rounded-full text-center font-semibold mt-2 hover:shadow-md transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="bg-white text-blue-600 py-2 rounded-full text-center font-semibold mt-2 hover:shadow-md transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
