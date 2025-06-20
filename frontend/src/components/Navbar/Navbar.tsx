import React from "react";
import styles from "./Navbar.module.scss";
import { RiLogoutBoxLine } from "react-icons/ri";

interface NavbarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, isAuthenticated }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>FOM</div>
        <div className={styles.logoSubtext}>Finance Only Management</div>
      </div>

      {isAuthenticated && (
        <button className={styles.logoutButton} onClick={onLogout}>
          <RiLogoutBoxLine /> Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
