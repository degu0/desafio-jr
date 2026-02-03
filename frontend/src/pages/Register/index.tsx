import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-tr from-[#0E0014] to-[#001E4D] p-6">
      <div
        className="flex flex-col gap-6 bg-linear-to-br from-[#0E0014] to-[#001E4D] border-2 border-blue-500/50 rounded-xl 
        shadow-2xl shadow-blue-500/20 w-full max-w-md p-8 animate-scaleIn"
      >
        <div className="text-center mb-4">
          <h1 className="text-white text-4xl font-bold mb-2">SoftPet</h1>
          <p className="text-gray-400 text-sm">
            Faça o cadastro para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaUser className="text-blue-400 text-lg" />
              <span className="font-medium">Nome</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Digite seu nome"
              disabled={isSubmitting}
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <MdEmail className="text-blue-400 text-lg" />
              <span className="font-medium">Email</span>
            </label>
            <input
              type="email"
              {...register("email")} 
              placeholder="Digite seu email"
              disabled={isSubmitting}
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaLock className="text-blue-400 text-lg" />
              <span className="font-medium">Senha</span>
            </label>
            <input
              type="password"
              {...register("password")} 
              placeholder="Digite sua senha (mín. 6 caracteres)"
              disabled={isSubmitting}
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaLock className="text-blue-400 text-lg" />
              <span className="font-medium">Confirme a senha</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirme sua senha"
              disabled={isSubmitting}
              className={`w-full bg-slate-900/50 border-2 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
              rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className="text-center text-gray-400 text-sm mt-2">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Faça login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
