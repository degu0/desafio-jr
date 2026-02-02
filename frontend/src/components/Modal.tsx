import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiArrowLeftCircle } from "react-icons/fi";
import { MdDelete, MdPersonAdd } from "react-icons/md";
import { Input } from "./Input";

type ModalType = {
  type: "Edit" | "Remove" | "Register";
  isOpen: boolean;
  onClose: () => void;
  idPet?: string;
};

export const Modal: React.FC<ModalType> = ({
  type,
  isOpen,
  onClose,
  idPet,
}) => {
  const token = localStorage.getItem("@softpet:token");
  const [form, setForm] = useState({
    petName: "",
    ownerName: "",
    race: "",
    phone: "",
    dateOfBirth: "",
    animal: "",
  });
  const isReadOnly = type === "Remove";

  useEffect(() => {
    if (!idPet || type === "Register") return;

    async function fetchPet() {
      try {
        const response = await fetch(`http://localhost:3000/pets/${idPet}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Erro ao buscar o animal`);

        const data = await response.json();
        setForm({
          petName: data.name || "",
          ownerName: data.owner.name || "",
          race: data.race || "",
          phone: data.owner.telefone || "",
          dateOfBirth: data.dateOfBirth || "",
          animal: data.type || "",
        });
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    }

    fetchPet();
  }, [idPet, token, type]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (type) {
      case "Edit":
        return "Editar";
      case "Remove":
        return "Remover";
      case "Register":
        return "Cadastrar";
      default:
        return "";
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case "Edit":
        return <FaRegEdit />;
      case "Remove":
        return <MdDelete />;
      case "Register":
        return <MdPersonAdd />;
      default:
        return <FaRegEdit />;
    }
  };

  const handleSubmit = () => {
    if(type === "Register") {
      handleRegisterPet();
    }else if(type === "Edit") {
      handleUpdatePet();
    }else if(type === "Remove") {
      handleRemovePet();
    }
  };

  const handleRegisterPet = async () => {
    try {
      const responseOwner = await fetch("http://localhost:3000/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.ownerName, telefone: form.phone }),
      });

      const dataOwner = await responseOwner.json();

      const reponsePet = await fetch("http://localhost:3000/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.petName,
          type: form.animal,
          race: form.race,
          dateOfBirth: form.dateOfBirth,
          ownerId: dataOwner.id,
        }),
      });

      const dataPet = await reponsePet.json();

      console.log(dataPet);
    } catch (error) {
      console.error("Erro ao cadastrar o pet:", error);
    }
  };
  const handleUpdatePet = async () => {
    try {
      const responseOwner = await fetch("http://localhost:3000/owner", {
        method: "PACTH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.ownerName, telefone: form.phone }),
      });

      const dataOwner = await responseOwner.json();

      const reponsePet = await fetch(`http://localhost:3000/pets/${idPet}`, {
        method: "PACTH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.petName,
          type: form.animal,
          race: form.race,
          dateOfBirth: form.dateOfBirth,
          ownerId: dataOwner.id,
        }),
      });

      const dataPet = await reponsePet.json();

      console.log(dataPet);
    } catch (error) {
      console.error("Erro ao cadastrar o pet:", error);
    }
  };

  const handleRemovePet = async () => {
    try {
      const reponsePet = await fetch(`http://localhost:3000/pets/${idPet}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const dataPet = await reponsePet.json();

      console.log(dataPet);
    } catch (error) {
      console.error("Erro ao deletar o pet:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-screen sm:w-full relative bg-linear-to-br from-[#0E0014] to-[#001E4D] sm:border-2 sm:border-blue-500/50   rounded-lg 
        shadow-2xl shadow-blue-500/20 max-w-2xl p-10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-linear-to-r from-[#00CAFC] to-[#0056E2] flex items-center rounded-full p-4 text-3xl">
              {getModalIcon()}
            </div>
            <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Fechar modal"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 ">
            <Input
              label={"Nome"}
              placeholder={"Nome Sobrenome"}
              name="petName"
              value={form.petName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, petName: value }))
              }
              disabled={isReadOnly}
            />

            <div>
              <label className="flex items-center gap-2 text-white mb-2">
                <FaRegEdit className="text-blue-400" />
                <span className="font-medium">Animal</span>
              </label>
              <div className="flex gap-4 text-sm">
                <label
                  className="flex-1 flex items-center gap-2 text-gray-600 cursor-pointer border-2 border-gray-700 
              hover:border-white has-checked:border-white has-checked:text-white rounded-lg p-3 transition-all duration-200"
                >
                  <input
                    type="radio"
                    name="animal"
                    value="cachorro"
                    checked={form.animal === "cachorro"}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, animal: e.target.value }))
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                    disabled={isReadOnly}
                  />
                  <span>Cachorro</span>
                </label>

                <label
                  className="flex-1 flex items-center text-gray-600 gap-2 cursor-pointer border-2 border-gray-700 
              hover:border-white has-checked:border-white has-checked:text-white rounded-lg p-3 transition-all duration-200"
                >
                  <input
                    type="radio"
                    name="animal"
                    value="gato"
                    checked={form.animal === "gato"}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, animal: e.target.value }))
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                    disabled={isReadOnly}
                  />
                  <span>Gato</span>
                </label>
              </div>
            </div>

            <Input
              label={"Dono"}
              placeholder={"Nome Sobrenome"}
              name="ownerName"
              value={form.ownerName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, ownerName: value }))
              }
              disabled={isReadOnly}
            />

            <Input
              label={"Raça"}
              placeholder={"Raça"}
              name="race"
              value={form.race}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, race: value }))
              }
              disabled={isReadOnly}
            />

            <Input
              label={"Telefone"}
              placeholder={"(00) 0 0000-0000"}
              name="phone"
              value={form.phone}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, phone: value }))
              }
              disabled={isReadOnly}
            />

            <Input
              label={"Nascimento"}
              type="date"
              placeholder={"00/00/0000"}
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, dateOfBirth: value }))
              }
              disabled={isReadOnly}
            />
          </div>

          {type === "Remove" && (
            <div className="flex justify-center text-white my-2">
              <span>Tem certeza que deseja remover esse pet?</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 p-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full flex-1 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity 
            duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiArrowLeftCircle className="text-xl" />
              Voltar
            </button>

            {type === "Edit" && (
              <button
                type="submit"
                className="w-full flex-1 bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white  font-semibold py-3 
            px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaRegEdit className="text-xl" />
                Salvar
              </button>
            )}

            {type === "Register" && (
              <button
                type="submit"
                className="w-full flex-1 bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
            px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MdPersonAdd className="text-xl" />
                Cadastrar
              </button>
            )}

            {type === "Remove" && (
              <button
                type="submit"
                className="w-full flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 
            transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MdDelete className="text-xl" />
                Deletar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
