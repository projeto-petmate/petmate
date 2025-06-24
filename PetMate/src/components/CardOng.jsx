import React, { useEffect, useState, useContext } from 'react'
import { OngContext } from '../contexts/OngContext';
import { getOngs } from '../apiService';
import './CardOng.css';
import JanelaOng from './JanelaOng';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

function CardOng({ termoPesquisa }) {
  const [ongs, setOngs] = useState([]);
  const { ong, setOng } = useContext(OngContext);
  const [openModalOng, setOpenModalOng] = useState(false);



  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const data = await getOngs();
        setOngs(data);
      } catch (error) {
        console.error("Erro ao buscar ONGs:", error);
      }
    };

    fetchOngs();
  }, []);

  const ongsFiltradas = ongs.filter((o) =>
    o.nome_ong.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Paginação
  const ongsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ongsFiltradas.length / ongsPerPage);
  const startIndex = (currentPage - 1) * ongsPerPage;
  const endIndex = startIndex + ongsPerPage;
  const paginatedOngs = ongsFiltradas.slice(startIndex, endIndex);

  // Resetar para a página 1 sempre que o termo de busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [termoPesquisa]);

  return (
    <div>
      <JanelaOng isOpen={openModalOng} setOpenModalOng={setOpenModalOng} />
      <div className="cardOng-container">
        {paginatedOngs.length > 0 ? (
          paginatedOngs.map((o) => (
            <div key={o.id_ong} className='ong-card'>
              <img
                src={o.foto_perfil}
                alt="Foto da ONG"
                className='ong-image'
              />
              <div className='ong-info-card'>
                <h3>{o.nome_ong}</h3>
                <h4>{o.cidade_ong}</h4>
              </div>
              <button className='botao-info-ong'
                onClick={() => {
                  setOng(o);
                  setOpenModalOng(true);
                }}>
                Mais Informações
              </button>
            </div>
          ))
        ) : (
          <p className="sem-ONGs">ONG não encontrada.</p>
        )}
      </div>

      {/* Paginação visual */}
      {ongsFiltradas.length > 0 && (
        <div className="paginacao-ongs">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaArrowLeft className='icon-setaPag' />
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
            <FaArrowRight className='icon-setaPag' />
          </button>
        </div>
      )}
    </div>
  );
}

export default CardOng;
