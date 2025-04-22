import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import JanelaModal from '../components/JanelaModal';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";
import './Inicial.css';
import LastPage from '../components/LastPage';
import Swal from 'sweetalert2'
import { GlobalContext } from '../contexts/GlobalContext';


function Inicial() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate()
  const { logado } = useContext(GlobalContext)

  const ModalLogin = async () => {
    Swal.fire({
        title: "Atenção!",
        html: `
            <p style="color: #84644D; font-size: 20px; margin-bottom: 15px;">
                Você deve entrar para anunciar um pet!
            </p>
        `,
        icon: "warning",
        background: "#F6F4F1", 
        color: "#654833", 
        confirmButtonText: "Fazer Login",
        confirmButtonColor: "#84644D", 
        cancelButtonText: "Cancelar",
        showCancelButton: true, 
        customClass: {
            popup: "custom-swal-popup", 
            title: "custom-swal-title",
            confirmButton: "botao-swal-login",
            cancelButton: "botao-swal-cancelar", 
        },
    }).then((result) => {
        if (result.isConfirmed) {
            navigate("/login");
        }
    });
};

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
                <button className='botao-cadastrar' onClick={() => setOpenModal(true)}>Anunciar Pet</button>
              ) : <button className='botao-cadastrar' onClick={() => ModalLogin()}>Anunciar Pet</button>}
            </div>
          </div>
          <div className="img-home">
            <img src="/images/dog_marrom_invertido.png" className='dog-home' />
          </div>
        </div>
        <JanelaModal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)} />
        <LastPage />
      </div>
      <Footer />
    </div>
  )
}

export default Inicial;