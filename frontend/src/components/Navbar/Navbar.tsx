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
        <img src={logoImg} alt="Logo" className={styles.logo} />
      </div>
      <>
        <nav className={styles.navbar}>
          <NavLink
            to="/summary"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            Summary
          </NavLink>
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            Accounts
          </NavLink>
          <NavLink
            to="/identity"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            Identity
          </NavLink>
        </nav>
        <div className={styles.logoutButtonWrapper}>
          <button className={styles.logoutButton} onClick={onLogout}>
            <RiLogoutBoxLine /> Logout
          </button>
        </div>
      </>
    </div>
  );
};

export default Navbar;
