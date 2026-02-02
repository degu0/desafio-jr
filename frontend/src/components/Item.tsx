import type React from "react";
import { useState } from "react";

import cat from "../../public/cat_icon.png";
import dog from "../../public/dog_icon.png";
import coleira from "../../public/coleira.png";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaDna, FaRegEdit  } from "react-icons/fa";
import { BsTelephoneInbound } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa6";

type ItemProps = {
  typeAnimal: "cat" | "dog";
  petName: string;
  ownerName: string;
  petRace: string;
  ownerTelefone: string;
  petDateOfBirth: Date;
  onEdit: () => void;
  onRemove: () => void;
};

export const Item: React.FC<ItemProps> = ({
  typeAnimal,
  petName,
  ownerName,
  petRace,
  ownerTelefone,
  petDateOfBirth,
  onEdit,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      years--;
    }

    return years;
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-linear-155 from-[#001E4D] from-15% to-[#0E0014] to-85% flex flex-row items-center gap-4 max-w-sm rounded-xl text-white
          p-4 cursor-pointer transition-all duration-100 
          hover:border-5 hover:border-[#0056E2]
          hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bg-gradient-to-r from-[#00CAFC] to-[#0056E2] flex items-center rounded-full px-2.5 py-3">
          <img
            src={typeAnimal === "cat" ? cat : dog}
            alt="Pet icon"
            className="w-9 h-8"
          />
        </div>
        <div className="flex-1">
          <ul className="flex flex-col gap-1">
            <li className="flex gap-2 text-base items-center font-medium">
              <img src={coleira} alt="Coleira icon" className="w-4" />
              {petName}
            </li>
            <li className="flex gap-2 text-sm items-center text-gray-300">
              <IoPersonCircleOutline className="text-lg" />
              {ownerName}
            </li>
          </ul>
        </div>
        <div
          className={`text-2xl transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        >
          <IoIosArrowDown />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="bg-linear-155 from-[#001E4D] from-15% to-[#0E0014] border-5 border-[#0056E2]
          shadow-lg shadow-[#00CAFC] rounded-xl p-5 max-w-sm"
        >
          <div className="space-y-3 text-white">
            <div className="flex gap-3 items-center">
              <FaDna />
              <div className="flex gap-1 items-center">
                <p className="text-sm text-gray-400">Raça:</p>
                <p className="font-medium">{petRace}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <BsTelephoneInbound />
              <div className="flex gap-1 items-center">
                <p className="text-sm text-gray-400">Telefone:</p>
                <p className="font-medium">{formatPhone(ownerTelefone)}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <FaCalendarDay />
              <div className="flex gap-1 items-center">
                <p className="text-sm text-gray-400">Idade:</p>
                <p className="font-medium">
                  {calculateAge(petDateOfBirth)} Anos (
                  {formatDate(petDateOfBirth)})
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg 
                hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaRegEdit className="text-xl" />
              Editar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              className="bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 px-4 rounded-lg 
               transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MdDelete className="text-xl" />
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
