import React from "react";

interface CardProps {
  title: string;
  amount: string | number;
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
    <div className="bg-white border border-gray-300 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold my-2">{amount}</p>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{subtitle}</span>
        <span
          className={
            trend === "up"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export default Card;
