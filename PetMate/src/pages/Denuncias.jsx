import './Denuncias.css'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CardDenuncia from '../components/CardDenuncia.jsx'
import FiltroDenuncias from '../components/FiltroDenuncias.jsx'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts/GlobalContext.jsx'

function Denuncias() {
  const { isAdmin } = useContext(GlobalContext);
  const navigate = useNavigate();

  //Proteção da rota
  // useEffect(() => {
    // if (!isAdmin) {
      // navigate('/home', { replace: true });
    // }
  // }, [isAdmin, navigate]);

  return (
    <div>
      <Navbar />
      <div className="container-denuncias">
        <FiltroDenuncias />
        <CardDenuncia />
      </div>
      <Footer />
    </div>
  )
}

export default Denuncias
