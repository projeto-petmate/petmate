import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext"
import './Navbar.css'
import NavDeslogado from "./NavDeslogado"
import NavLogado from "./NavLogado"
import BarraPesquisa from "./BarraPesquisa"
import { NavLink } from "react-router-dom";
import { CgMenuRound } from "react-icons/cg";

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logado, userLogado } = useContext(GlobalContext);
  const [isLogado, setIsLogado] = useState(logado);

  useEffect(() => {
    const storedLogado = JSON.parse(localStorage.getItem("logado"));
    if (storedLogado !== null) {
      setIsLogado(storedLogado);
    }
  }, [logado]);

  return (
    <nav className="navbar-container">
      <div className="img-nav">
        <NavLink to="/home" className="a-logo">
          <img className="nav-img" src="/images/petmate.svg" alt="logo_petmate" />
        </NavLink>
      </div>

      {/* Ícone do menu hambúrguer */}
      <button className="menu-hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
        <CgMenuRound className="menu-hamburguer-icon" />
      </button>

      <div className={`botoes-nav ${menuAberto ? "ativo" : ""}`}>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setMenuAberto(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/adotar"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setMenuAberto(false)}
        >
          Adotar
        </NavLink>
        <NavLink
          to="/ongs"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setMenuAberto(false)}
        >
          ONGs
        </NavLink>
        <NavLink
          to="/feedback"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setMenuAberto(false)}
        >
          Feedback
        </NavLink>
      </div>

      <div className="perfil-nav">
        {isLogado ? <NavLogado /> : <NavDeslogado />}
      </div>
    </nav>
  );
}

export default Navbar;