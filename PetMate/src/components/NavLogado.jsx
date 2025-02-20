import React, { useContext } from 'react'
import { useState } from "react";
import { Link } from "react-router-dom"
import './Navbar.css'
import { FaUserCircle } from "react-icons/fa";
import JanelaModal from "../components/JanelaModal";
import { GlobalContext } from '../contexts/GlobalContext';


function NavLogado() {
  const { userLogado } = useContext(GlobalContext)

  const [openModal, setOpenCadModal] = useState(false);
    let userData = userLogado
    let userName = userData.nome
    
    const getFirstName = (fullName) => {
      return fullName.split(' ')[0]
    }
  
    userName = getFirstName(userName)
  return (
    <div className='nav-logado'>
        <button className='botao-modal-navbar' onClick={ () => setOpenCadModal(true)}>Anunciar Pet</button>
        <p className="boas-vindas">
          {`Olá, ${userName}!`}
        </p>
        <Link to="/perfil"><FaUserCircle className="profile"/></Link>
        <JanelaModal isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />
        
    </div>
  )
}

export default NavLogado