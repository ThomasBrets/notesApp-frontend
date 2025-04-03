import React from "react";
import { useEffect } from "react";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Ejecuta la búsqueda al presionar Enter
    }
  };

  
  return (
    <div className="w-80 flex items-center bg-slate-100 px-4 rounded-md">
      <input
        type="text"
        placeholder="Search notes"
        className="text-xs w-full bg-transparent  py-[11px] outline-none"
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        onKeyDown={handleKeyDown} // Corrige el evento de tecla
      />

      {value && (
        <IoMdClose
          className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
