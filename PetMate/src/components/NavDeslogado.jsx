import React from 'react'
import { Link } from "react-router-dom"
import './Navbar.css'

function NavDeslogado() {
  return (
    <div className='botoes-nav-deslogado'>
        <Link to="/login"><button className="login-nav">Entrar</button></Link>
        <Link to="/cadastro"><button className="cad-nav">Cadastrar</button></Link>
    </div>
  )
}

export default NavDeslogado