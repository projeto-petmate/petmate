import { createContext, useState } from "react";
import axios from 'axios';

export const PetContext = createContext();

export const PetContextProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [pet, setPet] = useState();
    const [favoritos, setFavoritos] = useState([]); //estado para os favoritos

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
    const [filter, setFilter] = useState({
        especie: '',
        porte: '',
        genero: '',
        favoritos: false, //campo para filtrar favoritos
        ordem: 'recentes',
    });

    const toggleFavorito = (id_pet) => {
        setFavoritos((prevFavoritos) => {
            if (prevFavoritos.includes(id_pet)) {
                return prevFavoritos.filter((id) => id !== id_pet); // Remover do array
            } else {
                return [...prevFavoritos, id_pet]; // Adicionar ao array
            }
        });
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
            setFilter
        }}>
            {children}
        </PetContext.Provider>
    );
};