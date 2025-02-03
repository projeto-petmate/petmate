import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { PetContext } from '../contexts/PetContext';
import { getPets } from '../apiService';
import './CardContainer.css';
import JanelaPet from './JanelaPet';

function CardContainer() {
  const [pets, setPets] = useState([]);
  const [openPetModal, setOpenPetModal] = useState(false);
  const { setPet } = useContext(PetContext);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data.reverse());
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    fetchPets();
  }, []);

  return (
    <div>
      <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />

      <div className="card-container">
        {pets.map((p) => (
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
            }}>Adotar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardContainer;
