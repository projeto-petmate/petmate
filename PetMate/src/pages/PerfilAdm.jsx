import React, { useContext, useEffect, useState } from 'react'
import './PerfilAdm.css';
import { FaUsers } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdOutlinePets } from "react-icons/md";
import { BsChatRightHeart } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import ComentarioAdm from '../components/ComentarioAdm';
import PetsAdm from '../components/PetsAdm';
import OngsAdm from '../components/OngsAdm';
import { NavLink, useNavigate } from "react-router-dom";
import UsersAdm from '../components/UsersAdm';
import { GlobalContext } from '../contexts/GlobalContext';

function PerfilAdm() {
  const [mostrar, setMostrar] = useState(0)
  const navigate = useNavigate()
  const { userLogado } = useContext(GlobalContext);

  useEffect (() => {
    if(userLogado.tipo !== 'admin'){
      navigate('/home')
    }
  })

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
              <a className='linksAdm' onClick={() => { setMostrar(1)}}>Usuários</a>
            </div>

            <div className="icon-link2">
              <LuHandshake className='iconAdm2' />
              <a className='linksAdm' onClick={() => { setMostrar(2)}}>ONGs</a>
            </div>

            <div className="icon-link3">
              <MdOutlinePets className='iconAdm3' />
              <a className='linksAdm' onClick={() => { setMostrar(3)}}>Pets</a>
            </div>

            <div className="icon-link4">
              <BsChatRightHeart className='iconAdm4' />
              <a className='linksAdm' onClick={() => { setMostrar(4)}}>Comentários</a>
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
          {mostrar == 0 ? (<p className='gerenciar-title2'>Selecione a área que deseja gerenciar!</p>) : (<p></p>)}
        </div>
        {mostrar == 1 && <UsersAdm />}
        {mostrar == 2 && <OngsAdm />}
        {mostrar == 3 && <PetsAdm />}
        {mostrar == 4 && <ComentarioAdm />}
      </div>
      {/* </div> */}

    </div>
  )
}

export default PerfilAdm