import React, { useState } from 'react';
import { Link } from 'react-router';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2"> <img src="https://i.ibb.co.com/pvd3mGBG/book.png" alt="icon" /> </span>
              <span className="text-2xl font-bold text-green-400">Learn <span className='text-yellow-400'>and</span> Fun</span>
             <span className="rounded-full w-8 h-8 flex items-center justify-center font-bold ml-2"> <img src="https://i.ibb.co.com/99zMNb7x/smile.png" alt="icon" /> </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/learn" className="hover:opacity-80 transition duration-300">Learn</Link>
            <Link to="/playNwin" className="hover:opacity-80 transition duration-300">Play & Win</Link>
            <Link to="/invite" className="hover:opacity-80 transition duration-300">Invite & Earn</Link>
            <Link to="/about" className="hover:opacity-80 transition duration-300">About</Link>
          </div>

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <Link 
              to="/auth/login" 
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            <Link 
              to="/about" 
              className="text-white py-2 border-b border-white/10 hover:bg-white/10 px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-blue-600 py-2 rounded-full text-center font-semibold mt-2 hover:shadow-md transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;