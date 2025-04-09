import React from 'react'
import './PerfilAdm.css';
import { FaUsers } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";
import { BsChatRightHeart } from "react-icons/bs";

function PerfilAdm() {
  return (
    <div className='body-adm'>
      <div className='NavbarAdm'>
      <img className="nav-img" src="/images/petmate.svg" alt="logo_petmate" />
      <h1 className='painelAdministrativo'>Painel Administrativo</h1>
      </div>

      <div className='NavbarAdm-links'>
      <div className="links-geneciamento">
        <div className='icon-link'>
        <FaUsers className='iconAdm'/>
        <a className='linksAdm'>Usuários</a>
        </div>

        <div className="icon-link">
        <FaRegHandshake className='iconAdm'/>
        <a className='linksAdm'>ONGs</a>
        </div>

        <div className="icon-link">
        <MdOutlinePets className='iconAdm'/>
        <a className='linksAdm'>Pets</a>
        </div>

        <div className="icon-link">
        <BsChatRightHeart className='iconAdm'/>
        <a className='linksAdm'>Comentários</a>
        </div>
        
      </div>
      </div>

      <h2 className='h2Adm'>Gerenciamento</h2>

      <div className='containeradm'>
      <div className="containeradm2"></div>
      </div>
      
    </div>
  )
}

export default PerfilAdm