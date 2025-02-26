import React, { useContext, useEffect, useState } from 'react';
import { PetContext } from '../contexts/PetContext';
import { getPets } from '../apiService';
import './CardContainer.css';
import JanelaPet from './JanelaPet';

function CardContainer() {
  const [pets, setPets] = useState([]);
  const [openPetModal, setOpenPetModal] = useState(false);
  const { filter, filterOn, setPet } = useContext(PetContext);

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

  const filteredPets = filterOn
    ? pets.filter(pet => {
        return (
          (filter.especie ? pet.especie === filter.especie : true) &&
          (filter.porte ? pet.porte === filter.porte : true) &&
          (filter.genero ? pet.genero === filter.genero : true)
        );
      })
    : pets;

  const ordemPets = filter.ordem === 'recentes'
    ? [...filteredPets]
    : filteredPets.reverse()

  return (
    <div>
      <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />

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
              <p><strong>Raça:</strong> {p.raca}</p>
              <p><strong>Idade:</strong> {p.idade}</p>
              <p>{p.porte} | {p.genero}</p>
            </div>
            <button className="botao-info-pet" onClick={() => {
              setPet(p);
              setOpenPetModal(true);
            }}>Mais informações</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardContainer;