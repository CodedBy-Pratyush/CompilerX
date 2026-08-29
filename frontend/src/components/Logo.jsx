import React from "react";
import { FiCode } from "react-icons/fi";


const Logo = ({ size = "text-2xl" }) => {
  return (
    <div className={`flex items-center gap-2 font-bold ${size}`}>
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand text-white">
        <FiCode />
      </span>
      <span className="text-white">CompileX</span>
    </div>
  );
};

export default Logo;
