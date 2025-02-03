import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getPets, deletePet } from '../apiService';
import ModalExcluirPet from './ModalExcluirPet';
import './CardPetPerfil.css';

function CardPetPerfil() {
    const { userLogado } = useContext(GlobalContext);
    const [userPets, setUserPets] = useState([]);
    const [openModalExcluirPet, setOpenModalExcluirPet] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                const pets = await getPets();
                const filteredPets = pets.filter(pet => pet.id_usuario === userLogado.id_usuario);
                setUserPets(filteredPets);
            } catch (error) {
                console.error("Erro ao buscar pets do usuário:", error);
            }
        };

        if (userLogado) {
            fetchUserPets();
        }
    }, [userLogado]);

    const handleDelete = async () => {
        try {
            await deletePet(petToDelete.id_pet);
            setUserPets(userPets.filter(pet => pet.id_pet !== petToDelete.id_pet));
            setOpenModalExcluirPet(false);
        } catch (error) {
            console.error('Erro ao deletar pet', error);
        }
    };

    return (
        <div className="card-pet-perfil-container">
            {userPets.map(pet => (
                <div key={pet.id_pet} className="pet-card-perfil">
                    <img src={pet.imagem || "/images/default_pet_image.jpg"} alt={`Imagem de ${pet.nome}`} className="pet-image" />
                    <div className="pet-info">
                        <h3>{pet.nome}</h3>
                        <p><strong>Raça:</strong> {pet.raca}</p>
                        <p><strong>Idade:</strong> {pet.idade}</p>
                        <p>{pet.porte} | {pet.genero}</p>
                        <button className="botao-excluir" onClick={() => { setPetToDelete(pet); setOpenModalExcluirPet(true); }}>Excluir</button>
                    </div>
                </div>
            ))}
            <ModalExcluirPet isExcluirPet={openModalExcluirPet} setPetDeleteOpen={setOpenModalExcluirPet} onDeletePet={handleDelete} />
        </div>
    );
}

export default CardPetPerfil;