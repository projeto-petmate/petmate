import React from 'react'
import { Link } from "react-router-dom"
import './Navbar.css'

function NavDeslogado() {
  return (
    <div>
        <Link to="/login"><button className="loginNav">Entrar</button></Link>
        {/* <Link to="/cadastro"><button className="cadastroNav">Cadastro</button></Link> */}
    </div>
  )
}

export default NavDeslogado