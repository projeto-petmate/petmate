import React, { useContext, useEffect, useState } from 'react';
import { PetContext } from '../contexts/PetContext';
import { getPets } from '../apiService';
import './CardContainer.css';
import JanelaPet from './JanelaPet';
import { FaRegStar, FaStar } from "react-icons/fa";
import { GlobalContext } from "../contexts/GlobalContext";

function CardContainer() {
  const [pets, setPets] = useState([]);
  const [openPetModal, setOpenPetModal] = useState(false);
  const { filter, filterOn, setPet, favoritos, toggleFavorito } = useContext(PetContext);
  const { userLogado } = useContext(GlobalContext);
  const vrfUser = userLogado?.id_usuario ? true : false;


  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    fetchPets();
  }, []);
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

  return (
    <div>
      <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />
      {filter.favoritos && displayedPets.length === 0 && <p className='sem-pets-fav'>Você ainda não favoritou nenhum pet.</p>}
      <div className="card-container">
        {ordemPets.map((p) => (
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
              }}>Mais informações</button>
              {vrfUser == true &&
                <button
                  alt="Favoritar"
                  className="favorito-icon"
                  onClick={() => handleToggleFavorito(p.id_pet)}>
                  {safeFavoritos.includes(p.id_pet) ?
                    <FaStar className='estrela-preenchida' /> : <FaRegStar className='estrela-vazia' />}
                </button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardContainer;