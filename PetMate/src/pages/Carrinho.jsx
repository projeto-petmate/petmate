import './Carrinho.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getCarrinhos, getCarrinhoItens } from '../apiService';
import Swal from 'sweetalert2';

export default function Carrinho() {
  const { userLogado } = useContext(GlobalContext);
  const [itens, setItens] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;

  useEffect(() => {
    const fetchCarrinhoItens = async () => {

      // Buscar carrinho aberto
      const carrinhos = await getCarrinhos(id_usuario, id_ong);
      const carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto' || c.status === 'ativo') : null;
      if (!carrinho) return;
      // Buscar itens do carrinho
      const itensCarrinho = await getCarrinhoItens(carrinho.id_carrinho || carrinho.id);
      setItens(itensCarrinho);
      // Calcular subtotal
      const total = itensCarrinho.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
      setSubtotal(total);
    };
    fetchCarrinhoItens();
  }, [userLogado]);

  const fecharPedido = () =>{
        Swal.fire({
              title: 'Tem certeza?',
              text: "O carrinho será fechado e um pedido será iniciado.",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#84644D',
              cancelButtonColor: '#84644D',
              confirmButtonText: 'Fechar Carrinho',
              cancelButtonText: 'Voltar',
              customClass: {
                  cancelButton: 'btn-close-custom',
                  confirmButton: 'btn-confirm-custom',
              }
          }).then((result) => {
              if (result.isConfirmed) {
                  alert('oi')
              }
          }) 
  } 

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
            {itens.length === 0 ? (
              <p>Nenhum produto no carrinho.</p>
            ) : (
              <ul>
                {itens.map(item => (
                  <li key={item.id_item} style={{ marginBottom: 12 }}>
                    <b>Coleira personalizada</b><br />
                    <span>Modelo: {item.modelo}</span> | <span>Tamanho: {item.tamanho}</span><br />
                    <span>Cor do tecido: {item.cor_tecido}</span> | <span>Cor da logo: {item.cor_logo}</span><br />
                    <span>Cor da argola: {item.cor_argola}</span> | <span>Cor da presilha: {item.cor_presilha}</span><br />
                    <span>Quantidade: {item.quantidade}</span> | <span>Valor: R${item.valor}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="subtotal">
            <p>Subtotal ({itens.length} produtos):<br />
              R$ {subtotal.toFixed(2)}
            </p>
            <button className='fecharPedido' onClick={fecharPedido}>Fechar pedido</button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
