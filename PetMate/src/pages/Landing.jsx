import React from 'react'
import { Link } from "react-router-dom"
import Navbar from '../components/Navbar'
import './Landing.css'
function Landing() {
  return (
    <div>
      <Navbar />
      <div className="container-landing">
        <div className="base">
          <div className="texto">
            <h2>Dê um Lar, Ganhe um Amigo!</h2>
            <p className="texto-p">Adotar um animal é oferecer uma segunda chance a um ser que precisa de amor. Eles trazem alegria, companheirismo e transformam sua vida. Faça a diferença hoje: adote e descubra o poder do amor incondicional!
            </p>

            <Link to="/login">
              <button>ENTRAR</button>
            </Link>
          </div>
          <div>
            <img className="fundo" src="/images/img_landing.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
