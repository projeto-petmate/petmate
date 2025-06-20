import React, { useContext, useEffect, useState } from 'react';
import { getPets, deletePet, updatePet } from '../apiService';
import ModalExcluirPet from './ModalExcluirPet';
import ModalEditarPet from './ModalEditarPet';
import './CardPetPerfil.css';
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { IoTrash, IoTrashOutline } from "react-icons/io5";
import JanelaPet from './JanelaPet';
import { PetContext } from '../contexts/PetContext';
import { GlobalContext } from '../contexts/GlobalContext';

function PetsAdm({ idPet }) {
    const [allPets, setAllPets] = useState([]);
    const [openModalExcluirPet, setOpenModalExcluirPet] = useState(false);
    const [openModalEditarPet, setOpenModalEditarPet] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [petToEdit, setPetToEdit] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showSuccessPopupDel, setShowSuccessPopupDel] = useState(false);
    const [openPetModal, setOpenPetModal] = useState(false);
    const { setPet } = useContext(PetContext);
    const { isAdmin } = useContext(GlobalContext);


    useEffect(() => {
        const fetchAllPets = async () => {
            try {
                const pets = await getPets();
                setAllPets(pets);
            } catch (error) {
                console.error("Erro ao buscar todos os pets:", error);
            }
        };

        fetchAllPets();
    }, []);


    const handleDelete = async () => {
        try {
            await deletePet(petToDelete.id_pet);
            setAllPets(allPets.filter(pet => pet.id_pet !== petToDelete.id_pet));
            setOpenModalExcluirPet(false);
            setShowSuccessPopupDel(true);
            setTimeout(() => {
                setShowSuccessPopupDel(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao deletar pet', error);
        }
    };

    const handleEdit = async (updatedPet) => {
        try {
            await updatePet(updatedPet.id_pet, updatedPet);
            setAllPets(allPets.map(pet => (pet.id_pet === updatedPet.id_pet ? updatedPet : pet)));
            setOpenModalEditarPet(false);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao editar pet', error);
        }
    };

    function getPetImage(pet) {
        if (pet.imagens) {
            const imgs = pet.imagens.split(',').map(s => s.trim()).filter(Boolean);
            if (imgs.length > 0 && imgs[0]) return imgs[0];
        }
        if (pet.imagem) return pet.imagem;
        return "/images/default_pet_image.jpg";
    }

    // const ordemPets = [...allPets].sort((a, b) => a.id_pet - b.id_pet);
    const petsFiltrados = idPet ? allPets.filter((pet) => pet.id_pet === idPet) : allPets;

    return (
        <div className="card-pet-perfil-container">
            {petsFiltrados.length > 0 ? (
                petsFiltrados.map((pet) => (
                    <div key={pet.id_pet} className="pet-card-perfil">
                        <img src={getPetImage(pet) || '/images/default_pet_image.jpg'} alt={`Imagem de ${pet.nome}`} className="pet-image" />
                        <div className="pet-info">
                            <h3>{pet.nome}</h3>
                            <p><strong className='texto-card'>Raça:</strong> {pet.raca}</p>
                            <p><strong className='texto-card'>Idade:</strong> {pet.idade}</p>
                            <p>{pet.porte} | {pet.genero}</p>
                            <div className="botoes-pet-perfil">
                                <button className="botao-info-pet" onClick={() => {
                                    setPet(pet);
                                    setOpenPetModal(true);
                                }}>Informações</button>
                                {isAdmin &&
                                    <FaEdit className="botao-editar-pet" onClick={() => { setPetToEdit(pet); setOpenModalEditarPet(true) }} />
                                }
                                {isAdmin &&
                                    <IoTrash className="botao-excluir" onClick={() => { setPetToDelete(pet); setOpenModalExcluirPet(true) }} />
                                }
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className='sem-pets'>Nenhum pet encontrado.</p>
            )}
            {
                showSuccessPopup && (
                    <div className="success-popup-edit-pet">
                        <p>Dados salvos com sucesso!</p>
                    </div>
                )
            }
            {
                showSuccessPopupDel && (
                    <div className="success-popup-edit-pet">
                        <p>Pet excluído com sucesso!</p>
                    </div>
                )
            }
            <ModalEditarPet
                isEditarPet={openModalEditarPet}
                setPetEditOpen={setOpenModalEditarPet}
                onEditPet={handleEdit}
                petToEdit={petToEdit}
            />
            <ModalExcluirPet
                isExcluirPet={openModalExcluirPet}
                setPetDeleteOpen={setOpenModalExcluirPet}
                onDeletePet={handleDelete}
            />
            <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />
        </div>
    );
}

export default PetsAdm;