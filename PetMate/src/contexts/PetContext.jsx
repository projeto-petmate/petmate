import { createContext, useState } from "react";
import axios from 'axios';

export const PetContext = createContext();

export const PetContextProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [pet, setPet] = useState();

    const addPet = async (novoPet) => {
        try {
            const userLogado = JSON.parse(localStorage.getItem("userLogado"));
            if (!userLogado || !userLogado.id_usuario) {
                throw new Error("Usuário não está logado ou ID do usuário não encontrado");
            }
    
            const petData = {
                ...novoPet,
                id_usuario: userLogado.id_usuario 
            };
    
            const response = await axios.post("http://localhost:3000/pets", petData);
            setPets([...pets, response.data]);
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

    const [filterOn, setFilterOn] = useState(false);
    const [filter, setFilter] = useState({});

    return (
        <PetContext.Provider value={{
            pets,
            addPet,
            fetchPets,
            pet,
            setPet,
            setPets,
            filterOn,
            setFilterOn,
            filter,
            setFilter
        }}>
            {children}
        </PetContext.Provider>
    );
};