import { useContext, useState } from 'react';
import { addCarrinho, addItemCarrinho, getCarrinhos, getQuantidadeItensCarrinho } from '../apiService';
import './CardColeiraPronta.css'
import { FaCartPlus, FaPaintBrush } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import Swal from 'sweetalert2'
import ModalPersonalizarColeira from './ModalPersonalizarColeira';
import { CgCloseO, CgSize } from 'react-icons/cg';
import { MdOutlinePets } from 'react-icons/md';

function CardColeiraPronta() {
  const { userLogado, qtdItensCarrinho, setQtdItensCarrinho, setAplicarCoresCallback, sugestoes, carregarQuantidadeItensCarrinho } = useContext(GlobalContext);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [coleira, setColeira] = useState(null)
  const [mostraTamanho, setMostraTamanho] = useState(false)

  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;

  const modalSelecionarTamanho = (numItem) => {
    const item = JSON.parse(JSON.stringify(sugestoes.find(s => s.id === numItem)))
    setColeira(item)

    // let tamanho = null

    setMostraTamanho(true)

    console.log('ITEM: ', item)

  }

  const finalizarTamanhoColeira = async (t) => {
    let carrinhos = await getCarrinhos(id_usuario || id_ong);
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'ativo') : null;

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0
      });
    }

    setColeira({ ...coleira, tamanho: t })
    console.log({ ...coleira, tamanho: t })
    let item = { ...coleira, tamanho: t }

    await addItemCarrinho(carrinho.id_carrinho, item);
    
    try {
        const qtdReal = await carregarQuantidadeItensCarrinho();
        console.log('📊 CardColeiraPronta: Quantidade sincronizada:', qtdReal);
    } catch (error) {
        console.error('Erro ao sincronizar quantidade:', error);
        // Fallback
        setQtdItensCarrinho(qtdItensCarrinho + 1);
    }

    setMostraTamanho(false)

    Swal.fire({
      title: 'Sucesso!',
      html: `
                    <div style="text-align: center;">
                        <p><strong>Coleira adicionada ao carrinho!</strong></p>
                    </div>
                `,
      icon: 'success',
      confirmButtonColor: '#84644D',
      timer: 5000,
      timerProgressBar: true
    });
  }

  const personalizarColeiraPronta = (numItem) => {
    const item = sugestoes.find(s => s.id === numItem)

    console.log('Preparando para personalizar item:', numItem, item);

    const configuracao = {
      modelo: item.modelo,
      tamanho: item.tamanho,
      corTecido: item.cor_tecido,
      corLogo: item.cor_logo,
      corArgola: item.cor_argola,
      corPresilha: item.cor_presilha,
      valor: parseFloat(item.valor)
    };

    localStorage.setItem('coleiraProntaConfig', JSON.stringify(configuracao));

    setAplicarCoresCallback(() => {
      return (atualizarColeiraFn) => {
        setTimeout(() => {
          atualizarColeiraFn("modelo", item.modelo);
          atualizarColeiraFn("tamanho", item.tamanho);
          atualizarColeiraFn("corTecido", item.cor_tecido);
          atualizarColeiraFn("corLogo", item.cor_logo);
          atualizarColeiraFn("corArgola", item.cor_argola);
          atualizarColeiraFn("corPresilha", item.cor_presilha);
          console.log('✅ Configuração aplicada com sucesso!');
        }, 100);
      };
    });

    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setItemSelecionado(null);
    setAplicarCoresCallback(null);
  };

  return (
    <div>
      <div className="container-coleira-pronta">
        {mostraTamanho &&
          <div className="modal-botoes-tamanho" onClick={() => { setMostraTamanho(false) }}>
            <div className="container-botoes-tamanho" onClick={(e) => e.stopPropagation()} >
              <div className="titulo-botoes-tamanho">
                <div className="texto-titulo-tamanho">
                  <p>
                    {/* <MdOutlinePets /> */}
                    Selecione o tamanho da coleira:
                  </p>
                  {/* <hr src="/images/barra_marrom.png" className='barra-tamanho-coleira' /> */}
                </div>
                <CgCloseO className='botao-fechar-tamanho' onClick={() => { setMostraTamanho(false) }}/>
              </div>
              <div className="botoes-tamanho">
                <button className='botao-tam-pequeno' onClick={() => finalizarTamanhoColeira('Pequena')}>
                  Pequena
                </button>
                <button className='botao-tam-medio' onClick={() => finalizarTamanhoColeira('Média')}>
                  Média
                </button>
                <button className='botao-tam-grande' onClick={() => finalizarTamanhoColeira('Grande')}>
                  Grande
                </button>
              </div>
            </div>
          </div>
        }
        {sugestoes.map((s) => (
          <div key={s.id} className="card-coleira-pronta">
            <img src={s.imagem} alt="" />
            <div className="valor-item">
              <span>R${parseFloat(s.valor).toFixed(2)}</span>
            </div>
            <span className="detalhes-item-pronto">
              <span className='chips-coleira-pronta'>
                Modelo: {s.modelo}
              </span>
              <span className='chips-coleira-pronta'>
                Tecido: {s.cor_tecido}
              </span>
              <span className='chips-coleira-pronta'>
                Logo: {s.cor_logo}
              </span>
              <span className='chips-coleira-pronta'>
                Argola: {s.cor_argola}
              </span>
              <span className='chips-coleira-pronta'>
                Presilha: {s.cor_presilha}
              </span>
            </span>
            <div className="container-add-carrinho" onClick={() => { modalSelecionarTamanho(s.id) }}>
              <FaCartPlus className="icon-add-carrinho" />
              <p>Adicionar ao carrinho</p>
            </div>
            <div className="container-personalizar-carrinho" onClick={() => personalizarColeiraPronta(s.id)}>
              <FaPaintBrush className="icon-personalizar-carrinho" />
              <p>Personalizar</p>
            </div>
          </div>
        ))}
      </div>
      <ModalPersonalizarColeira
        open={modalAberto}
        onClose={fecharModal}
      />
    </div>
  )
}

export default CardColeiraPronta
