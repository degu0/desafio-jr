import { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";

type Pet = {
  id: string;
  name: string;
  race: string;
  birthDate: string;
  type: "CAT" | "DOG";
  owner: {
    id: string;
    name: string;
    telefone: string;
  };
};

export function Home() {
  const token = localStorage.getItem("@softpet:token");
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [modalRegisterConfig, setModalRegisterConfig] = useState({
    isOpen: false,
    type: "Register" as "Edit" | "Remove" | "Register",
  });
  const [modalEditConfig, setModalEditConfig] = useState({
    isOpen: false,
    type: "Edit" as "Edit" | "Remove" | "Register",
    idPet: "",
  });
  const [modalRemoveConfig, setModalRemoveConfig] = useState({
    isOpen: false,
    type: "Remove" as "Edit" | "Remove" | "Register",
    idPet: "",
  });

  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:3000/pets", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Erro ao buscar os animais`);

      const data = await response.json();
      setPets(data);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      if (error instanceof Error && error.message.includes("401")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPets();
    } else {
      navigate("/login");
    }
  }, []);

  const handleRefreshPets = () => {
    fetchPets();
    setCurrentPage(1);
  };

  const filteredPets = pets.filter((pet) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const petNameMatch = pet.name.toLowerCase().includes(searchLower);
    const ownerNameMatch = pet.owner.name
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-tr from-[#0E0014] to-[#001E4D]">
        <p className="text-white text-2xl">Carregando pets...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-linear-to-tr from-[#0E0014] to-[#001E4D] p-12">
      <div className="flex items-center justify-between text-white text-3xl">
        <h1>SoftPet</h1>
        <button onClick={() => handleLogout()} className="cursor-pointer">
          <MdLogout />
        </button>
      </div>

      <div className="flex items-center justify-between gap-5">
        <div className="w-[90%]">
          <SearchBar placeholder="Pesquisar pets..." onSearch={handleSearch} />
        </div>
        <div className="w-[13%]">
          <button
            className="w-full flex-1 bg-linear-to-r from-[#00CAFC] to-[#0056E2] text-white font-semibold py-3 
            rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() =>
              setModalRegisterConfig({ ...modalRegisterConfig, isOpen: true })
            }
          >
            <span className="sm:hidden lg:block">
              <HiOutlinePlusCircle />
            </span>
            <span className="hidden sm:block">Cadastrar</span>
          </button>
        </div>
      </div>

      <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {currentPets.length > 0 ? (
          currentPets.map((pet) => (
            <Item
              key={pet.id}
              typeAnimal={pet.type}
              petName={pet.name}
              ownerName={pet.owner.name}
              petRace={pet.race}
              ownerTelefone={pet.owner.telefone}
              petDateOfBirth={new Date(pet.birthDate)}
              onEdit={() =>
                setModalEditConfig({
                  ...modalEditConfig,
                  isOpen: true,
                  idPet: pet.id,
                })
              }
              onRemove={() =>
                setModalRemoveConfig({
                  ...modalRemoveConfig,
                  isOpen: true,
                  idPet: pet.id,
                })
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
        onSuccess={handleRefreshPets}
      />
      <Modal
        type={modalEditConfig.type}
        isOpen={modalEditConfig.isOpen}
        onClose={() =>
          setModalEditConfig({ ...modalEditConfig, isOpen: false })
        }
        onSuccess={handleRefreshPets}
        idPet={modalEditConfig.idPet}
      />
      <Modal
        type={modalRemoveConfig.type}
        isOpen={modalRemoveConfig.isOpen}
        onClose={() =>
          setModalRemoveConfig({ ...modalRemoveConfig, isOpen: false })
        }
        onSuccess={handleRefreshPets}
        idPet={modalRemoveConfig.idPet}
      />
    </div>
  );
}
