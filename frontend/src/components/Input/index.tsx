import coleira from "../../../public/coleira.png";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaDna } from "react-icons/fa";
import { BsTelephoneInbound } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa6";
import React from "react";

type InputProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  disabled,
}) => {
  const getInputIcon = () => {
    switch (name) {
      case "nome":
        return <img src={coleira} alt="Coleira icon" className="w-4" />;
      case "dono":
        return <IoPersonCircleOutline className="text-lg" />;
      case "telefone":
        return <BsTelephoneInbound className="text-lg" />;
      case "animal":
      case "raca":
        return <FaDna className="text-lg" />;
      case "nascimento":
        return <FaCalendarDay className="text-lg" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-center gap-2 text-white">
        <span className="text-blue-400">{getInputIcon()}</span>
        <span className="font-medium">{label}</span>
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/50 border-2 border-gray-700
          focus:border-blue-500 focus:outline-none
          text-white rounded-lg px-4 py-2 transition-colors
          placeholder:text-gray-500
          disabled:bg-[#404A5C] disabled:border-[#404A5C]
          "
        disabled={disabled}
      />
    </div>
  );
};
