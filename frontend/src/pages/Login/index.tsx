import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { username, password });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#0E0014] to-[#001E4D] p-6">
      <div
        className="flex flex-col gap-6 bg-gradient-to-br from-[#0E0014] to-[#001E4D] border-2 border-blue-500/50 rounded-xl 
        shadow-2xl shadow-blue-500/20 w-full max-w-md p-8 animate-scaleIn"
      >
        <div className="text-center mb-4">
          <h1 className="text-white text-4xl font-bold mb-2">SoftPet</h1>
          <p className="text-gray-400 text-sm">Faça login para continuar</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-2 text-white mb-2">
              <FaUser className="text-blue-400 text-lg" />
              <span className="font-medium">Usuário</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
              required
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
              placeholder="Digite sua senha"
              className="w-full bg-slate-900/50 border-2 border-gray-700 focus:border-blue-500 focus:outline-none 
                text-white rounded-lg px-4 py-3 transition-colors placeholder:text-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
              rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2 cursor-pointer"
          >
            Entrar
          </button>

          <div className="text-center text-gray-400 text-sm mt-2">
            Não tem uma conta?{" "}
            <a href="/Cadastro" className="text-blue-400 hover:text-blue-300 transition-colors">
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}