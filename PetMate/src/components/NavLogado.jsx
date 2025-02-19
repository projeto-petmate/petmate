import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom"
import './Navbar.css'
import { FaUserCircle } from "react-icons/fa";
import JanelaModal from "../components/JanelaModal";


function NavLogado() {

  const [openModal, setOpenCadModal] = useState(false);

  return (
    <div className='nav-logado'>
        <button className='botao-modal-navbar' onClick={ () => setOpenCadModal(true)}>Anunciar Pet</button>

        <Link to="/perfil"><FaUserCircle className="profile"/></Link>
        <JanelaModal isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
        
    </div>
  )
}

export default NavLogado