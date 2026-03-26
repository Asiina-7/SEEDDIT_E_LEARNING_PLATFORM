import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user on mount and location changes
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '#/login'; // Redirect to login after logout
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-500 transition-colors">
                <i className="fas fa-seedling text-xl"></i>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Seedit
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user?.role !== 'mentor' && (
              <Link to="/" className={`${isActive('/') ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600' : 'text-slate-600'} hover:text-emerald-600 transition-all hover:translate-y-[-1px] py-1`}>Home</Link>
            )}
            <Link to="/catalog" className={`${isActive('/catalog') ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600' : 'text-slate-600'} hover:text-emerald-600 transition-all hover:translate-y-[-1px] py-1`}>Courses</Link>
            {user && user.role !== 'mentor' && (
              <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600' : 'text-slate-600'} hover:text-emerald-600 transition-all hover:translate-y-[-1px] py-1`}>Dashboard</Link>
            )}
            {user?.role === 'mentor' && (
              <Link to="/mentor/dashboard" className={`${isActive('/mentor/dashboard') ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'text-slate-600'} hover:text-indigo-600 transition-all hover:translate-y-[-1px] py-1`}>Mentor Dashboard</Link>
            )}
            <Link to="/contact" className={`${isActive('/contact') ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600' : 'text-slate-600'} hover:text-emerald-600 transition-all hover:translate-y-[-1px] py-1`}>Contact Us</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 group-hover:scale-110 transition-transform">
                    <i className="fas fa-user-circle text-lg"></i>
                  </div>
                  <span className="hidden sm:inline font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50 transition-all active:scale-95"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
            )}
            <button className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
