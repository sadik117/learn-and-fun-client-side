import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiHome,
  FiBell,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import Members from "./Members";
import Pendings from "./PendingUsers";
import Payments from "./Payments";
import MemberProfile from "./MemberProfile";

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { to: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/admin-dashboard/members", label: "All Members", icon: <FiUsers /> },
    { to: "/admin-dashboard/pending", label: "Pending Users", icon: <FiUserPlus /> },
    { to: "/admin-dashboard/payments", label: "Payments", icon: <FiDollarSign /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md z-20 transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 border-b flex justify-between items-center md:block">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center p-3 rounded-lg transition 
                    ${
                      location.pathname === link.to
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={22} />
            </button>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiBell />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <FiUser className="text-blue-600" />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2 className="text-xl font-bold mb-4">Overview</h2>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p>Hello Admin Welcome To Your Universe!!</p>
                  </div>
                </div>
              }
            />
            <Route path="/members" element={<Members></Members>} />
            <Route path="/pending" element={<Pendings></Pendings>} />
            <Route path="/payments" element={<Payments></Payments>} />
            <Route path="/members/:email" element={<MemberProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
