import React, { useEffect, useState, useContext } from 'react'
import { OngContext } from '../contexts/OngContext';
import { getOngs } from '../apiService';
import './CardOng.css';
import JanelaOng from './JanelaOng';

function CardOng() {
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
  return (
    <div>
      <JanelaOng isOpen={openModalOng} setOpenModalOng={setOpenModalOng} />
      <div className="cardOng-container">
        {ongs.map((o) => (
          <div key={o.id_ong} className='ong-card'>
            <img
              src={o.foto_ong}
              alt=""
              className='ong-image'
            />
            <div className='ong-info-card'>
              <h3>{o.nome_ong}</h3>
              <h4>{o.cidade_ong}</h4>
            </div>
            <button className='botao-info-ong' 
              onClick={() => {
              setOng(o);
              setOpenModalOng(true);}}>Mais Informações</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardOng