import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';
import { FaUserCircle } from "react-icons/fa";
import ModalAnunciarPet from "../components/ModalAnunciarPet";
import { GlobalContext } from '../contexts/GlobalContext';
import { FiShoppingCart } from "react-icons/fi";


function NavLogado() {
  const { userLogado, qtdItensCarrinho } = useContext(GlobalContext);
  const [openModal, setOpenCadModal] = useState(false);

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  const userName = userLogado?.tipo === 'ong'
    ? userLogado.nome_ong
    : getFirstName(userLogado?.nome || '');

  const userIcon = userLogado?.tipo === 'ong'
    ? userLogado.foto_perfil
    : userLogado?.imagem;

  return (
    <div className='nav-logado'>
        <button className='botao-modal-navbar' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
        <p className="boas-vindas">
          {userLogado && `Olá, ${userName}!`}
        </p>
        <div className="user-icon-container-nav">
          <Link to="/perfil">
            {userIcon ? (
              <img src={userIcon} alt="User Icon" className="nav-profile" />
            ) : (
              <FaUserCircle className="profile" />
            )}
          </Link>
          <span className="texto-perfil">Ir para o perfil</span>
        </div>

        <div className="carrinho-container">
          <Link to="/carrinho">
            <FiShoppingCart className='icon-carrinho' />
          </Link>
          {/* <Link to="/carrinho"> */}
          {qtdItensCarrinho > 0 && (
            <div className="container-badge-carrinho" title='Quantidade de itens no carrinho'>
              <span className="badge-carrinho">{qtdItensCarrinho}</span>
            </div>
          )}
          {/* </Link> */}
        </div>
        <ModalAnunciarPet isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
    </div>
  );
}

export default NavLogado;