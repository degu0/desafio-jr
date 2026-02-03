import coleira from "../../public/coleira.png";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaDna } from "react-icons/fa";
import { BsTelephoneInbound } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaUser, FaLock } from "react-icons/fa";

type InputType = {
  label: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  mask?: "phone";
};

export const Input: React.FC<InputType> = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  mask,
}) => {
  const getInputIcon = () => {
    const iconClass = "text-lg text-blue-400";

    switch (label) {
      case "Nome":
        return <img src={coleira} alt="Coleira icon" className="w-4" />;
      case "Dono":
        return <IoPersonCircleOutline className={iconClass} />;
      case "Telefone":
        return <BsTelephoneInbound className={iconClass} />;
      case "Animal":
        return <FaDna className={iconClass} />;
      case "Raça":
        return <FaDna className={iconClass} />;
      case "Nascimento":
        return <FaCalendarDay className={iconClass} />;
      case "Email":
        return <MdEmail className={iconClass} />;
      case "Usuário":
        return <FaUser className={iconClass} />;
      case "Senha":
        return <FaLock className={iconClass} />;
      case "Confirme a senha":
        return <FaLock className={iconClass} />;
      default:
        return null;
    }
  };

  const applyMask = (inputValue: string): string => {
    if (!mask) return inputValue;

    switch (mask) {
      case "phone":
        return inputValue
          .replace(/\D/g, "")
          .replace(/^(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2")
          .slice(0, 15);
      default:
        return inputValue;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyMask(rawValue);
    onChange?.(maskedValue);
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-white mb-2">
        {getInputIcon()}
        <span className="font-medium">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`w-full bg-slate-900/50 border-2 ${
          error ? "border-red-500" : "border-gray-700"
        } focus:border-blue-500 focus:outline-none 
          text-white rounded-lg px-4 py-2 transition-colors placeholder:text-gray-500
          disabled:opacity-50 disabled:cursor-not-allowed`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};