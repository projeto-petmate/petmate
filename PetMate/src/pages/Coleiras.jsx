import React, { Suspense, useState, useEffect } from 'react';
import './Coleiras.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModalPersonalizarColeira from '../components/ModalPersonalizarColeira';
import ModalColeiras from '../components/ModalColeiras';
import LastPage from "../components/LastPage"
import ColeiraPronta from '../components/CardColeiraPronta';
import { FaCartPlus, FaPaintBrush } from "react-icons/fa";

const ColeiraModelo = React.lazy(() => import('../components/ColeiraModelo'));

function Coleiras() {
  const [openModalPersonalizar, setOpenModalPersonalizar] = useState(false);
  const [mostrarModalPromo, setMostrarModalPromo] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('mostrarModalPromo') === 'true') {
      setMostrarModalPromo(true);
      localStorage.removeItem('mostrarModalPromo');
    }
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container-pg-coleiras">
        <div className="banner-coleiras">
          <img src="/images/banner-coleiraEditar.svg" className='banner-coleiras' />
        </div>

        {/* <div className="titulo-coleiras">
          <h2>Coleiras para pets</h2>
          <p>Encontre ou personalize uma coleira para seu companheiro!</p>
        </div> */}
        {/* 
        <div className="carrossel-coleiras">
          <Suspense fallback={<div>Carregando visualizador 3D...</div>}>
            <ColeiraModelo />
          </Suspense>
        </div> */}

        <div className="personalizar-coleira">
          <ModalPersonalizarColeira />

          <div className="container-coleiras-prontas">
            <p className='coleiras-prontas-title'>Sugestões de Coleiras Prontas</p>
            <ColeiraPronta />
          </div>
          <div className="titulo-personalizar-coleira">
            <h2>Crie uma coleira única para seu pet!</h2>
            <p>
              Escolha entre uma variedade de estilos, cores e tamanhos para criar uma coleira
              única que combine com a personalidade do seu pet.
            </p>
          </div>

          <div className="card-personalizar-coleira">
            <div className="imagem-personalizar-coleira">
              {/* <img src="/images/gatoleira.jfif" alt="" /> */}
            </div>
            <div className="botao-personalizar-coleira">
              <button className="botao-personalizar" onClick={() => setOpenModalPersonalizar(true)}>
                <FaPaintBrush className="icon-personalizar-coleira" />
                Criar minha coleira!
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <LastPage />

      {/* Modais */}
      <ModalPersonalizarColeira open={openModalPersonalizar} onClose={() => setOpenModalPersonalizar(false)} />
      <ModalColeiras open={mostrarModalPromo} onClose={() => setMostrarModalPromo(false)} />
    </div>
  );
}

export default Coleiras;
