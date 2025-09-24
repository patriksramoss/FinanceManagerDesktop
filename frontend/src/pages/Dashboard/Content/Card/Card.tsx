import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  title: string;
  amount: string;
  subtitle: string;
  change: string;
  trend: "up" | "down";
}

const Card: React.FC<CardProps> = ({
  title,
  amount,
  subtitle,
  change,
  trend,
}) => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.amount}>{amount}</p>
      <div className={styles.details}>
        <span>{subtitle}</span>
        <span className={trend === "up" ? styles.up : styles.down}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default Card;
