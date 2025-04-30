import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import JanelaModal from '../components/JanelaModal';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";
import './Inicial.css';
import LastPage from '../components/LastPage';
import Swal from 'sweetalert2'
import { GlobalContext } from '../contexts/GlobalContext';
import Carrossel from '../components/Carrossel';


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
        <Carrossel />
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

        <div className="info-cards">
          <div className="card-info">
            <img src="/images/cachorro1-card.png" alt="Importância da adoção" />
            <div className='texto-info'>
              <h3>A importância da adoção</h3>
              <p>Adotar salva vidas e oferece uma segunda chance a animais abandonados. Além de transformar o destino de um pet, a adoção traz amor, alegria e companheirismo para sua vida.</p>
            </div>
          </div>

          <div className="card-info">
            <img src="/images/gato-card.png" alt="Ato de responsabilidade" />
            <div className='texto-info'>
              <h3>Adotar é um ato de responsabilidade</h3>
              <p>Adotar é um compromisso sério. Um pet precisa de cuidado, atenção e amor por toda a vida. Adoção responsável garante bem-estar para o animal e uma convivência feliz para todos.</p>
            </div>
          </div>

          <div className="card-info">
            <img src="/images/cachorro2-card.png" alt="Adotar e não comprar" />
            <div className='texto-info'>
              <h3>Por que adotar e não comprar?</h3>
              <p>Adotar combate o comércio exploratório de animais e salva vidas. Milhares de pets esperam por um lar amoroso — adotar é um ato de compaixão e transformação.</p>
            </div>
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