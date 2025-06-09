import { useContext, useEffect, useState } from "react";
import ModalAnunciarPet from "../components/ModalAnunciarPet";
import CardPet from "../components/CardPet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { GlobalContext } from '../contexts/GlobalContext';
import './Adotar.css';
import LastPage from "../components/LastPage";
import ScrollToTop from "../components/ScrollToTop";
import BarraFiltro from "../components/BarraFiltro";

function Adotar() {
  const [openModal, setOpenCadModal] = useState(false);
  const { logado } = useContext(GlobalContext);

  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <div className="banner-contato">
        <img
          src="/images/banner-adotar.svg"
          data-src="/images/banner-adotar-2025.svg"
          alt="Banner Adotar"
          className="banner-image"
        />
      </div>
      <BarraFiltro />
      <div className="adotar-container">
        <div className="titulo-botao-adotar">
          <div className="titulo-adotar">
            <h2>Pets para Adoção</h2>
            <p>Transforme a vida de um pet e ganhe um amigo para sempre!</p>
          </div>
          <div>
            {logado &&
              <button className='botao-modal-anunciar' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
            }
          </div>
        </div>
        <ModalAnunciarPet isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
        <div className="pets-container">
          <CardPet />
        </div>
        <LastPage />
      </div>
      <Footer />
    </div>
  );
}

export default Adotar;