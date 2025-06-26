import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getPets, deletePet, updatePet } from '../apiService';
import ModalExcluirPet from './ModalExcluirPet';
import './CardPetPerfil.css';
import ModalEditarPet from './ModalEditarPet';
import { FaArrowLeft, FaArrowRight, FaRegEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { FaShieldDog } from 'react-icons/fa6';
import ModalPetAdotado from './ModalPetAdotado';
import { PetContext } from '../contexts/PetContext';

function 
CardPetPerfil() {

    const { userLogado } = useContext(GlobalContext);
    const { togglePetAdotado } = useContext(PetContext)
    const [userPets, setUserPets] = useState([]);
    const [openModalExcluirPet, setOpenModalExcluirPet] = useState(false);
    const [openModalEditarPet, setOpenModalEditarPet] = useState(false);
    const [openModalPetAdotado, setOpenModalPetAdotado] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [petToEdit, setPetToEdit] = useState(null);
    const [petAdotado, setPetAdotado] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showSuccessPopupDel, setShowSuccessPopupDel] = useState(false);
    const containerClass = userPets.length <= 2 ? 'card-pet-perfil-container-poucos-pets' : 'card-pet-perfil-container';
    const [currentPage, setCurrentPage] = useState(1);
    const petsPerPage = 2;
    const { pets } = useContext(PetContext);
    

    useEffect(() => {
        if (userLogado) {
          setUserPets(
            pets.filter(pet =>
              userLogado.id_usuario
                ? pet.id_usuario === userLogado.id_usuario
                : pet.id_ong === userLogado.id_ong
            )
          );
        }
      }, [pets, userLogado]);

    const handleDelete = async () => {
        try {
            await deletePet(petToDelete.id_pet);
            setUserPets(userPets.filter(pet => pet.id_pet !== petToDelete.id_pet));
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
            setUserPets(userPets.map(pet => (pet.id_pet === updatedPet.id_pet ? updatedPet : pet)));
            setOpenModalEditarPet(false);
            setShowSuccessPopup(true);
            
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao editar pet', error);
        }
    };

    const handleMarcar = async (idPet) => {
        try {
            await togglePetAdotado(idPet);

            setUserPets((prevUserPets) =>
                prevUserPets.map((pet) =>
                    pet.id_pet === idPet ? { ...pet, disponivel: !pet.disponivel } : pet
                )
            );

            setOpenModalPetAdotado(false);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao marcar pet como adotado:', error);
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

    const ordemPerfil = [...userPets].sort((a, b) => a.id_pet - b.id_pet);

    // Lógica de paginação
    const totalPages = Math.ceil(userPets.length / petsPerPage);
    const startIndex = (currentPage - 1) * petsPerPage;
    const endIndex = startIndex + petsPerPage;
    const paginatedPets = ordemPerfil.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages]);

    return (
        <div className={containerClass}>
            <div className="pets-perfil">

                {paginatedPets.length > 0 ? (
                    paginatedPets.reverse().map((pet) => (
                        <div key={pet.id_pet} className="pet-card-perfil">
                            <img src={getPetImage(pet) || '/images/default_pet_image.jpg'} alt={`Imagem de ${pet.nome}`} className="pet-image" />
                            <div className="pet-info">
                                <h3>{pet.nome}</h3>
                                <p><strong className='texto-card'>Raça:</strong> {pet.raca}</p>
                                <p><strong className='texto-card'>Idade:</strong> {pet.idade}</p>
                                <p>{pet.porte} | {pet.genero}</p>
                                {pet.disponivel == false &&
                                    <div className="faixa-adotado">
                                        <p>ADOTADO</p>
                                    </div>
                                }
                                <div className="botoes-pet-perfil">
                                    <FaShieldDog className='botao-adotado' onClick={() => { setPetAdotado(pet); setOpenModalPetAdotado(true) }} />
                                    <button className="botao-editar" onClick={() => { setPetToEdit(pet); setOpenModalEditarPet(true) }}> Editar dados {<FaRegEdit />}</button>
                                    <IoTrash className="botao-excluir" onClick={() => { setPetToDelete(pet); setOpenModalExcluirPet(true) }} />
                                </div>
                            </div>

                        </div>

                    ))

                ) : (<p className='sem-pets'>Você não anunciou nenhum pet.</p>)}
            </div>

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
                        <p>Anúncio excluído com sucesso!</p>
                    </div>
                )
            }
            <ModalPetAdotado
                isMarcarPet={openModalPetAdotado}
                setOpenModalPetAdotado={setOpenModalPetAdotado}
                onMarcarPet={handleMarcar}
                petAdotado={petAdotado}
            />
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
            {paginatedPets.length >= 1 &&
                <div className="paginacao-pets-perfil">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaArrowLeft className='icon-seta-pag' />
                        Anterior
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                        <FaArrowRight className='icon-seta-pag' />
                    </button>
                </div>
            }
        </div >
    );
}

export default CardPetPerfil;