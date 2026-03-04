import React from "react";
import loaderSvg from "src/assets/loader.svg";

interface LoaderProps {
  loading: boolean;
  size?: number;
  posX?: "start" | "center" | "end";
  posY?: "start" | "center" | "end";
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  size =8,
  posX = "center",
  posY = "center",
}) => {
  if (loading)
    return (
      <div className={`flex w-full h-full justify-${posX} items-${posY}`}>
        <img src={loaderSvg} alt="loading" className={`w-${size} h-${size}`} />
      </div>
    );
};

export default Loader;
