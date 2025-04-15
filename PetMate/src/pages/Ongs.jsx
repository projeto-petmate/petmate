import { useContext, useState } from "react";
import CardOng from "../components/CardOng";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { GlobalContext } from '../contexts/GlobalContext';
import { useNavigate } from "react-router-dom";
import './Ongs.css';
import LastPage from "../components/LastPage";
import ScrollToTop from "../components/ScrollToTop";
import BarraPesquisa from "../components/BarraPesquisa";

function Ongs() {
  const { logado } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [termoPesquisa, setTermoPesquisa] = useState("");

  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <div className="banner-ong">
        <img src="./images/banner-ong.svg" alt="" />
      </div>
      <div className="ongs-container">
        <div className="titulo-pesquisa-ong">
          <div className="titulo-ongs">
            <h2>Encontre uma ONG e faça a diferença!</h2>
          </div>
          <BarraPesquisa valor={termoPesquisa} setValor={setTermoPesquisa} />
        </div>
        <div className="container-ongs">
          <CardOng termoPesquisa={termoPesquisa} />
        </div>
        <LastPage />
      </div>
      <Footer />
    </div>
  );
}

export default Ongs