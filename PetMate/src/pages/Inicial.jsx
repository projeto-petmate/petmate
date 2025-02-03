import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import JanelaModal from '../components/JanelaModal';
import Navbar from '../components/Navbar';
import { Link,  useNavigate } from "react-router-dom";
import { GlobalContext } from '../contexts/GlobalContext';
import './Inicial.css';
import LastPage from '../components/LastPage';

function Inicial() {
  const [openModal, setOpenModal] = useState(false);
  const { logado } = useContext(GlobalContext);
  const navigate = useNavigate()


  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
        localStorage.setItem('hasReloaded', 'true');
        window.location.reload();
    } else {
        localStorage.removeItem('hasReloaded');
    }
}, []);

  return (
    <div>
        <Navbar />
        <div className="home-container">
            <img src="/images/banner_home3.svg" className='banner-home' />
            <div className="meio-home">
              <div className="texto-home">
                <div className="titulo-home">
                  <h2>Encontre seu</h2>
                  <h2> Companheiro de vida aqui!</h2>
                </div>
                  <p>Adotar no PetMate é mais do que dar um lar, é construir uma conexão cheia de amor e lealdade. Cada pet espera por uma chance de fazer parte da sua vida e retribuir com carinho incondicional. Adote e transforme vidas, incluindo a sua!</p>
                
                <div className="botoes-home">
                  <Link to="/adotar">
                    <button className='botao-adotar'>
                      Adotar
                    </button>
                  </Link>

                  {logado ? (
                    <button className='botao-cadastrar' onClick={ () => setOpenModal(true)}>Cadastrar Pet</button>
                  ) : <button className='botao-cadastrar' onClick={ () => navigate('/login')}>Cadastrar Pet</button>}
                </div>

              </div>

              <div className="img-home">
                <img src="/images/dog_marrom_invertido.png" className='dog-home' />
              </div>
            </div>
            <JanelaModal isOpen = {openModal} setModalOpen = {() => setOpenModal(!openModal)} />
            <LastPage />
        </div>
        <Footer />
    </div>
  )
}

export default Inicial;