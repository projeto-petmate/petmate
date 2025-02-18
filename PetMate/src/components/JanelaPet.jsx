import React, { useContext, useState, useEffect } from 'react';
import './JanelaPet.css';
import { PetContext } from "../contexts/PetContext";
import axios from 'axios';
import { FaWhatsapp } from "react-icons/fa";

export default function JanelaPet({ isOpen, setPetModalOpen }) {
  const { pet } = useContext(PetContext);
  const [doador, setDoador] = useState(null);

  useEffect(() => {
    if (pet && pet.id_usuario) {
      const fetchDoador = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/usuarios/${pet.id_usuario}`);
          setDoador(response.data);
        } catch (error) {
          console.error('Erro ao buscar informações do doador:', error);
        }
      };
      fetchDoador();
    }
  }, [pet]);

  if (!isOpen || !pet) {
    return null;
  }

  const linkBase = doador ? `https://api.whatsapp.com/send?phone=${'55' + doador.telefone}&text=Ol%C3%A1!%20Estou%20interessado%20em%20${pet.nome}.` : "#";

  return (
    <div className='pet_modal_conteiner'>
      <div className='conteiner_modal'>
        <div className="cad-pet-container">
          <div className="titulo-pet-modal">
            <h2>{pet.nome}</h2>
            <button onClick={() => setPetModalOpen(false)} className='botao_modal'>{'<'}</button>
          </div>
          <img src="/images/barra_marrom.png" className='barra-pet-modal' alt="Barra" />

          <div className="card-modal-container">
            <div className="info-container">
              <div className="img-modal">
                <img 
                  src={pet.imagem ? pet.imagem : "/images/default_pet_image.jpg"} 
                  alt={`Imagem de ${pet.nome}`} 
                  className="pet-image" 
                />
              </div>
              <div className="detalhes-pet">
                <p>Raça</p> <h4>{pet.raca}</h4>
                <p>Idade</p> <h4>{pet.idade}</h4>
                <p>Gênero</p> <h4>{pet.genero}</h4>
              </div>
              <div className="descricao-pet">
                <p className='desc-title'>Descrição</p>
                <p> {pet.descricao}</p>
              </div>
            </div>

          </div>
            <div className="info-doador-modal">
              <h2>Quer Adotar?</h2>
              <p>Para adotar este pet, entre em contato com o protetor:</p>
              {doador && (
                <div className="info-doador">
                  <p>Nome do anunciante: <div className="dados-doador"> {doador.nome}</div></p>
                  {/* <p>Telefone: <div className="dados-doador"> {doador.telefone}</div></p> */}
                  <p>Email: <div className="dados-doador">{doador.email}</div></p>
                  <a href={linkBase}>
                    <FaWhatsapp className='icon_wpp'/>
                  </a>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}