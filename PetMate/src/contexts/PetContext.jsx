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
            const vrfOng = JSON.parse(localStorage.getItem("vrfOng"));
    
            if (!userLogado) {
                throw new Error("Usuário não está logado.");
            }
    
            const petData = {
                ...novoPet,
                id_usuario: vrfOng ? null : userLogado.id_usuario,
                id_ong: vrfOng ? userLogado.id_ong : null,
            };
    
            const response = await axios.post("http://localhost:3000/pets", petData);
            setPets((prevPets) => [...prevPets, response.data]);
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

    useEffect(() => {
        if (userLogado && userLogado.favoritos) {
            setFavoritos(userLogado.favoritos.split(',').map(Number)); 
        }
    }, [userLogado]);

    const toggleFavorito = async (idPet) => {
        if (!userLogado) return;

        let novosFavoritos;
        if (favoritos.includes(idPet)) {
            novosFavoritos = favoritos.filter((id) => id !== idPet);
        } else {
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