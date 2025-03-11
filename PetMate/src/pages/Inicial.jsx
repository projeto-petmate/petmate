import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import JanelaModal from '../components/JanelaModal';
import Navbar from '../components/Navbar';
import { Link,  useNavigate } from "react-router-dom";
import { GlobalContext } from '../contexts/GlobalContext';
import './Inicial.css';
import LastPage from '../components/LastPage';
import { BeatLoader } from "react-spinners";


 function Inicial() {
   const [openModal, setOpenModal] = useState(false);
   const { logado } = useContext(GlobalContext);
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false);
  
   useEffect(() => {
     const hasReloaded = localStorage.getItem('hasReloaded');
 
     setLoading(true); // Ativa o loading
 
     if (!hasReloaded) {
         localStorage.setItem('hasReloaded', 'true');
         window.location.reload();
     } else {
         localStorage.removeItem('hasReloaded');
 
         setTimeout(() => {
           setLoading(false);
       }, 500); 
     }
 }, []);
 
 if (loading) {
   return (
     <div style={{
       position: "fixed",
       top: 0,
       left: 0,
       width: "100%",
       height: "100vh",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo semi-transparente
       zIndex: 9999, // Fica sobre tudo
   }}>
       <BeatLoader color="#8B4513" size={20} />
   </div>
   );
 }


  return (
 
    <div>
        <Navbar />
        <div className="home-container">
            <img src="/images/banner-home-2025.svg" className='banner-home' />
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
                    <button className='botao-cadastrar' onClick={ () => setOpenModal(true)}>Anunciar Pet</button>
                  ) : <button className='botao-cadastrar' onClick={ () => navigate('/login')}>Anunciar Pet</button>}
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