import React from "react";
import Chart from "./Content/Chart/Chart";
import styles from "./Summary.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.flexBox}>
        <Chart />
      </div>
    </div>
  );
};

export default Home;
