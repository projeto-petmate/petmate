import './Denuncias.css'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CardDenuncia from '../components/CardDenuncia.jsx'
import FiltroDenuncias from '../components/FiltroDenuncias.jsx'

function Denuncias() {
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
