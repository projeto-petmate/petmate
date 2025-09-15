import './Carrinho.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getCarrinhos, getCarrinhoItens, finalizarCarrinho, addItemCarrinho, addCarrinho } from '../apiService';
import Swal from 'sweetalert2';

export default function Carrinho() {
  const { userLogado } = useContext(GlobalContext);
  const [itens, setItens] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [carrinhoAtual, setCarrinhoAtual] = useState(null);
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);
  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;

  useEffect(() => {
    const fetchCarrinhoItens = async () => {

      // Buscar carrinho aberto
      const carrinhos = await getCarrinhos(id_usuario, id_ong);
      const carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto' || c.status === 'ativo') : null;
      if (!carrinho) return;

      setCarrinhoAtual(carrinho);

      // Buscar itens do carrinho
      const itensCarrinho = await getCarrinhoItens(carrinho.id_carrinho || carrinho.id);
      setItens(itensCarrinho);
      // Calcular subtotal
      const total = itensCarrinho.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
      setSubtotal(total);
    };
    fetchCarrinhoItens();
  }, [userLogado]);

  const fecharPedido = async () => {
    if (!carrinhoAtual) {
      Swal.fire({
        title: 'Erro!',
        text: 'Nenhum carrinho encontrado para finalizar.',
        icon: 'error',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    if (itens.length === 0) {
      Swal.fire({
        title: 'Carrinho vazio!',
        text: 'Adicione produtos ao carrinho antes de finalizar o pedido.',
        icon: 'warning',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
      try {
        setFinalizandoPedido(true);

        const dadosPedido = {
          endereco_entrega: {
            uf: userLogado.uf,
            bairro: userLogado.bairro,
          },
          observacoes: ''
        };

        const resposta = await finalizarCarrinho(carrinhoAtual.id_carrinho || carrinhoAtual.id, dadosPedido);

        Swal.fire({
          title: 'Pedido realizado!',
          text: `Seu pedido foi criado com sucesso e enviado para produção. ID do pedido: ${resposta.pedido?.id_pedido}`,
          icon: 'success',
          confirmButtonColor: '#84644D'
        });

        // Limpar o carrinho da interface
        setItens([]);
        setSubtotal(0);
        setCarrinhoAtual(null);

      } catch (error) {
        console.error('Erro ao finalizar carrinho:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível finalizar o pedido. Tente novamente.',
          icon: 'error',
          confirmButtonColor: '#84644D'
        });
      } finally {
        setFinalizandoPedido(false);
      }
    }
  };

  const itemTeste = async () => {
    let carrinhos = await getCarrinhos(id_usuario || id_ong);
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto') : null;

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0
      });
    }
    const item = {
      modelo: 'Peitoral',
      tamanho: 'P',
      cor_tecido: 'preto',
      cor_logo: 'azul',
      cor_argola: 'prata',
      cor_presilha: 'azul',
      valor: '30.00',
      quantidade: 1
    };

    await addItemCarrinho(carrinho.id_carrinho || carrinho.id, item)
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
            <div className="container-teste">
              <button onClick={itemTeste}>Teste</button>
            </div>
            <p>Subtotal ({itens.length} produtos):<br />
              R$ {subtotal.toFixed(2)}
            </p>
            {itens.length > 0 && (
              <button
                className='fecharPedido'
                onClick={fecharPedido}
                disabled={finalizandoPedido}
              >
                {finalizandoPedido ? 'Finalizando...' : 'Fechar pedido'}
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
