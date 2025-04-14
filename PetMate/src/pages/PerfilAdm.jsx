import React, { useState } from 'react'
import './PerfilAdm.css';
import { FaUsers } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdOutlinePets } from "react-icons/md";
import { BsChatRightHeart } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import ComentarioAdm from '../components/ComentarioAdm';
import PetsAdm from '../components/PetsAdm';
import OngsAdm from '../components/OngsAdm';
import { NavLink } from "react-router-dom";
import UsersAdm from '../components/UsersAdm';

function PerfilAdm() {
  const [mostrarPet, setMostrarPet] = useState(false)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [mostrarOng, setMostrarOng] = useState(false)
  const [mostrarUsers, setMostrarUsers] = useState(false)
  return (
    <div className='body-adm'>
      <div className='NavbarAdm'>
        <div className='nav-side left'>
          <NavLink to={'/home'}>
            <img className="nav-img" src="/images/petmate.svg" alt="logo_petmate" onClick={() => { window.location('/home') }} />
          </NavLink>
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
              <a className='linksAdm' onClick={() => { setMostrarComentario(false), setMostrarPet(false), setMostrarOng(false), setMostrarUsers(true) }}>Usuários</a>
            </div>

            <div className="icon-link2">
              <LuHandshake className='iconAdm2' />
              <a className='linksAdm' onClick={() => { setMostrarComentario(false), setMostrarPet(false), setMostrarOng(true), setMostrarUsers(false) }}>ONGs</a>
            </div>

            <div className="icon-link3">
              <MdOutlinePets className='iconAdm3' />
              <a className='linksAdm' onClick={() => { setMostrarComentario(false), setMostrarPet(true), setMostrarOng(false), setMostrarUsers(false) }}>Pets</a>
            </div>

            <div className="icon-link4">
              <BsChatRightHeart className='iconAdm4' />
              <a className='linksAdm' onClick={() => { setMostrarComentario(true), setMostrarPet(false), setMostrarOng(false), setMostrarUsers(false) }}>Comentários</a>
            </div>
          </div>
        </div>
      </div>

      <h2 className='h2Adm'>
        Gerenciamento
      </h2>

      {/* <div className='containeradm'> */}
      <div className="containeradm2">
        <div className="gerenciar-title">
          {mostrarPet == false && mostrarOng == false && mostrarComentario == false && mostrarUsers == false ? (<p>Selecione a área que deseja gerenciar!</p>) : (<p></p>)}
        </div>
        {mostrarPet && <PetsAdm />}
        {mostrarComentario && <ComentarioAdm />}
        {mostrarOng && <OngsAdm />}
        {mostrarUsers && <UsersAdm />}
      </div>
      {/* </div> */}

    </div>
  )
}

export default PerfilAdm