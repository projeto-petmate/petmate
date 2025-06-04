import './Denuncias.css'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CardDenuncia from '../components/CardDenuncia.jsx'
import FiltroDenuncias from '../components/FiltroDenuncias.jsx'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts/GlobalContext.jsx'
import { useNavigate } from 'react-router-dom'

function Denuncias() {
    const { userLogado } = useContext(GlobalContext);
    const navigate = useNavigate()
    
    useEffect (() => {
      if(userLogado.tipo !== 'admin'){
        navigate('/home')
      }
    })

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
