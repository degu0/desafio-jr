import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Pesquisar...",
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <IoSearch className="text-xl" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full bg-slate-900/80 border-2 border-gray-700/50 
            focus:border-blue-500 focus:outline-none 
            text-white rounded-lg pl-12 pr-28 py-3 
            transition-all duration-200
            placeholder:text-gray-500"
        />

        <button
          className="absolute right-2 bg-slate-700 hover:bg-slate-600 
            text-white font-medium px-5 py-2 rounded-md 
            transition-colors duration-200 cursor-pointer"
          onClick={handleSearch}
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
};
