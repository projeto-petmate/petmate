import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { updateFavoritos, updatePet } from "../apiService";
import { GlobalContext } from "./GlobalContext";

export const PetContext = createContext();

export const PetContextProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [pet, setPet] = useState();
    const [favoritos, setFavoritos] = useState([]);
    const { userLogado, setUserLogado } = useContext(GlobalContext)
    
    const addPet = async (novoPet) => {
        try {
            if (!userLogado) {
                throw new Error("Usuário não está logado.");
            }
    
            const vrfOng = userLogado?.id_ong ? true : false;
    
            const petData = {
                ...novoPet,
                id_usuario: vrfOng ? null : userLogado.id_usuario, 
                id_ong: vrfOng ? userLogado.id_ong : null, 
            };
    
            if (!petData.nome || !petData.especie || !petData.raca || !petData.idade || !petData.porte || !petData.genero) {
                throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
            }
    
            const response = await axios.post("http://localhost:3000/pets", petData);
    
            setPets((prevPets) => [...prevPets, response.data]);
    
            console.log("Pet cadastrado com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao adicionar pet:", error);
        }
    };
    
    const fetchPets = async () => {
        try {
            const response = await axios.get("http://localhost:3000/pets");
            setPets(response.data);
        } catch (error) {
            console.error("Erro ao buscar pets:", error);
        }
    };

    useEffect(() => {
        fetchPets(); 
    }, []);

    const [filterOn, setFilterOn] = useState(false);
    const [filter, setFilter] = useState({
        especie: '',
        porte: '',
        genero: '',
        favoritos: false, 
        ordem: 'recentes',
    });

    useEffect(() => {
        if (userLogado && userLogado.favoritos) {
            setFavoritos(userLogado.favoritos.split(',').map(Number)); 
        }
    }, [userLogado]);

 const togglePetAdotado = async (idPet) => {
    try {
        const pet = pets.find((p) => p.id_pet === idPet);
        if (!pet) {
            console.error("Erro: Pet não encontrado.");
            return;
        }

        const novoEstado = !pet.disponivel;

        const petAtualizado = { ...pet, disponivel: novoEstado };

        await updatePet(idPet, petAtualizado);

        setPets((prevPets) =>
            prevPets.map((p) =>
                p.id_pet === idPet ? { ...p, disponivel: novoEstado } : p
            )
        );

        console.log(`Estado do pet ${idPet} atualizado para: ${novoEstado ? 'Disponível' : 'Adotado'}`);
    } catch (error) {
        console.error("Erro ao atualizar o estado do pet:", error);
    }
};

    const toggleFavorito = async (idPet) => {
        if (!userLogado) {
            console.error("Erro: Usuário não está logado.");
            return;
        }

        let novosFavoritos;
        if (favoritos.includes(idPet)) {
            novosFavoritos = favoritos.filter((id) => id !== idPet);
        } else {
            novosFavoritos = [...favoritos, idPet];
        }

        setFavoritos(novosFavoritos);

        try {
            const updatedUser = await updateFavoritos(userLogado.id_usuario, novosFavoritos.join(','));

            setUserLogado((prevUser) => ({
                ...prevUser,
                favoritos: updatedUser.favoritos,
            }));

            console.log('Favoritos atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        }
    };

    return (
        <PetContext.Provider value={{
            pets,
            addPet,
            fetchPets,
            pet,
            setPet,
            setPets,
            favoritos,
            setFavoritos, 
            toggleFavorito,
            filterOn,
            setFilterOn,
            filter,
            setFilter,
            togglePetAdotado
        }}>
            {children}
        </PetContext.Provider>
    );
};