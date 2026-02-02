import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmationPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres!");
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/");
    } catch (error) {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#0E0014] to-[#001E4D] p-6">
      <div
        className="flex flex-col gap-6 bg-gradient-to-br from-[#0E0014] to-[#001E4D] border-2 border-blue-500/50 rounded-xl 
        shadow-2xl shadow-blue-500/20 w-full max-w-md p-8 animate-scaleIn"
      >
        <div className="text-center mb-4">
          <h1 className="text-white text-4xl font-bold mb-2">SoftPet</h1>
          <p className="text-gray-400 text-sm">
            Faça o cadastro para continuar
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaUser className="text-blue-400 text-lg" />
              <span className="font-medium">Nome do usuário</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaUser className="text-blue-400 text-lg" />
              <span className="font-medium">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaLock className="text-blue-400 text-lg" />
              <span className="font-medium">Senha</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha (mín. 6 caracteres)"
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaLock className="text-blue-400 text-lg" />
              <span className="font-medium">Confirme a senha</span>
            </label>
            <input
              type="password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className={`w-full bg-slate-900/50 border-2 ${
                error ? "border-red-500" : "border-gray-700"
              } focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500`}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
              rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2 cursor-pointer"
          >
            Cadastrar
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
