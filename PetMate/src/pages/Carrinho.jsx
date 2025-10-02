import './Carrinho.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardItemCarrinho from '../components/CardItemCarrinho';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getCarrinhos, getCarrinhoItens, finalizarCarrinho, addItemCarrinho, addCarrinho, updateItemCarrinho, removeItemCarrinho, getQuantidadeItensCarrinho } from '../apiService';
import Swal from 'sweetalert2';

export default function Carrinho() {
  const { userLogado, qtdItensCarrinho, setQtdItensCarrinho, debug } = useContext(GlobalContext);
  const [itens, setItens] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [carrinhoAtual, setCarrinhoAtual] = useState(null);
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);
  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;

  useEffect(() => {
    const fetchCarrinhoItens = async () => {

      const carrinhos = await getCarrinhos(id_usuario, id_ong);
      const carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto' || c.status === 'ativo') : null;
      if (!carrinho) {
        setQtdItensCarrinho(0);
        return;
      }

      setCarrinhoAtual(carrinho);

      const itensCarrinho = await getCarrinhoItens(carrinho.id_carrinho || carrinho.id);
      setItens(itensCarrinho);
      const total = itensCarrinho.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
      setSubtotal(total);

      const qtdTotal = itensCarrinho.reduce((acc, item) => acc + (item.quantidade || 0), 0);
      setQtdItensCarrinho(qtdTotal);
    };
    fetchCarrinhoItens();
  }, [userLogado, setQtdItensCarrinho]);

  const handleQuantidadeChange = async (id_item, novaQuantidade) => {
    try {
      const itemAtual = itens.find(item => item.id_item === id_item);
      const diferencaQuantidade = novaQuantidade - itemAtual.quantidade;

      await updateItemCarrinho(id_item, { quantidade: novaQuantidade });

      setItens(prevItens =>
        prevItens.map(item =>
          item.id_item === id_item
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );

      const novosItens = itens.map(item =>
        item.id_item === id_item
          ? { ...item, quantidade: novaQuantidade }
          : item
      );
      const total = novosItens.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
      setSubtotal(total);

      setQtdItensCarrinho(qtdItensCarrinho + diferencaQuantidade);

    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível atualizar a quantidade.',
        icon: 'error',
        confirmButtonColor: '#84644D'
      });
    }
  };

  const handleRemoverItem = async (id_item) => {
    try {
      const result = await Swal.fire({
        title: 'Remover item?',
        text: "Tem certeza que deseja remover este item do carrinho?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#84644D  ',
        cancelButtonColor: '#84644D',
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const itemRemovido = itens.find(item => item.id_item === id_item);

        await removeItemCarrinho(id_item);

        setItens(prevItens => prevItens.filter(item => item.id_item !== id_item));

        const novosItens = itens.filter(item => item.id_item !== id_item);
        const total = novosItens.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
        setSubtotal(total);

        if (itemRemovido) {
          setQtdItensCarrinho(qtdItensCarrinho - itemRemovido.quantidade);
        }

        Swal.fire({
          title: 'Removido!',
          text: 'Item removido do carrinho.',
          icon: 'success',
          confirmButtonColor: '#84644D',
          timer: 2000
        });
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível remover o item.',
        icon: 'error',
        confirmButtonColor: '#84644D'
      });
    }
  };

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

        setItens([]);
        setSubtotal(0);
        setCarrinhoAtual(null);

        setQtdItensCarrinho(0);

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
      tamanho: 'Pequena',
      cor_tecido: 'Preto',
      cor_logo: 'Branca',
      cor_argola: 'Prata',
      cor_presilha: 'Branca',
      valor: '30.00',
      imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1758217351/pets/i4nyci8zkjlccnkn1gqd.png',
      quantidade: 1
    };

    await addItemCarrinho(carrinho.id_carrinho || carrinho.id, item);

    setQtdItensCarrinho(qtdItensCarrinho + 1);
    // window.location.reload()
  }




  return (
    <div className='container-carrinho'>
      <Navbar />
      <div>
        <div className="banner-coleiras">
          <img src="/images/banner-coleiraCarrinho.svg" className='banner-coleiras' />
        </div>

        <div className="titulo-carrinho">
          <h2>Carrinho de compras</h2>
        </div>

        {debug &&
          <button onClick={itemTeste}>Teste Item</button>
        }
        {qtdItensCarrinho > 0 ?
          (
            <div className="container-produtos">
              <div className="produtos-adicionados" >
                <div className="container-titulo-carrinho">
                  <div className="produto-title">
                    <p>Produto</p>
                    {/* <p>Personalização</p> */}
                  </div>
                  <div className="valores-title">
                    <p>Preço</p>
                    <p>Quantidade</p>
                    <p>Subtotal</p>
                  </div>
                </div>
                {/* <h2>Produtos adicionados</h2> */}

                <div className="container-cards-itens">
                  {itens.map(item => (
                    <CardItemCarrinho
                      key={item.id_item}
                      item={item}
                      onQuantidadeChange={handleQuantidadeChange}
                      onRemover={handleRemoverItem}
                    />
                  ))}
                </div>
              </div>
              <div className="subtotal">
                <div className="container-teste">

                </div>
                <p>
                  Subtotal:
                  R$ {subtotal.toFixed(2)} ({qtdItensCarrinho} {qtdItensCarrinho > 1 ? ('itens') : ('item')})
                </p>
                <button
                  className='btn-fechar-pedido'
                  onClick={fecharPedido}
                  disabled={finalizandoPedido}
                >
                  {finalizandoPedido ? 'Finalizando...' : 'Fechar pedido'}
                </button>
              </div>
            </div>
          )
          :
          (
            <div className='sem-itens'>
              <p>Nenhum produto no carrinho.</p>
            </div>
          )

        }
      </div>
      <Footer />
    </div>
  )
}
