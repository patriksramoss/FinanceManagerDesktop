import React from "react";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import logoImg from "src/assets/images/logo.png";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex justify-between items-center border-b border-gray-300 backdrop-blur-lg bg-white/60 z-10">
      <div className="top-0 flex items-center justify-between z-10 rounded-xl overflow-visible m-4">
        <img
          src={logoImg}
          alt="Logo"
          className="h-10 w-10 rounded-md shadow-md cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
          onClick={() => (window.location.href = "/dashboard")}
        />
      </div>

      <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 flex justify-start items-center gap-0 w-[90px] min-w-[50%] max-w-[80%] h-full rounded-xl p-0 z-10 gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex justify-center items-center flex-1 h-7 text-xs font-medium rounded-md cursor-pointer transition-all duration-200 ${
              isActive || window.location.pathname === "/"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-900 hover:bg-red-500 hover:text-white hover:scale-105"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex justify-center items-center flex-1 h-7 text-xs font-medium rounded-md cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-900 hover:bg-red-500 hover:text-white hover:scale-105"
            }`
          }
        >
          Reports
        </NavLink>
      </nav>

      <div className="fixed right-5 z-10 flex justify-end items-center rounded-xl h-full">
        <button
          className="flex items-center bg-red-500 text-white border border-gray-200 px-4 py-2 m-2 rounded-md text-xs cursor-pointer transition-all duration-200 ease-in-out hover:border-orange-500"
          onClick={onLogout}
          title="Logout"
        >
          <RiLogoutBoxLine className="mr-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
