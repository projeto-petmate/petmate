import React, { useContext, useEffect, useState } from 'react';
import './JanelaDenuncia.css';
import { IoMdClose } from 'react-icons/io';
import { GlobalContext } from '../contexts/GlobalContext';
import { getDenunciaById } from '../apiService';

export default function JanelaDenuncia({ isOpen, setDenunciaModalOpen, d }) {
    const [denuncia, setDenuncia] = useState([])

    useEffect(() => {
        const fetchDenuncia = async () => {
          if (d) {
            try {
              const fetchedDenuncia = await getDenunciaById(d);
              setDenuncia(fetchedDenuncia);
            } catch (error) {
              console.error('Erro ao buscar denúncia:', error);
            }
          }
        };
    
        fetchDenuncia();
      }, [d]);
  if (!isOpen || !d) {
    return null;
  }

  

  return (
    <div className="denuncia_modal_conteiner" onClick={() => setDenunciaModalOpen(false)}>
      <div className="conteiner_modal_denuncia" onClick={(e) => e.stopPropagation()}>
        <div className="titulo-denuncia-modal">
          <h2>Denúncia #{denuncia.id_denuncia}</h2>
          <button onClick={() => setDenunciaModalOpen(false)} className="botao-fechar-denuncia">
            <IoMdClose className="closeIcon" />
          </button>
        </div>
        <img src="/images/barra_marrom.png" className="barra-denuncia-modal" alt="Barra" />
        <div className="conteudo-denuncia">
          <div className="info-denuncia">
            <h3 className="info-title">Informações da Denúncia</h3>
            <p><strong>ID do denunciante:</strong> {denuncia.id_denunciante}</p>
            <p><strong>Motivo:</strong> {denuncia.motivo}</p>
            <p><strong>Status:</strong> {denuncia.status}</p>
          </div>
          <div className="mensagem-denuncia">
            <h3 className="info-title">Mensagem</h3>
            <p>{denuncia.mensagem || 'Nenhuma mensagem fornecida.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}