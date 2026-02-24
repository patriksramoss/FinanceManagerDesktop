import React from "react";
import loaderSvg from "src/assets/loader.svg";

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (loading)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <img src={loaderSvg} alt="loading" className="w-12 h-12" />
      </div>
    );
};

export default Loader;
