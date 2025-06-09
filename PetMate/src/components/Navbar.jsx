import React, { useContext, useState } from "react";
import BarraPesquisa from "./BarraPesquisa";
import { NavLink } from "react-router-dom";
import { CgMenuRound } from "react-icons/cg";
import { GlobalContext } from "../contexts/GlobalContext";
import NavLogado from "./NavLogado";
import NavDeslogado from "./NavDeslogado";

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { logado, userLogado } = useContext(GlobalContext);

  return (
    <nav className="navbar-container">
      <div className="img-nav">
        <NavLink to="/home" className="a-logo">
          <img className="nav-img" src="/images/petmate.svg" alt="logo_petmate" />
        </NavLink>
      </div>

      <div className={`botoes-nav ${menuAberto ? "ativo" : ""}`}>
        {userLogado.tipo == 'admin' &&
          <NavLink
            to="/gerenciamento"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuAberto(false)}
          >
            Gerenciamento
          </NavLink>
        }
        {userLogado.tipo == 'admin' &&
          <NavLink
            to="https://app.powerbi.com/view?r=eyJrIjoiNmJmZGFlN2MtOGJhOS00MDVhLTgwZDYtYzkxODVjZjQ4YTQyIiwidCI6IjJjZjdkNGQ1LWJkMWItNDk1Ni1hY2Y4LTI5OTUzOTliMjE2OCJ9"
            target='_blank'
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuAberto(false)}
          >
            Dashboard
          </NavLink>
        }
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
        {
          <NavLink
            to="/favoritos"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuAberto(false)}
          >
            Favoritos
          </NavLink>
        }
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
        {userLogado.tipo == 'admin' &&
          <NavLink
            to="/denuncias"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuAberto(false)}
          >
            Denúncias
          </NavLink>
        }
      </div>

      <div className="perfil-nav">
        {logado ? <NavLogado /> : <NavDeslogado />}
      </div>

      <button className="menu-hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
        <CgMenuRound className="menu-hamburguer-icon" />
      </button>
    </nav>
  );
}

export default Navbar;