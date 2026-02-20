import React from "react";
import styles from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import logoImg from "src/assets/images/logo.png";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logoWrapper}>
        <img
          src={logoImg}
          alt="Logo"
          className={styles.logo}
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        />
      </div>
      <>
        <nav className={styles.navbar}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive || window.location.pathname === "/" ? styles.active : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            Reports
          </NavLink>
        </nav>
        <div className={styles.logoutButtonWrapper}>
          <button
            className={styles.logoutButton}
            onClick={onLogout}
            title="Logout"
          >
            <RiLogoutBoxLine />
          </button>
        </div>
      </>
    </div>
  );
};

export default Navbar;
