import React from "react";

export const ClBoxCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-white p-6 text-base md:text-lg font-normal min-h-[160px] flex justify-center items-center relative z-10">
      {children}
    </div>
  );
};
