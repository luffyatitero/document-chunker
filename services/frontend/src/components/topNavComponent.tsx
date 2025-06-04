import React from "react";

const TopNav: React.FC = () => (
  <nav className="w-full bg-black flex items-center px-4 fixed top-0 left-0 z-10 justify-center items-center text-center" style={{ height: "40px" }}>
    <span className="text-white font-bold text-lg">DOCUMENT CHUNKER (LangChain)</span>
  </nav>
);

export default TopNav;