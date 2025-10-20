import React, { useContext, useEffect, useState } from "react";
import "./Gerenciamento.css";
import { FaUsers } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdOutlinePets } from "react-icons/md";
import { BsChatRightHeart } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { BsClipboard2DataFill } from "react-icons/bs";
import ComentarioAdm from "../components/ComentarioAdm";
import PetsAdm from "../components/PetsAdm";
import OngsAdm from "../components/OngsAdm";
import { NavLink, useNavigate } from "react-router-dom";
import UsersAdm from "../components/UsersAdm";
import { GlobalContext } from "../contexts/GlobalContext";
import LastPage from "../components/LastPage";
import PowerBIDashboard from "../components/PowerBIDashboard";

function Gerenciamento() {
  const [mostrar, setMostrar] = useState(5);
  const { isAdmin } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiODA2NDQyNDctMWNlNS00YWM4LWE4MDQtYzM1OTA5YmFjMjAyIiwidCI6IjJjZjdkNGQ1LWJkMWItNDk1Ni1hY2Y4LTI5OTUzOTliMjE2OCJ9";

  //Proteção da rota
  useEffect(() => {
    if (!isAdmin) {
      navigate("/home", { replace: true });
    }
  }, [isAdmin, navigate]);

  return (
    <div className="body-adm">
      <div className="navbar-adm">
        <div className="nav-side left">
          <NavLink to={"/home"}>
            <img
              className="nav-img"
              src="/images/petmate.svg"
              alt="logo_petmate"
              onClick={() => {
                window.location("/home");
              }}
            />
          </NavLink>
        </div>
        <div className="nav-center">
          <h1 className="painel-administrativo">Painel Administrativo</h1>
          <FaTools className="icon-adm-tools" />
        </div>
        <div className="nav-side right"></div>
      </div>

      <div className="navbar-adm-links">
        <div className="navbar-adm-links2">
          <div className="links-gerenciamento">
            <div className="icon-link1">
              <FaUsers className="icon-adm1" />
              <a
                className="links-adm"
                onClick={() => {
                  setMostrar(1);
                }}
              >
                Usuários
              </a>
            </div>

            <div className="icon-link2">
              <LuHandshake className="icon-adm2" />
              <a
                className="links-adm"
                onClick={() => {
                  setMostrar(2);
                }}
              >
                ONGs
              </a>
            </div>

            <div className="icon-link3">
              <MdOutlinePets className="icon-adm3" />
              <a
                className="links-adm"
                onClick={() => {
                  setMostrar(3);
                }}
              >
                Pets
              </a>
            </div>

            <div className="icon-link4">
              <BsChatRightHeart className="icon-adm4" />
              <a
                className="links-adm"
                onClick={() => {
                  setMostrar(4);
                }}
              >
                Comentários
              </a>
            </div>

                <div className="icon-link4">
              <BsClipboard2DataFill className="icon-adm4" />
              <a
                className="links-adm"
                onClick={() => {
                  setMostrar(5);
                }}
              >
                DashBoard
              </a>
            </div>

          </div>
        </div>
      </div>

      <h2 className="h2-adm">Gerenciamento</h2>

      {/* <div className='containeradm'> */}
      {/* <div className="container-adm2"> */}
      {/* <div className="gerenciar-title">
          {mostrar == 0 ? (<p className='gerenciar-title2'>Selecione a área que deseja gerenciar!</p>) : (<p></p>)}
        </div> */}
      {mostrar == 1 && <UsersAdm />}
      {mostrar == 2 && <OngsAdm />}
      {mostrar == 3 && <PetsAdm />}
      {mostrar == 4 && <ComentarioAdm />}
      {mostrar == 5 && <PowerBIDashboard embedUrl={powerBiUrl} width="100%" height="600px" initialShowControls={true} className="petmate-dashboard" />}

      <LastPage />
    </div>
  );
}

export default Gerenciamento;
