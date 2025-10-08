import { useContext, useState } from 'react';
import { addCarrinho, addItemCarrinho, getCarrinhos } from '../apiService';
import './CardColeiraPronta.css'
import { FaCartPlus, FaPaintBrush } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import Swal from 'sweetalert2'
import ModalPersonalizarColeira from './ModalPersonalizarColeira';

function CardColeiraPronta() {
  const { userLogado, qtdItensCarrinho, setQtdItensCarrinho, setAplicarCoresCallback, sugestoes } = useContext(GlobalContext);
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
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto') : null;
    

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0
      });
    }

    setColeira({...coleira, tamanho: t})
    console.log({...coleira, tamanho: t})
    let item = {...coleira, tamanho: t}
    await addItemCarrinho(carrinho.id_carrinho || carrinho.id, item);

    setQtdItensCarrinho(qtdItensCarrinho + 1);

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

  const addColeiraPronta = async (numItem) => {
    let carrinhos = await getCarrinhos(id_usuario || id_ong);
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto') : null;
    const item = sugestoes.find(s => s.id === numItem)
    // let tamanhoSelecionado = null

    // tamanhoSelecionado = modalSelecionarTamanho()

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0
      });
    }

    // if (tamanhoSelecionado != null) {

    // item.tamanho = tamanhoSelecionado

    await addItemCarrinho(carrinho.id_carrinho || carrinho.id, item);

    setQtdItensCarrinho(qtdItensCarrinho + 1);

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
    // }
    // window.location.reload()
  }

  const personalizarColeiraPronta = (numItem) => {
    const item = sugestoes.find(s => s.id === numItem)

    console.log('🎨 Preparando para personalizar item:', numItem, item);

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

  // const item1 = {
  //   modelo: 'Peitoral',
  //   tamanho: 'Média',
  //   cor_tecido: 'Preto',
  //   cor_logo: 'Branco',
  //   cor_argola: 'Prata',
  //   cor_presilha: 'Branco',
  //   valor: '30.00',
  //   imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1758217351/pets/i4nyci8zkjlccnkn1gqd.png',
  //   quantidade: 1
  // };

  // const item2 = {
  //   modelo: 'Cabresto',
  //   tamanho: 'Média',
  //   cor_tecido: 'Azul',
  //   cor_logo: 'Branco',
  //   cor_argola: 'Prata',
  //   cor_presilha: 'Preto',
  //   valor: '40.00',
  //   imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1759774404/pets/i5spm3pwsznymouxqy3s.png',
  //   quantidade: 1
  // };

  // const item3 = {
  //   modelo: 'Pescoço',
  //   tamanho: 'Média',
  //   cor_tecido: 'Vermelho',
  //   cor_logo: 'Branco',
  //   cor_argola: 'Prata',
  //   cor_presilha: 'Branco',
  //   valor: '20.00',
  //   imagem: 'https://res-console.cloudinary.com/danyxbuuy/thumbnails/v1/image/upload/v1759774790/cGV0cy96NmhnaWplbndiczlkYTFtdmpjeQ==/drilldown',
  //   quantidade: 1
  // };

  return (
    <div>
      {mostraTamanho &&
        <div className="botoes-tamanho">
          <button onClick={() => finalizarTamanhoColeira('Pequena')}>
            Pequena
          </button>
          <button onClick={() => finalizarTamanhoColeira('Média')}>
            Média
          </button>
          <button onClick={() => finalizarTamanhoColeira('Grande')}>
            Grande
          </button>
        </div>
      }
      <div className="container-coleira-pronta">
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
