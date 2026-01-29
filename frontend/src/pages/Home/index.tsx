import { useState } from "react";
import { Item } from "../../components/Item";
import { Modal } from "../../components/Modal";

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
    <div className="min-h-screen bg-gradient-to-tr from-[#0E0014] to-[#001E4D] p-8">
      <Item
        typeAnimal="cat"
        petName="Simba Farias"
        ownerName="Emmanuel Farias"
        petRace="Persa"
        ownerTelefone="81982402134"
        petDateOfBirth={new Date("2022-08-22")}
        onEdit={() => setModalEditConfig({ ...modalEditConfig, isOpen: true })}
        onRemove={() => setModalRemoveConfig({ ...modalRemoveConfig, isOpen: true })}
      />

      <Modal
        type={modalEditConfig.type}
        isOpen={modalEditConfig.isOpen}
        onClose={() => setModalEditConfig({ ...modalEditConfig, isOpen: false })}
      />
      
      <Modal
        type={modalRemoveConfig.type}
        isOpen={modalRemoveConfig.isOpen}
        onClose={() => setModalRemoveConfig({ ...modalRemoveConfig, isOpen: false })}
      />
    </div>
  );
}