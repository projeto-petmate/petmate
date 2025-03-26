import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { updateFavoritos } from "../apiService";

export const PetContext = createContext();

export const PetContextProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [pet, setPet] = useState();
    const [favoritos, setFavoritos] = useState([]);
    const [userLogado, setUserLogado] = useState(JSON.parse(localStorage.getItem('userLogado')));

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
        favoritos: false, 
        ordem: 'recentes',
    });

    // Sincroniza os favoritos ao carregar o contexto
    useEffect(() => {
        if (userLogado && userLogado.favoritos) {
            setFavoritos(userLogado.favoritos.split(',').map(Number)); 
        }
    }, [userLogado]);

    // Atualiza os favoritos no backend e no estado global
    const toggleFavorito = async (idPet) => {
        if (!userLogado) return;

        let novosFavoritos;
        if (favoritos.includes(idPet)) {
            // Remove o pet dos favoritos
            novosFavoritos = favoritos.filter((id) => id !== idPet);
        } else {
            // Adiciona o pet aos favoritos
            novosFavoritos = [...favoritos, idPet];
        }

        setFavoritos(novosFavoritos);

        try {
            
            const updatedUser = await updateFavoritos(userLogado.id_usuario, novosFavoritos.join(','));
            localStorage.setItem('userLogado', JSON.stringify(updatedUser));
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
            setFilter
        }}>
            {children}
        </PetContext.Provider>
    );
};