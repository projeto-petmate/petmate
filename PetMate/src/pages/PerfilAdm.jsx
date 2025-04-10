import React from 'react'
import './PerfilAdm.css';
import { FaUsers } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdOutlinePets } from "react-icons/md";
import { BsChatRightHeart } from "react-icons/bs";
import { FaTools } from "react-icons/fa";

function PerfilAdm() {
  return (
    <div className='body-adm'>
      <div className='NavbarAdm'>
        <div className='nav-side left'>
          <img className="nav-img" src="/images/petmate.svg" alt="logo_petmate" />
        </div>
        <div className='nav-center'>
          <h1 className='painelAdministrativo'>Painel Administrativo</h1>
          <FaTools className='iconAdmTools' />
        </div>
        <div className='nav-side right'></div>
      </div>

      <div className='NavbarAdm-links'>
        <div className='NavbarAdm-links2'>
          <div className="links-geneciamento">
            <div className='icon-link1'>
              <FaUsers className='iconAdm1' />
              <a className='linksAdm'>Usuários</a>
            </div>

            <div className="icon-link2">
              <LuHandshake className='iconAdm2' />
              <a className='linksAdm'>ONGs</a>
            </div>

            <div className="icon-link3">
              <MdOutlinePets className='iconAdm3' />
              <a className='linksAdm'>Pets</a>
            </div>

            <div className="icon-link4">
              <BsChatRightHeart className='iconAdm4' />
              <a className='linksAdm'>Comentários</a>
            </div>
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