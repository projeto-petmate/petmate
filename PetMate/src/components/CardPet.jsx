import React, { useContext, useState } from 'react';
import './CardPet.css';
import JanelaPet from './JanelaPet';
import { FaRegStar, FaStar } from "react-icons/fa";
import { GlobalContext } from "../contexts/GlobalContext";
import { PetContext } from '../contexts/PetContext';
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

function CardPet() {
  const [openPetModal, setOpenPetModal] = useState(false);
  const { setPet, favoritos, toggleFavorito, filter, filterOn, pets } = useContext(PetContext);
  const { userLogado } = useContext(GlobalContext);
  const vrfUser = !!userLogado?.id_usuario;

  const handleToggleFavorito = (id_pet) => {
    toggleFavorito(id_pet);
  };

  const safeFavoritos = Array.isArray(favoritos) ? favoritos : [];

  const filteredPets = filterOn
    ? pets.filter(pet => (
      pet.disponivel &&
      (filter.especie ? pet.especie === filter.especie : true) &&
      (filter.porte ? pet.porte === filter.porte : true) &&
      (filter.genero ? pet.genero === filter.genero : true)
    ))
    : pets.filter(pet => pet.disponivel);

  const displayedPets = filter.favoritos
    ? filteredPets.filter(pet => safeFavoritos.includes(pet.id_pet))
    : filteredPets;

  const ordemPets = filter.ordem === 'recentes'
    ? [...displayedPets].sort((a, b) => b.id_pet - a.id_pet)
    : [...displayedPets].sort((a, b) => a.id_pet - b.id_pet);

  // PAGINAÇÃO LOCAL
  const petsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ordemPets.length / petsPerPage);

  const startIndex = (currentPage - 1) * petsPerPage;
  const endIndex = startIndex + petsPerPage;
  const paginatedPets = ordemPets.slice(startIndex, endIndex);

  return (
    <div>
      <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />

      {filter.favoritos && displayedPets.length === 0 && (
        <p className='sem-pets-fav'>Você ainda não favoritou nenhum pet.</p>
      )}

      <div className="card-pet-container">
        {paginatedPets.map((p) => (
          <div key={p.id_pet} className="pet-card">
            <img
              src={p.imagem ? p.imagem : "/images/default_pet_image.jpg"}
              alt={`Imagem de ${p.nome}`}
              className="pet-image"
            />
            <div className="pet-info-card">
              <h3>{p.nome}</h3>
              <h4><strong className='texto-card'>Raça:</strong> {p.raca}</h4>
              <p><strong className='texto-card'>Idade:</strong> {p.idade}</p>
              <p>{p.porte} | {p.genero}</p>
            </div>

            <div className="botoes-card">
              <button className="botao-info-pet" onClick={() => {
                setPet(p);
                setOpenPetModal(true);
              }}>
                Mais informações
              </button>

              {vrfUser && (
                <button
                  alt="Favoritar"
                  className="favorito-icon"
                  onClick={() => handleToggleFavorito(p.id_pet)}
                >
                  {safeFavoritos.includes(p.id_pet)
                    ? <FaStar className='estrela-preenchida' />
                    : <FaRegStar className='estrela-vazia' />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {paginatedPets.length > 0 &&
      /* Paginação visual */
        < div className="paginacao-pets">
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

export default CardPet;
