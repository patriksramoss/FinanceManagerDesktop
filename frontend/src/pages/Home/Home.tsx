import React from "react";
import EssentialData from "./Content/EssentialData/EssentialData";
import Summary from "./Content/Summary/Summary";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.flexBox}>
        <Summary />
        <EssentialData />
      </div>
    </div>
  );
};

export default Home;
