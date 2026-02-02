import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiArrowLeftCircle } from "react-icons/fi";
import { MdDelete, MdPersonAdd } from "react-icons/md";
import { Input } from "./Input";
import { formatDateForBackend, formatDateForInput } from "../utils/dateHelpers";
import {
  animalTypeMap,
  formatAnimalTypeForBackend,
  formatAnimalTypeFromBackend,
} from "../utils/translations";
import { maskPhone } from "../utils/masks";

type ModalType = {
  type: "Edit" | "Remove" | "Register";
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  idPet?: string;
};

export const Modal: React.FC<ModalType> = ({
  type,
  isOpen,
  onClose,
  onSuccess,
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
    ownerId: "",
  });
  const [error, setError] = useState("");
  const isReadOnly = type === "Remove";

  useEffect(() => {
    if (isOpen && type === "Register") {
      setForm({
        petName: "",
        ownerName: "",
        race: "",
        phone: "",
        dateOfBirth: "",
        animal: "",
        ownerId: "",
      });
      setError("");
    }
  }, [isOpen, type]);

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
          dateOfBirth: formatDateForInput(data.dateOfBirth) || "",
          animal: formatAnimalTypeFromBackend(data.type) || "",
          ownerId: data.owner.id || "",
        });
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        setError("Erro ao carregar dados do pet");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (type === "Register") {
        await handleRegisterPet();
      } else if (type === "Edit") {
        await handleUpdatePet();
      } else if (type === "Remove") {
        await handleRemovePet();
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Erro na operação:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
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

      if (!responseOwner.ok) {
        throw new Error("Erro ao cadastrar dono");
      }

      const dataOwner = await responseOwner.json();

      const responsePet = await fetch("http://localhost:3000/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.petName,
          type: formatAnimalTypeForBackend(form.animal),
          race: form.race,
          dateOfBirth: formatDateForBackend(form.dateOfBirth),
          ownerId: dataOwner.id,
        }),
      });

      if (!responsePet.ok) {
        throw new Error("Erro ao cadastrar pet");
      }
    } catch (error) {
      throw error;
    }
  };
  const handleUpdatePet = async () => {
    try {
      const responseOwner = await fetch(
        `http://localhost:3000/owner/${form.ownerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: form.ownerName, telefone: form.phone }),
        },
      );

      if (!responseOwner.ok) {
        throw new Error("Erro ao atualizar dono");
      }

      const responsePet = await fetch(`http://localhost:3000/pets/${idPet}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.petName,
          type: formatAnimalTypeForBackend(form.animal),
          race: form.race,
          dateOfBirth: form.dateOfBirth,
        }),
      });

      if (!responsePet.ok) {
        throw new Error("Erro ao atualizar pet");
      }
    } catch (error) {
      console.error("Erro ao atualizar o pet:", error);
    }
  };

  const handleRemovePet = async () => {
    try {
      const responsePet = await fetch(`http://localhost:3000/pets/${idPet}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!responsePet.ok) {
        throw new Error("Erro ao deletar pet");
      }
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
                    value="dog"
                    checked={form.animal === "dog"}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, animal: e.target.value }))
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                    disabled={isReadOnly}
                    required
                  />
                  <span>{animalTypeMap.dog.label}</span>
                </label>

                <label
                  className="flex-1 flex items-center text-gray-600 gap-2 cursor-pointer border-2 border-gray-700 
              hover:border-white has-checked:border-white has-checked:text-white rounded-lg p-3 transition-all duration-200"
                >
                  <input
                    type="radio"
                    name="animal"
                    value="cat"
                    checked={form.animal === "cat"}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, animal: e.target.value }))
                    }
                    className="w-4 h-4 accent-white cursor-pointer"
                    disabled={isReadOnly}
                    required
                  />
                  <span>{animalTypeMap.cat.label}</span>
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
                setForm((prev) => ({ ...prev, phone: maskPhone(value) }))
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

          {error && (
            <div className="mx-5 mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
