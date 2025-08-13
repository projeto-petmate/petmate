import './Carrinho.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Carrinho() {
  return (
    <div>
      <Navbar />

      <div className="container-carrinho">
        <div className="banner-coleiras">
          <img src="/images/banner-coleiraCarrinho.svg" className='banner-coleiras' />
        </div>

        <div className="titulo-carrinho">
          <h2>Carrinho de compras</h2>
        </div>

        <div className="container-produtos">
          <div className="produtosAdicionados">
            <h2>Produtos adicionados</h2>
          </div>
          <div className="subtotal">
            <p>Subtotal (x produtos):<br />
            R$ 00,00
            </p>
            <button className='fecharPedido'>Fechar pedido</button>
          </div>
        </div>


      </div>
    </div>
  )
}
