import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (loading)
    return (
      <nav className={styles.loaderWrapper}>
        <div className={styles.loader} />
      </nav>
    );
};

export default Loader;
