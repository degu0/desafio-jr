import { useState } from "react";
import { Item } from "../../components/Item";
import { Modal } from "../../components/Modal";
import { MdLogout } from "react-icons/md";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { SearchBar } from "../../components/SearchBar";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [modalRegisterConfig, setModalRegisterConfig] = useState({
    isOpen: false,
    type: "Register" as "Edit" | "Remove" | "Register",
  });
  const [modalEditConfig, setModalEditConfig] = useState({
    isOpen: false,
    type: "Edit" as "Edit" | "Remove" | "Register",
  });
  const [modalRemoveConfig, setModalRemoveConfig] = useState({
    isOpen: false,
    type: "Remove" as "Edit" | "Remove" | "Register",
  });

  const pets = [
    {
      typeAnimal: "cat" as const,
      petName: "Simba Farias",
      ownerName: "Emmanuel Farias",
      petRace: "Persa",
      ownerTelefone: "81982402134",
      petDateOfBirth: new Date("2022-08-22"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Thor Silva",
      ownerName: "Maria Silva",
      petRace: "Golden Retriever",
      ownerTelefone: "81987654321",
      petDateOfBirth: new Date("2020-03-15"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Mia Oliveira",
      ownerName: "João Oliveira",
      petRace: "Siamês",
      ownerTelefone: "81976543210",
      petDateOfBirth: new Date("2021-11-10"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Bella Santos",
      ownerName: "Ana Santos",
      petRace: "Poodle",
      ownerTelefone: "81965432109",
      petDateOfBirth: new Date("2019-06-25"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Luna Costa",
      ownerName: "Pedro Costa",
      petRace: "Maine Coon",
      ownerTelefone: "81954321098",
      petDateOfBirth: new Date("2023-01-18"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Max Ferreira",
      ownerName: "Carla Ferreira",
      petRace: "Bulldog Francês",
      ownerTelefone: "81943210987",
      petDateOfBirth: new Date("2021-09-05"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Nina Almeida",
      ownerName: "Rafael Almeida",
      petRace: "Ragdoll",
      ownerTelefone: "81932109876",
      petDateOfBirth: new Date("2022-04-12"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Zeus Rodrigues",
      ownerName: "Juliana Rodrigues",
      petRace: "Pastor Alemão",
      ownerTelefone: "81921098765",
      petDateOfBirth: new Date("2018-12-30"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Mel Souza",
      ownerName: "Lucas Souza",
      petRace: "Sphynx",
      ownerTelefone: "81910987654",
      petDateOfBirth: new Date("2020-07-22"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Apolo Martins",
      ownerName: "Beatriz Martins",
      petRace: "Husky Siberiano",
      ownerTelefone: "81909876543",
      petDateOfBirth: new Date("2021-02-14"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Chloe Lima",
      ownerName: "Gabriel Lima",
      petRace: "British Shorthair",
      ownerTelefone: "81898765432",
      petDateOfBirth: new Date("2022-10-08"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Rex Barbosa",
      ownerName: "Fernanda Barbosa",
      petRace: "Rottweiler",
      ownerTelefone: "81887654321",
      petDateOfBirth: new Date("2019-05-20"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Princesa Gomes",
      ownerName: "Ricardo Gomes",
      petRace: "Angorá",
      ownerTelefone: "81876543210",
      petDateOfBirth: new Date("2023-03-12"),
    },
    {
      typeAnimal: "dog" as const,
      petName: "Bob Cardoso",
      ownerName: "Camila Cardoso",
      petRace: "Beagle",
      ownerTelefone: "81865432109",
      petDateOfBirth: new Date("2020-11-25"),
    },
    {
      typeAnimal: "cat" as const,
      petName: "Mingau Rocha",
      ownerName: "Daniel Rocha",
      petRace: "Vira-lata",
      ownerTelefone: "81854321098",
      petDateOfBirth: new Date("2021-07-30"),
    },
  ];

  const filteredPets = pets.filter((pet) => {
    const searchLower = searchTerm.toLowerCase();
    const petNameMatch = pet.petName.toLowerCase().includes(searchLower);
    const ownerNameMatch = pet.ownerName
      .toLocaleLowerCase()
      .includes(searchLower);

    return petNameMatch || ownerNameMatch;
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = filteredPets.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-gradient-to-tr from-[#0E0014] to-[#001E4D] p-12">
      <div className="flex items-center justify-between text-white text-3xl">
        <h1>SoftPet</h1>
        <button onClick={() => navigate("/login")}>
          <MdLogout />
        </button>
      </div>

      <div className="flex items-center justify-between gap-5">
        <div className="w-[90%]">
          <SearchBar placeholder="Pesquisar pets..." onSearch={handleSearch} />
        </div>
        <div className="w-[13%]">
          <button
            className="w-full flex-1 bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
            rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() =>
              setModalRegisterConfig({ ...modalRegisterConfig, isOpen: true })
            }
          >
            <HiOutlinePlusCircle />
            Cadastrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentPets.length > 0 ? (
          currentPets.map((pet, index) => (
            <Item
              key={index}
              typeAnimal={pet.typeAnimal}
              petName={pet.petName}
              ownerName={pet.ownerName}
              petRace={pet.petRace}
              ownerTelefone={pet.ownerTelefone}
              petDateOfBirth={pet.petDateOfBirth}
              onEdit={() =>
                setModalEditConfig({ ...modalEditConfig, isOpen: true })
              }
              onRemove={() =>
                setModalRemoveConfig({ ...modalRemoveConfig, isOpen: true })
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-xl">
              Nenhum pet encontrado para "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-white cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            <IoArrowBackCircleOutline className="text-2xl" />
          </button>

          <div className="flex items-center gap-2 text-white">
            <span>
              {currentPage} de {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-white cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            <IoArrowForwardCircleOutline className="text-xl" />
          </button>
        </div>
      )}

      <Modal
        type={modalRegisterConfig.type}
        isOpen={modalRegisterConfig.isOpen}
        onClose={() =>
          setModalRegisterConfig({ ...modalRegisterConfig, isOpen: false })
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
