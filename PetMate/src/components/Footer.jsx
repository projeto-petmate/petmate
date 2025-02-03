import React from 'react'
import './Footer.css'
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <div className='footer-container'>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap');
        </style>

        <div className="topo-footer">
          <img className='logo-footer' src="/images/petmate.svg" alt="logo_petmate" />
          <div className="links-footer">
              <p>Termos de Uso</p>
              <Link to="/contato" className='sobre-nos'>
                <p>Sobre nós</p>
              </Link>
              <p>Política de Privacidade</p>
          </div>

          <div className="icons-footer">
              <FaFacebook className='icon_footer'/>
              <FaWhatsapp className='icon_footer'/>
              <FaInstagram className='icon_footer'/>

          </div>
        </div>

        <hr className="barra_footer" />

        <div className="direitos">
          <p>©PetMate todos os direitos reservados.</p>
        </div>
    </div>
  )
}

export default Footer