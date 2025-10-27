import CardPedido from '../components/CardPedido'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './Pedidos.css'

function Pedidos() {
  return (
    <div>
      <Navbar />
      <div className="container-pedidos">
        <CardPedido />
      </div>
      <Footer />
    </div>
  )
}

export default Pedidos
