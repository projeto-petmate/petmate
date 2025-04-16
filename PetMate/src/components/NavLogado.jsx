import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';
import { FaUserCircle } from "react-icons/fa";
import JanelaModal from "../components/JanelaModal";
import { GlobalContext } from '../contexts/GlobalContext';

function NavLogado() {
  const { userLogado } = useContext(GlobalContext);
  const [openModal, setOpenCadModal] = useState(false);

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  const userName = userLogado?.tipo === 'ong'
    ? userLogado.nome_ong
    : getFirstName(userLogado?.nome || '');

  const userIcon = userLogado?.tipo === 'ong'
    ? userLogado.foto_ong
    : userLogado?.imagem;

  return (
    <div className='nav-logado'>

        <>
          <button className='botao-modal-navbar' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
          <p className="boas-vindas">
            {userLogado && `Olá, ${userName}!`}
          </p>
          <Link to="/perfil">
            {userIcon ? (
              <img src={userIcon} alt="User Icon" className="nav-profile" />
            ) : (
              <FaUserCircle className="profile" />
            )}
          </Link>
          <JanelaModal isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
        </>
      
    </div>
  );
}

export default NavLogado;