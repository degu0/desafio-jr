import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiArrowLeftCircle } from "react-icons/fi";
import { MdDelete, MdPersonAdd } from "react-icons/md";
import { petSchema, type PetFormData } from "../schemas/petSchema";
import {
  formatAnimalTypeFromBackend,
  formatAnimalTypeForBackend,
} from "../utils/translations";
import { Input } from "./Input";

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
  const [canEdit, setCanEdit] = useState(true);
  const storedUser = localStorage.getItem("@softpet:user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("@softpet:token");
  const isReadOnly = type === "Remove" || !canEdit;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      petName: "",
      ownerName: "",
      ownerId: "",
      race: "",
      phone: "",
      dateOfBirth: "",
      animal: "dog",
    },
  });

  useEffect(() => {
    if (!idPet || type === "Register") {
      reset();
      return;
    }

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

        setValue("petName", data.name || "");
        setValue("ownerName", data.owner.name || "");
        setValue("ownerId", data.owner.id || "");
        setValue("race", data.race || "");
        setValue("phone", data.owner.telefone || "");
        setValue("dateOfBirth", data.dateOfBirth?.split("T")[0] || "");
        setValue("animal", formatAnimalTypeFromBackend(data.type));

        const isCreator =
          loggedUser && String(data.createdBy.id) === String(loggedUser.id);

        setCanEdit(Boolean(isCreator));
      } catch (error) {
        console.error("Erro ao buscar pet:", error);
      }
    }

    fetchPet();
  }, [idPet, token, type, reset, setValue]);

  useEffect(() => {
    if (isOpen && type === "Register") {
      reset();
    }
  }, [isOpen, type, reset]);

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
        return "Editar Pet";
      case "Remove":
        return "Remover Pet";
      case "Register":
        return "Cadastrar Pet";
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

  const onSubmit = async (data: PetFormData) => {
    try {
      if (type === "Register") {
        await handleRegisterPet(data);
      } else if (type === "Edit") {
        await handleUpdatePet(data);
      } else if (type === "Remove") {
        await handleRemovePet();
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Erro na operação:", error);
    }
  };

  const handleRegisterPet = async (data: PetFormData) => {
    const responseOwner = await fetch("http://localhost:3000/owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: data.ownerName, telefone: data.phone }),
    });

    if (!responseOwner.ok) throw new Error("Erro ao cadastrar dono");
    const dataOwner = await responseOwner.json();

    const responsePet = await fetch("http://localhost:3000/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.petName,
        type: formatAnimalTypeForBackend(data.animal),
        race: data.race,
        dateOfBirth: data.dateOfBirth,
        ownerId: dataOwner.id,
      }),
    });

    if (!responsePet.ok) throw new Error("Erro ao cadastrar pet");
  };

  const handleUpdatePet = async (data: PetFormData) => {
    try {
      const responseOwner = await fetch(
        `http://localhost:3000/owner/${data.ownerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: data.ownerName, telefone: data.phone }),
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
          name: data.petName,
          type: formatAnimalTypeForBackend(data.animal),
          race: data.race,
          dateOfBirth: data.dateOfBirth,
        }),
      });

      if (!responsePet.ok) throw new Error("Erro ao atualizar pet");
    } catch (error: any) {
      if (error.message?.includes("401")) {
        alert("Você não tem permissão para editar ou remover este animal.");
        return;
      }
    }
  };

  const handleRemovePet = async () => {
    const responsePet = await fetch(`http://localhost:3000/pets/${idPet}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!responsePet.ok) throw new Error("Erro ao deletar pet");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-screen sm:w-full relative bg-linear-to-br from-[#0E0014] to-[#001E4D] sm:border-2 sm:border-blue-500/50 rounded-lg 
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
            disabled={isSubmitting}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>
        {!canEdit && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-sm mx-5 mb-2">
            ⚠️ Este animal foi cadastrado por outro usuário. Você pode
            visualizar os dados, mas não pode editar ou remover.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5 space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
            <Controller
              name="petName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Nome"
                  placeholder="Nome do animal"
                  name="petName"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isReadOnly || isSubmitting}
                  required
                  error={errors.petName?.message}
                />
              )}
            />

            <div>
              <label className="flex items-center gap-2 text-white mb-2">
                <FaRegEdit className="text-blue-400" />
                <span className="font-medium">Animal</span>
              </label>
              <Controller
                name="animal"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="flex gap-4 text-sm">
                      <label
                        className={`flex-1 flex items-center gap-2 cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
                          field.value === "dog"
                            ? "border-white text-white "
                            : "border-gray-700 text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          value="dog"
                          checked={field.value === "dog"}
                          onChange={() => field.onChange("dog")}
                          disabled={isReadOnly || isSubmitting}
                          className="w-4 h-4 accent-blue-400 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span>Cachorro</span>
                      </label>

                      <label
                        className={`flex-1 flex items-center gap-2 cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
                          field.value === "cat"
                            ? "border-white text-white"
                            : "border-gray-700 text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          value="cat"
                          checked={field.value === "cat"}
                          onChange={() => field.onChange("cat")}
                          disabled={isReadOnly || isSubmitting}
                          className="w-4 h-4 accent-blue-400 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span>Gato</span>
                      </label>
                    </div>
                    {errors.animal && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.animal.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <Controller
              name="ownerName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Dono"
                  placeholder="Nome do dono"
                  name="ownerName"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isReadOnly || isSubmitting}
                  required
                  error={errors.ownerName?.message}
                />
              )}
            />
            <Controller
              name="race"
              control={control}
              render={({ field }) => (
                <Input
                  label="Raça"
                  placeholder="Raça do Pet"
                  name="race"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isReadOnly || isSubmitting}
                  required
                  error={errors.race?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  name="phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isReadOnly || isSubmitting}
                  required
                  error={errors.phone?.message}
                  mask="phone"
                />
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Input
                  label="Data do nascimento"
                  name="dateOfBirth"
                  type="date"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isReadOnly || isSubmitting}
                  required
                  error={errors.dateOfBirth?.message}
                />
              )}
            />
          </div>

          {type === "Remove" && (
            <div className="flex justify-center text-white my-4">
              <span className="text-lg">
                Tem certeza que deseja remover este pet?
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 p-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full flex-1 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity 
                duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowLeftCircle className="text-xl" />
              Voltar
            </button>

            {type === "Edit" && (
              <button
                type="submit"
                disabled={isSubmitting || !canEdit}
                className="w-full flex-1 bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
                  px-4 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaRegEdit className="text-xl" />
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            )}

            {type === "Register" && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex-1 bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
                  px-4 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdPersonAdd className="text-xl" />
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </button>
            )}

            {type === "Remove" && (
              <button
                type="submit"
                disabled={isSubmitting || !canEdit}
                className="w-full flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 
                  transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdDelete className="text-xl" />
                {isSubmitting ? "Deletando..." : "Deletar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
