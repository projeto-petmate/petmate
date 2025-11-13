import './Carrinho.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardItemCarrinho from '../components/CardItemCarrinho';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { getCarrinhos, getCarrinhoItens, finalizarCarrinho, addItemCarrinho, addCarrinho, updateItemCarrinho, removeItemCarrinho, getQuantidadeItensCarrinho, deleteCarrinho } from '../apiService';
import Swal from 'sweetalert2';
import { PiWarningCircle } from "react-icons/pi";
import ColeiraPronta from '../components/CardColeiraPronta';
import ModalDadosEntrega from '../components/ModalDadosEntrega';

export default function Carrinho() {
  const { userLogado, qtdItensCarrinho, setQtdItensCarrinho, debug } = useContext(GlobalContext);
  const [itens, setItens] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [carrinhoAtual, setCarrinhoAtual] = useState(null);
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);
  const [openModalFecharCarrinho, setOpenModalFecharCarrinho] = useState(false)

  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;


  const recarregarCarrinho = async () => {

    const carrinhos = await getCarrinhos(id_usuario, id_ong);
    const carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'ativo') : null;

    if (!carrinho) {
      setItens([]);
      setSubtotal(0);
      setCarrinhoAtual(null);
      setQtdItensCarrinho(0);
      return;
    }

    setCarrinhoAtual(carrinho);

    const itensCarrinho = await getCarrinhoItens(carrinho.id_carrinho || carrinho.id);

    setItens(itensCarrinho);

    const total = itensCarrinho.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
    setSubtotal(total);

    const qtdTotal = itensCarrinho.reduce((acc, item) => acc + (item.quantidade || 0), 0);

    if (qtdTotal !== qtdItensCarrinho) {
      setQtdItensCarrinho(qtdTotal);
    }
  };

  useEffect(() => {
    if (userLogado) {
      recarregarCarrinho();
    }
  }, [userLogado]);

  useEffect(() => {

    const qtdAtualItens = itens.reduce((acc, item) => acc + (item.quantidade || 0), 0);

    if (qtdItensCarrinho !== qtdAtualItens && qtdItensCarrinho > 0) {

      setTimeout(() => {
        recarregarCarrinho();
      }, 100);
    }
  }, [qtdItensCarrinho]);

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

      await recarregarCarrinho();

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
        confirmButtonColor: '#84644D',
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

      await recarregarCarrinho();

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
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'ativo') : null;

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0,
        status: 'ativo'
      });
    }

    const item = {
      modelo: 'Peitoral',
      tamanho: 'Pequena',
      cor_tecido: 'Preto',
      cor_logo: 'Branco',
      cor_argola: 'Prata',
      cor_presilha: 'Branco',
      valor: '30.00',
      imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1758217351/pets/i4nyci8zkjlccnkn1gqd.png',
      quantidade: 1
    };

    await addItemCarrinho(carrinho.id_carrinho, item);

    setQtdItensCarrinho(qtdItensCarrinho + 1);
  };

  const apagarCarrinho = async () => {
    try {
      const confirmacao = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Todos os itens do carrinho serão removidos permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#84644D',
        confirmButtonText: 'Sim, apagar tudo!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (!confirmacao.isConfirmed) {
        return;
      }


      Swal.fire({
        title: 'Apagando carrinho...',
        text: 'Aguarde enquanto removemos todos os itens',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let carrinhos = await getCarrinhos(id_usuario || id_ong);
      let carrinho_user = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'ativo') : null;

      if (!carrinho_user) {
        Swal.fire({
          title: 'Carrinho vazio',
          text: 'Não há itens no carrinho para remover.',
          icon: 'info',
          confirmButtonColor: '#84644D',
          timer: 3000,
          timerProgressBar: true
        });
        return;
      }

      const response = await deleteCarrinho(carrinho_user.id_carrinho);

      if (response && (response.success || response.message)) {
        Swal.fire({
          title: 'Carrinho apagado!',
          text: 'Todos os itens foram removidos com sucesso.',
          icon: 'success',
          confirmButtonColor: '#84644D',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error('Resposta inesperada do servidor');
      }

    } catch (error) {
      console.error('Erro ao apagar carrinho:', error);

      Swal.fire({
        title: 'Erro ao apagar carrinho',
        html: `
                <p>Não foi possível apagar o carrinho.</p>
                <p style="color: #666; font-size: 14px;">
                    <strong>Detalhes:</strong> ${error.message || 'Erro interno do servidor'}
                </p>
            `,
        icon: 'error',
        confirmButtonColor: '#84644D',
        confirmButtonText: 'Tentar novamente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          apagarCarrinho();
        }
      });
    }
  };


  return (
    <div className='container-carrinho'>
      <Navbar />
      <div>
        <div className="banner-coleiras">
          <img src="/images/banner-carrinho.svg" className='banner-coleiras' />
        </div>

        <div className="titulo-carrinho">
          <h2>Carrinho de compras</h2>
        </div>

        {debug &&
          <button onClick={itemTeste}>Teste Item</button>
        }

        {debug &&
          <button onClick={apagarCarrinho}>Apagar Carrinho</button>
        }

        {qtdItensCarrinho > 0 ?
          (
            <div className="container-produtos">
              <div className="produtos-adicionados" >
                <div className="container-titulo-carrinho">
                  <div className="produto-title">
                    <p>Produto</p>
                  </div>
                  <div className="valores-title">
                    <p>Preço</p>
                    <p>Quantidade</p>
                    <p>Subtotal</p>
                  </div>
                </div>
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
                  onClick={() => { setOpenModalFecharCarrinho(true) }}
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
              <PiWarningCircle className='icon-warn-itens' />
              <p>Nenhum produto no carrinho.</p>
            </div>
          )
        }
        <div className="container-sugestao-coleiras-carrinho">
          <div className="titulo-carrinho">
            <h2>Você pode gostar</h2>
          </div>
          <ColeiraPronta />
          <ModalDadosEntrega
            isOpen={openModalFecharCarrinho}
            setIsOpen={setOpenModalFecharCarrinho}
            carrinhoAtual={carrinhoAtual}
            itens={itens}
            subtotal={subtotal}
            userLogado={userLogado}
            onPedidoFinalizado={() => {
              setItens([]);
              setSubtotal(0);
              setCarrinhoAtual(null);
              setQtdItensCarrinho(0);
              setOpenModalFecharCarrinho(false);
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}
