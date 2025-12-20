import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserRole from "../../hooks/useUserRole";
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiHome, FiBook, FiAward, FiCreditCard, FiBarChart2 } from "react-icons/fi";
import { AuthContext } from "../../Authentication/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user, logOut } = useContext(AuthContext);
  const { role } = useUserRole();
  const navigate = useNavigate();

  // Logout handle
  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //  Search User by Gmail
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      try {
        const res = await fetch(`https://learn-and-earn-server-side.vercel.app/users/search?email=${value}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search Failed:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  //  Click on result → go to member details
  const handleSelectMember = (email) => {
    navigate(`/member-details/${email}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#0b1220] via-[#0b1220] to-transparent text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <img src="https://i.ibb.co.com/pvd3mGBG/book.png" alt="logo" className="w-8 h-8" />
              <span className="text-xl md:text-2xl font-bold text-green-400 mx-2">
                Learn <span className="text-yellow-400">and</span> Earn
              </span>
              <img src="https://i.ibb.co.com/99zMNb7x/smile.png" alt="icon" className="w-6 h-6 md:w-8 md:h-8" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative flex-1 max-w-md mx-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search user by email..."
                className="pl-10 pr-4 py-2 w-full rounded-full bg-white text-black focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            {/* Dropdown for results */}
            {searchResults.length > 0 && (
              <div className="absolute bg-white text-black mt-2 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border border-gray-200">
                {searchResults.map((member) => (
                  <div
                    key={member.email}
                    onClick={() => handleSelectMember(member.email)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={member.photoURL || "https://i.ibb.co.com/CsNxKRrN/default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name || "No Name"}</p>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-yellow-400 transition duration-200 flex items-center">
              <FiHome className="mr-1" />
              Home
            </Link>
            <Link to="/learn" className="hover:text-yellow-400 transition duration-200 flex items-center">
              <FiBook className="mr-1" />
              Learn
            </Link>
            <Link to="/playgames" className="hover:text-yellow-400 transition duration-200 flex items-center">
              <FiAward className="mr-1" />
              Play & Win
            </Link>

            {user && role === "user" && (
              <Link to="/makepayment" className="hover:text-yellow-400 transition duration-200 flex items-center">
                <FiCreditCard className="mr-1" />
                Make Payment
              </Link>
            )}
            {user && role === "admin" && (
              <Link to="/admin-dashboard" className="hover:text-yellow-400 transition duration-200 flex items-center">
                <FiBarChart2 className="mr-1" />
                Dashboard
              </Link>
            )}
            {user && role === "member" && (
              <Link to="/myprofile" className="hover:text-yellow-400 transition duration-200 flex items-center">
                <FiUser className="mr-1" />
                My Profile
              </Link>
            )}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4 ml-1">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || "https://i.ibb.co.com/CsNxKRrN/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-12 rounded-full border-2 border-white"
                  />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-full font-semibold hover:shadow-md transition duration-200"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:shadow-md transition duration-200 ml-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Search Icon */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition duration-200"
            >
              <FiSearch className="text-xl" />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition duration-200"
            >
              {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0b1220] border-t border-gray-700 py-4">
            {/* Mobile Search Bar */}
            <div className="px-4 mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search user by email..."
                  className="pl-10 pr-4 py-2 w-full rounded-full bg-white text-black focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute bg-white text-black mt-2 w-[calc(100%-2rem)] rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border border-gray-200">
                  {searchResults.map((member) => (
                    <div
                      key={member.email}
                      onClick={() => handleSelectMember(member.email)}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={member.photoURL || "https://i.ibb.co.com/CsNxKRrN/default-avatar.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name || "No Name"}</p>
                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2 px-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
              >
                <FiHome />
                Home
              </Link>
              <Link
                to="/learn"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
              >
                <FiBook />
                Learn
              </Link>
              <Link
                to="/playgames"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
              >
                <FiAward />
                Play & Win
              </Link>

              {user && role === "user" && (
                <Link
                  to="/makepayment"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
                >
                  <FiCreditCard />
                  Make Payment
                </Link>
              )}
              {user && role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
                >
                  <FiBarChart2 />
                  Dashboard
                </Link>
              )}
              {user && role === "member" && (
                <Link
                  to="/myprofile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition duration-200"
                >
                  <FiUser />
                  My Profile
                </Link>
              )}

              {/* Mobile User Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || "https://i.ibb.co.com/CsNxKRrN/default-avatar.png"}
                        alt="Avatar"
                        className="w-10 h-12 rounded-full border-2 border-white"
                      />
                      <span className="text-sm">{user.displayName || "User"}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:shadow-md transition duration-200 text-sm"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-3 rounded-full font-semibold hover:shadow-md transition duration-200"
                  >
                    <FiUser />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;