import { useState } from "react";
import { Item } from "../../components/Item";
import { Modal } from "../../components/Modal";
import { MdLogout } from "react-icons/md";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { SearchBar } from "../../components/SearchBar";

export function Home() {
  const [modalEditConfig, setModalEditConfig] = useState({
    isOpen: false,
    type: "Edit" as "Edit" | "Remove" | "Register",
  });

  const [modalRemoveConfig, setModalRemoveConfig] = useState({
    isOpen: false,
    type: "Remove" as "Edit" | "Remove" | "Register",
  });

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-gradient-to-tr from-[#0E0014] to-[#001E4D] p-12">
      <div className="flex items-center justify-between text-white text-3xl">
        <h1>SoftPet</h1>
        <button>
          <MdLogout />
        </button>
      </div>
      <div className="flex items-center justify-between gap-5">
        <div className="w-[90%]">
          <SearchBar placeholder="Pesquisar pets..." />
        </div>
        <div className="w-[13%]">
          <button
            className="w-full flex-1 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
            rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <HiOutlinePlusCircle />
            Cadastrar
          </button>
        </div>
      </div>

      <Item
        typeAnimal="cat"
        petName="Simba Farias"
        ownerName="Emmanuel Farias"
        petRace="Persa"
        ownerTelefone="81982402134"
        petDateOfBirth={new Date("2022-08-22")}
        onEdit={() => setModalEditConfig({ ...modalEditConfig, isOpen: true })}
        onRemove={() =>
          setModalRemoveConfig({ ...modalRemoveConfig, isOpen: true })
        }
      />

      <Modal
        type={modalEditConfig.type}
        isOpen={modalEditConfig.isOpen}
        onClose={() =>
          setModalEditConfig({ ...modalEditConfig, isOpen: false })
        }
      />

      <Modal
        type={modalRemoveConfig.type}
        isOpen={modalRemoveConfig.isOpen}
        onClose={() =>
          setModalRemoveConfig({ ...modalRemoveConfig, isOpen: false })
        }
      />
    </div>
  );
}
