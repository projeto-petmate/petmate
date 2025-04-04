import React, { useContext, useEffect } from 'react'
import { useState } from "react";
import { Link } from "react-router-dom"
import './Navbar.css'
import { FaUserCircle } from "react-icons/fa";
import JanelaModal from "../components/JanelaModal";



function NavLogado() {
  const userLogado = JSON.parse(localStorage.getItem("userLogado"));
  const vrfOng = JSON.parse(localStorage.getItem("vrfOng"));
  const [openModal, setOpenCadModal] = useState(false);
  let userName = userLogado.nome;
  let userNameOng = userLogado.nome_ong;
  let userIcon = userLogado.imagem;
  // let userIconOng = userLogado.foto_ong;

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  {vrfOng ? userName = userNameOng : userName = getFirstName(userName);}
  {vrfOng ? userIcon =  userLogado.foto_ong : userIcon = userIcon}

  return (
    <div className='nav-logado'>
      <button className='botao-modal-navbar' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
      <p className="boas-vindas">
        {userLogado && `Olá, ${userName}!`}
      </p>
      <Link to="/perfil">
        {userIcon != null ? (
          <img src={userIcon} alt="User Icon" className="nav-profile" />
        ) : (
          <FaUserCircle className="profile" />
        )}
      </Link>
      <JanelaModal isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
    </div>
  );
}

export default NavLogado;