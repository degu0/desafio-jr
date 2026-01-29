import coleira from "../../../public/coleira.png";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaDna } from "react-icons/fa";
import { BsTelephoneInbound } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa6";

type InputType = {
  label: string;
  type?: string;
  placeholder: string;
};

export const Input: React.FC<InputType> = ({
  label,
  type = "text",
  placeholder,
}) => {
  const getInputIcon = () => {
    switch (label) {
      case "Nome":
        return <img src={coleira} alt="Coleira icon" className="w-4" />;
      case "Dono":
        return <IoPersonCircleOutline className="text-lg" />;
      case "Telefone":
        return <BsTelephoneInbound className="text-lg" />;
      case "Animal":
        return <FaDna className="text-lg" />;
      case "Raça":
        return <FaDna className="text-lg" />;
      case "Nascimento":
        return <FaCalendarDay className="text-lg" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-white mb-2">
        <span className="text-blue-400">{getInputIcon()}</span>
        <span className="font-medium">{label}</span>
      </label>
      <input
        type={type}
        className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
          text-white rounded-lg px-4 py-2 transition-colors placeholder:text-gray-500"
        placeholder={placeholder}
      />
    </div>
  );
};
