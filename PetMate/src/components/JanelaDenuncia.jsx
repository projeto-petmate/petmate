import React, { useContext, useEffect, useState } from 'react';
import './JanelaDenuncia.css';
import { GlobalContext } from '../contexts/GlobalContext';
import { getDenunciaById, updateDenuncia } from '../apiService';
import PetsAdm from '../components/PetsAdm';
import ComentarioAdm from '../components/ComentarioAdm';
import OngsAdm from '../components/OngsAdm';
import { CgCloseO } from 'react-icons/cg';

export default function JanelaDenuncia({ isOpen, setDenunciaModalOpen, d, onStatusUpdate }) {
  const [denuncia, setDenuncia] = useState([])
  const [loading, setLoading] = useState(false);
  const { setDenuncias, isAdmin } = useContext(GlobalContext)


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

  const handleUpdateStatus = async (status) => {
    try {
      setLoading(true);
      const updatedDenuncia = await updateDenuncia(denuncia.id_denuncia, { status });
      setDenuncia({ ...denuncia, status: updatedDenuncia.status });

      setDenuncias((prevDenuncias) =>
        prevDenuncias.map((d) =>
          d.id_denuncia === updatedDenuncia.id_denuncia ? updatedDenuncia : d
        )
      );

      setLoading(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setLoading(false);
    }
  };



  return (
    <div className="denuncia-modal-container" onClick={() => setDenunciaModalOpen(false)}>
      <div className="container-janela-denuncia" onClick={(e) => e.stopPropagation()}>
        <div className="titulo-denuncia-modal">
          <div className="titulo-fechar-denuncia">
            <h2>Denúncia #{denuncia.id_denuncia}</h2>
            <CgCloseO onClick={() => setDenunciaModalOpen(false)} className="icon-fechar-denuncia">
              {/* <CgCloseO className="closeIcon" /> */}
            </CgCloseO>
          </div>
          <img src=" /images/barra_marrom.png" className="barra-denuncia-modal" alt="Barra" />
        </div>
        <div className="meio-container-denuncia">
          <div className="card-objeto">
            {denuncia.tipo_objeto === 'pet' && <PetsAdm idPet={denuncia.id_objeto} />}
            {denuncia.tipo_objeto === 'ong' && <OngsAdm idOng={denuncia.id_objeto} />}
            {denuncia.tipo_objeto === 'comentario' && <ComentarioAdm idComentario={denuncia.id_objeto} />}
          </div>
          <div className="conteudo-denuncia">
            <div className="mensagem-denuncia">
              <h3 className="mensagem-title">Mensagem</h3>
              <p>{denuncia.mensagem || 'Nenhuma mensagem fornecida.'}</p>
            </div>
            {isAdmin && (
              <>
                <div className="info-denuncia">
                  <h3 className="info-title">Informações da Denúncia</h3>
                  <p><strong>
                    Denunciante:{" "}</strong>
                    {denuncia.tipo_denunciante === "usuario"
                      ? `Usuário (ID: ${denuncia.id_denunciante})`
                      : `ONG (ID: ${denuncia.id_ong_denunciante})`}
                  </p>
                  <p><strong>ID do objeto:</strong> {denuncia.id_objeto}</p>
                  <p><strong>Motivo:</strong> {denuncia.motivo}</p>
                  <p><strong>Status:</strong> {denuncia.status}</p>
                </div>
                <div className="status-janela-denuncia">
                  <h4 className='titulo-status-janela-denuncia'>Status da Denúncia</h4>
                  <div className="inputs-status-janela-denuncia">
                    <label className="radio-janela-denuncia">
                      <input type="radio" id='status-pendente' checked={denuncia.status === 'pendente'} name='status-janela-denuncia' onChange={(e) => { handleUpdateStatus('pendente') }} disabled={loading} />
                      <span className='span-janela-denuncia'>Pendente</span>
                    </label>
                    <label className="radio-janela-denuncia">
                      <input type="radio" id='status-analise' checked={denuncia.status === 'em análise'} name='status-janela-denuncia' onChange={(e) => { handleUpdateStatus('em análise') }} disabled={loading} />
                      <span className='span-janela-denuncia'>Em análise</span>
                    </label>
                    <label className="radio-janela-denuncia">
                      <input type="radio" id='status-resolvido' checked={denuncia.status === 'resolvido'} name='status-janela-denuncia' onChange={(e) => { handleUpdateStatus('resolvido') }} disabled={loading} />
                      <span className='span-janela-denuncia'>Resolvido</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}