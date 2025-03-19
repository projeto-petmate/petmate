import { useContext, useEffect, useState } from "react";
import JanelaModal from "../components/JanelaModal";
import CardContainer from "../components/CardContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { GlobalContext } from '../contexts/GlobalContext';
import { useNavigate } from "react-router-dom";
import './Adotar.css';
import LastPage from "../components/LastPage";
import ScrollToTop from "../components/ScrollToTop";
import BarraFiltro from "../components/BarraFiltro";

function Adotar() {
  const [openModal, setOpenCadModal] = useState(false);
  const { logado } = useContext(GlobalContext);
  const navigate = useNavigate()


  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <div className="banner-contato">
        <img src="/images/banner-adotar-2025.svg" alt="" />
      </div>
      <BarraFiltro />
      <div className="adotar-container">
        <div className="titulo-botao-adotar">
          <div className="titulo-adotar">
            <h2>Pets para Adoção</h2>
            <p>Transforme a vida de um pet e ganhe um amigo para sempre!</p>
          </div>
          <div>
            {logado ? (
              <button className='botao-modal' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
            ) : <button className='botao-modal' onClick={() => navigate('/login')}>Anunciar Pet</button>}
          </div>
        </div>
        <JanelaModal isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
        <div className="pets-container">
          <CardContainer />
        </div>
        <LastPage />
      </div>
      <Footer />
    </div>
  );
}

export default Adotar;