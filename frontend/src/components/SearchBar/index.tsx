import React from "react";
import { IoSearch } from "react-icons/io5";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Pesquisar...",
  onSearch,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
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
          onChange={handleChange}
          className="w-full bg-slate-900/80 border-2 border-gray-700/50 
            focus:border-blue-500 focus:outline-none 
            text-white rounded-lg pl-12 pr-28 py-3 
            transition-all duration-200
            placeholder:text-gray-500"
        />

        {/* Botão Pesquisar à direita */}
        <button
          className="absolute right-2 bg-slate-700 hover:bg-slate-600 
            text-white font-medium px-5 py-2 rounded-md 
            transition-colors duration-200"
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
};